import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoData } from '../src/data/seed.ts';
import {
  execute,
  visibleTasks,
  visibleActivity,
  accessibleChannels,
  readMessages,
  seatTotal,
  findUsersByName,
} from '../src/domain/service.ts';
import type { Command } from '../src/domain/service.ts';
import { reconcileCountdown } from '../src/domain/countdown.ts';
import { isAppData, LocalRepository, STORAGE_KEY } from '../src/services/repository.ts';
import type { AppData, TaskInput } from '../src/domain/types.ts';

class AuditStorage {
  values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
  clear() {
    this.values.clear();
  }
  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }
  get length() {
    return this.values.size;
  }
}
const seed = () => createDemoData(Date.parse('2026-10-21T18:00:00Z'));

test('AUD-01 task editing ignores injected status and preserves the current status', () => {
  const data = seed();
  const current = data.tasks[0];
  const input = { ...current, description: 'Descripción corregida', status: 'Bloqueada' };
  const next = execute(data, 'admin', { type: 'saveTask', id: current.id, input });
  assert.equal(next.tasks[0].status, current.status);
  assert.equal(isAppData(next), true);
});
test('AUD-01 task editing cannot overwrite identity or creation metadata', () => {
  const data = seed();
  const task = data.tasks[0];
  const input = {
    ...task,
    description: 'Descripción corregida',
    id: 'foreign-id',
    createdBy: 'missing',
    createdAt: 'invalid',
  };
  const next = execute(data, 'admin', { type: 'saveTask', id: task.id, input });
  assert.equal(next.tasks[0].description, input.description);
  assert.equal(next.tasks[0].id, task.id);
  assert.equal(next.tasks[0].createdAt, task.createdAt);
  assert.equal(next.tasks[0].createdBy, task.createdBy);
  assert.equal(isAppData(next), true);
});
test('AUD-01 stale editor payload cannot revert a newly completed task', () => {
  const data = seed();
  const stale = { ...data.tasks[0], description: 'Corrección de texto' };
  const completed = execute(data, 'mateo', {
    type: 'taskStatus',
    id: stale.id,
    status: 'Completada',
  });
  const next = execute(completed, 'admin', { type: 'saveTask', id: stale.id, input: stale });
  assert.equal(next.tasks[0].status, 'Completada');
});
test('AUD-02 empty persisted text is corruption, never silently reseeded', () => {
  const storage = new AuditStorage();
  storage.setItem(STORAGE_KEY, '');
  const repository = new LocalRepository(storage as Storage);
  assert.throws(() => repository.load(), /conservado/);
  assert.equal(storage.getItem(STORAGE_KEY), '');
});
test('AUD-03 enum values must be actual strings, not coercible arrays', () => {
  const mutate = [
    (d: any) => {
      d.tasks[0].status = ['En curso'];
    },
    (d: any) => {
      d.tasks[0].priority = ['Alta'];
    },
    (d: any) => {
      d.tasks[0].assignment = ['individual'];
    },
    (d: any) => {
      d.users[2].role = ['STAFF'];
    },
    (d: any) => {
      d.countdown.status = ['stopped'];
    },
    (d: any) => {
      d.notifications[0].type = ['assignment'];
    },
  ];
  for (const change of mutate) {
    const d = seed();
    change(d);
    assert.equal(isAppData(d), false);
  }
});
test('AUD-03 impossible countdown snapshots are rejected for recovery', () => {
  const mutations = [
    (d: AppData) => {
      d.countdown.status = 'finished';
    },
    (d: AppData) => {
      d.countdown.endsAt = Date.now();
    },
    (d: AppData) => {
      d.countdown.remainingMs = 999999999;
    },
    (d: AppData) => {
      d.countdown.status = 'finished';
      d.countdown.remainingMs = 0;
      d.countdown.currentIndex = 0;
    },
  ];
  for (const change of mutations) {
    const d = seed();
    change(d);
    assert.equal(isAppData(d), false);
  }
});
test('AUD-03 repository refuses invalid snapshots and retains existing data', () => {
  const storage = new AuditStorage();
  const repository = new LocalRepository(storage as Storage);
  const original = repository.load();
  const broken = structuredClone(original);
  broken.tasks[0].assigneeId = 'missing';
  assert.throws(() => repository.save(broken), /válid|inconsisten/);
  assert.deepEqual(repository.load(), original);
});
test('AUD-04 read permissions use the stored role, not a supplied or stale role', () => {
  const data = seed();
  const staff = data.users.find((u) => u.id === 'mateo')!;
  const claimedAdmin = { ...staff, role: 'ADMIN' as const };
  assert.deepEqual(visibleTasks(data, claimedAdmin), visibleTasks(data, staff));
  assert.deepEqual(accessibleChannels(data, claimedAdmin), accessibleChannels(data, staff));
  assert.deepEqual(visibleActivity(data, claimedAdmin), visibleActivity(data, staff));
  assert.throws(() => accessibleChannels(data, { ...claimedAdmin, id: 'missing' }), /sesión/);
});
test('AUD-05 republishing an assigned task logs its implicit state reset', () => {
  const data = seed();
  const original = data.tasks[0];
  const next = execute(data, 'admin', {
    type: 'saveTask',
    id: original.id,
    input: { ...original, assignment: 'free', assigneeId: null },
  });
  assert.equal(next.tasks[0].status, 'Pendiente');
  assert.ok(
    next.activity.some(
      (a) =>
        a.entityId === original.id &&
        a.action === 'task-status' &&
        a.description.includes('En curso → Pendiente'),
    ),
  );
});
test('AUD-06 invalid primitive task inputs fail before a snapshot is produced', () => {
  const task = seed().tasks[0];
  for (const partial of [{ dueAt: 0 }, { assigneeId: '' }, { description: null }]) {
    const input = { ...task, ...partial } as unknown as TaskInput;
    assert.throws(() => execute(seed(), 'admin', { type: 'saveTask', id: task.id, input }));
  }
});

test('ACC-01 name access returns the preset role and does not create unknown users', () => {
  const data = seed();
  for (const [name, role] of [
    [' ALEX MORGAN ', 'ADMIN'],
    ['lucia torres', 'TEAM_LEADER'],
    ['mateo ruiz', 'STAFF'],
  ]) {
    assert.equal(findUsersByName(data, name)[0].role, role);
  }
  const count = data.users.length;
  assert.deepEqual(findUsersByName(data, 'Persona inexistente'), []);
  assert.equal(data.users.length, count);
});

test('ACC-06/07/08/12/15 all administrative commands reject STAFF and leaders without mutation', () => {
  const data = seed();
  const commands: Command[] = [
    { type: 'saveTask', input: data.tasks[0] },
    { type: 'saveTask', id: data.tasks[0].id, input: { ...data.tasks[0], assigneeId: 'elena' } },
    { type: 'saveUser', name: 'Unauthorized', role: 'ADMIN', teamId: null },
    { type: 'saveTeam', name: 'Unauthorized', leaderId: null },
    { type: 'seatingTeam', teamId: 'technical' },
    { type: 'segments', segments: data.countdown.segments },
    ...(['start', 'pause', 'resume', 'restart', 'stop'] as const).map((action) => ({
      type: 'timer' as const,
      action,
    })),
  ];
  for (const actor of ['mateo', 'lucia']) {
    for (const command of commands) assert.throws(() => execute(data, actor, command), /ADMIN/);
  }
  assert.deepEqual(data, seed());
  assert.throws(
    () => execute(data, 'missing', { type: 'sendMessage', channelId: 'general', content: 'No' }),
    /sesión/,
  );
});

test('ACC-05 all three supported states persist and notify relevant users once per change', () => {
  let data = seed();
  for (const status of ['Pendiente', 'En curso', 'Completada'] as const) {
    const before = data.notifications.length;
    data = execute(data, 'mateo', { type: 'taskStatus', id: 'task-1', status });
    assert.equal(data.tasks[0].status, status);
    const notices = data.notifications.slice(before);
    assert.deepEqual(notices.map((n) => n.recipientId).sort(), ['admin', 'elena', 'lucia']);
    assert.ok(notices.every((n) => n.type === 'updated' && !n.read && n.taskId === 'task-1'));
    assert.equal(isAppData(data), true);
  }
});

test('ACC-03/04 acceptance notifies ADMIN, leader and teammates, excluding unrelated teams and actor', () => {
  const data = seed();
  const free = data.tasks.find((t) => t.teamId === 'technical' && !t.assigneeId)!;
  const next = execute(data, 'mateo', { type: 'acceptTask', id: free.id });
  const notices = next.notifications.slice(data.notifications.length);
  assert.deepEqual(notices.map((n) => n.recipientId).sort(), ['admin', 'elena', 'lucia']);
  assert.ok(notices.every((n) => n.type === 'accepted' && n.taskId === free.id));
  assert.ok(
    !visibleTasks(
      next,
      next.users.find((u) => u.id === 'elena')!,
    ).some((t) => t.id === free.id),
  );
  assert.ok(
    visibleTasks(
      next,
      next.users.find((u) => u.id === 'lucia')!,
    ).some((t) => t.id === free.id),
  );
});

test('ACC-06/07 leader may update only their own assigned task', () => {
  let data = seed();
  data = execute(data, 'admin', {
    type: 'saveTask',
    input: { ...data.tasks[0], assigneeId: 'lucia' },
  });
  const task = data.tasks.at(-1)!;
  data = execute(data, 'lucia', { type: 'taskStatus', id: task.id, status: 'Completada' });
  assert.equal(data.tasks.at(-1)!.status, 'Completada');
  assert.throws(
    () => execute(data, 'lucia', { type: 'taskStatus', id: 'task-1', status: 'Completada' }),
    /asignadas/,
  );
});

test('ACC-09/10 channel permission matrix covers admin, leader, staff and unassigned staff', () => {
  let data = execute(seed(), 'admin', {
    type: 'saveUser',
    name: 'Sin equipo',
    role: 'STAFF',
    teamId: null,
  });
  const unassigned = data.users.at(-1)!;
  for (const user of data.users) {
    for (const channel of data.channels) {
      const allowed =
        user.role === 'ADMIN' || channel.teamId === null || user.teamId === channel.teamId;
      const cmd: Command = {
        type: 'sendMessage',
        channelId: channel.id,
        content: `Auditoría ${user.id}`,
      };
      if (allowed) {
        data = execute(data, user.id, cmd);
        assert.equal(readMessages(data, user.id, channel.id).at(-1)!.authorId, user.id);
      } else {
        assert.throws(() => execute(data, user.id, cmd), /acceso/);
        assert.throws(() => readMessages(data, user.id, channel.id), /acceso/);
      }
    }
  }
  assert.deepEqual(
    accessibleChannels(data, unassigned).map((c) => c.id),
    ['general'],
  );
  assert.deepEqual(visibleTasks(data, unassigned), []);
  assert.throws(
    () => execute(data, 'admin', { type: 'sendMessage', channelId: 'missing', content: 'Hola' }),
    /acceso/,
  );
  assert.throws(() =>
    execute(data, 'admin', { type: 'sendMessage', channelId: 'general', content: '  ' }),
  );
  assert.throws(() =>
    execute(data, 'admin', {
      type: 'sendMessage',
      channelId: 'general',
      content: 'a'.repeat(2001),
    }),
  );
});

test('ACC-11/14/16/17 complete transaction history and data survive repository reconstruction', () => {
  const storage = new AuditStorage();
  let repo = new LocalRepository(storage as Storage);
  let data = seed();
  const commit = (actor: string, command: Command) => {
    data = execute(data, actor, command, Date.parse('2026-10-21T18:01:00Z'));
    repo.save(data);
    repo = new LocalRepository(storage as Storage);
    assert.deepEqual(repo.load(), data);
    data = repo.load();
  };
  commit('admin', {
    type: 'saveTask',
    input: {
      ...data.tasks[0],
      description: 'Auditoría persistente',
      assignment: 'free',
      assigneeId: null,
    },
  });
  const id = data.tasks.at(-1)!.id;
  commit('mateo', { type: 'acceptTask', id });
  commit('mateo', { type: 'taskStatus', id, status: 'Completada' });
  commit('admin', { type: 'saveTask', id, input: { ...data.tasks.at(-1)!, priority: 'Baja' } });
  commit('admin', { type: 'saveTask', id, input: { ...data.tasks.at(-1)!, assigneeId: 'elena' } });
  commit('mateo', {
    type: 'sendMessage',
    channelId: 'general',
    content: 'Persistencia de auditoría',
  });
  const previousTotal = seatTotal(data);
  commit('sofia', { type: 'incrementSeats', amount: 7 });
  commit('elena', { type: 'readNotification' });
  commit('admin', { type: 'saveTeam', name: 'Equipo de auditoría', leaderId: null });
  commit('admin', {
    type: 'saveUser',
    name: 'Miembro auditoría',
    role: 'TEAM_LEADER',
    teamId: data.teams.at(-1)!.id,
  });
  commit('admin', { type: 'seatingTeam', teamId: data.teams.at(-1)!.id });
  assert.equal(seatTotal(data), previousTotal + 7);
  assert.ok(data.notifications.filter((n) => n.recipientId === 'elena').every((n) => n.read));
  assert.deepEqual(
    new Set(data.activity.filter((a) => a.entityId === id).map((a) => a.action)),
    new Set(['task-created', 'task-accepted', 'task-status', 'task-edited', 'task-assigned']),
  );
  for (const action of ['seats', 'user', 'team', 'seating-team'])
    assert.ok(data.activity.some((a) => a.action === action));
  assert.ok(
    data.activity.every((a) => a.actorId && a.entityId && Number.isFinite(Date.parse(a.createdAt))),
  );
});

test('ACC-12/13/17 persisted countdown crosses exact boundaries, resumes after reload, ends at zero', () => {
  const now = Date.parse('2026-10-21T18:00:00Z');
  const storage = new AuditStorage();
  const repo = new LocalRepository(storage as Storage);
  let data = execute(
    seed(),
    'admin',
    {
      type: 'segments',
      segments: [
        { id: 'one', name: 'Uno', durationMs: 1000 },
        { id: 'two', name: 'Dos', durationMs: 2000 },
      ],
    },
    now,
  );
  data = execute(data, 'admin', { type: 'timer', action: 'start' }, now);
  repo.save(data);
  const reloaded = new LocalRepository(storage as Storage).load();
  assert.equal(reconcileCountdown(reloaded.countdown, now + 999).remainingMs, 1);
  const boundary = reconcileCountdown(reloaded.countdown, now + 1000);
  assert.equal(boundary.currentIndex, 1);
  assert.equal(boundary.remainingMs, 2000);
  const ended = { ...reloaded, countdown: reconcileCountdown(reloaded.countdown, now + 3000) };
  assert.equal(ended.countdown.status, 'finished');
  assert.equal(ended.countdown.remainingMs, 0);
  repo.save(ended);
  assert.deepEqual(new LocalRepository(storage as Storage).load(), ended);
  const restarted = execute(ended, 'admin', { type: 'timer', action: 'restart' }, now + 4000);
  assert.equal(restarted.countdown.status, 'paused');
  assert.equal(restarted.countdown.remainingMs, 2000);
  repo.save(restarted);
});

test('ACC-17 blocked storage reads fail explicitly without overwriting saved bytes', () => {
  const storage = new AuditStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify(seed()));
  const raw = storage.values.get(STORAGE_KEY);
  storage.getItem = () => {
    throw new Error('SecurityError');
  };
  assert.throws(() => new LocalRepository(storage as Storage).load(), /almacenamiento/);
  assert.equal(storage.values.get(STORAGE_KEY), raw);
});
