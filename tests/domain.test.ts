import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoData } from '../src/data/seed.ts';
import {
  execute,
  findUsersByName,
  readMessages,
  accessibleChannels,
  seatTotal,
  visibleTasks,
  visibleActivity,
} from '../src/domain/service.ts';
import { reconcileCountdown } from '../src/domain/countdown.ts';
import { LocalRepository, STORAGE_KEY, isAppData } from '../src/services/repository.ts';
import type { TaskInput, TaskStatus, AppData } from '../src/domain/types.ts';

const now = Date.parse('2026-10-19T16:00:00.000Z');
const seed = () => createDemoData(now);
const input: TaskInput = {
  description: 'Prueba de iluminación',
  priority: 'Alta',
  dueAt: null,
  teamId: 'technical',
  assignment: 'individual',
  assigneeId: 'mateo',
};
const free = { ...input, assignment: 'free' as const, assigneeId: null };
class MemoryStorage {
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
  key(i: number) {
    return [...this.values.keys()][i] ?? null;
  }
  get length() {
    return this.values.size;
  }
}

test('seed is internally valid, has all three roles and a four-day event', () => {
  const data = seed();
  assert.equal(isAppData(data), true);
  assert.equal(
    data.users.some((u) => u.role === 'TEAM_LEADER'),
    true,
  );
  assert.equal(new Date(data.event.startsAt).getDate() - new Date(now).getDate(), 4);
});
test('name entry is normalized and ambiguous names remain distinct', () => {
  const data = seed();
  assert.equal(findUsersByName(data, '  LUCIA TORRES  ')[0].id, 'lucia');
  assert.equal(findUsersByName(data, 'Missing').length, 0);
  data.users.push({ ...data.users[2], id: 'duplicate', teamId: 'welcome' });
  assert.equal(findUsersByName(data, 'Mateo Ruiz').length, 2);
});
test('admin creates individual task with one assignment notice and history; source remains unchanged', () => {
  const source = seed();
  const d = execute(source, 'admin', { type: 'saveTask', input }, now);
  const t = d.tasks.at(-1)!;
  assert.equal(source.tasks.length, 8);
  assert.equal(t.assigneeId, 'mateo');
  assert.equal(
    d.notifications.filter(
      (n) => n.taskId === t.id && n.recipientId === 'mateo' && n.type === 'assignment',
    ).length,
    1,
  );
  assert.equal(d.activity.filter((a) => a.entityId === t.id).length, 2);
});
test('staff and leaders cannot create, edit, or assign tasks by direct calls', () => {
  for (const actor of ['mateo', 'lucia']) {
    assert.throws(() => execute(seed(), actor, { type: 'saveTask', input }), /ADMIN/);
    assert.throws(
      () =>
        execute(seed(), actor, {
          type: 'saveTask',
          id: 'task-1',
          input: { ...input, assigneeId: 'elena' },
        }),
      /ADMIN/,
    );
  }
});
test('free task acceptance is team-restricted, one-time and not available to leaders', () => {
  let d = execute(seed(), 'admin', { type: 'saveTask', input: free });
  const id = d.tasks.at(-1)!.id;
  assert.throws(() => execute(d, 'sofia', { type: 'acceptTask', id }), /equipo/);
  assert.throws(() => execute(d, 'lucia', { type: 'acceptTask', id }), /STAFF/);
  d = execute(d, 'mateo', { type: 'acceptTask', id }, now);
  assert.equal(d.tasks.at(-1)!.assigneeId, 'mateo');
  assert.throws(() => execute(d, 'elena', { type: 'acceptTask', id }), /no está disponible/);
  assert.ok(
    d.notifications.some(
      (n) => n.taskId === id && n.recipientId === 'admin' && n.type === 'accepted',
    ),
  );
  assert.equal(
    visibleTasks(
      d,
      d.users.find((u) => u.id === 'elena')!,
    ).some((t) => t.id === id),
    false,
  );
});
test('task state updates reject other owners and unsupported statuses', () => {
  const d = execute(
    seed(),
    'mateo',
    { type: 'taskStatus', id: 'task-1', status: 'Completada' },
    now,
  );
  assert.equal(d.tasks[0].status, 'Completada');
  assert.throws(
    () => execute(d, 'elena', { type: 'taskStatus', id: 'task-1', status: 'Pendiente' }),
    /asignadas/,
  );
  assert.throws(
    () => execute(d, 'lucia', { type: 'taskStatus', id: 'task-1', status: 'Pendiente' }),
    /asignadas/,
  );
  assert.throws(
    () =>
      execute(d, 'admin', { type: 'taskStatus', id: 'task-1', status: 'Bloqueada' as TaskStatus }),
    /estado/,
  );
  assert.throws(
    () => execute(d, 'admin', { type: 'taskStatus', id: 'task-4', status: 'Completada' }),
    /Asigna/,
  );
});
test('no-op task edits and status updates do not duplicate notices or history', () => {
  const d = seed();
  const task = d.tasks[0];
  assert.equal(execute(d, 'admin', { type: 'taskStatus', id: task.id, status: task.status }), d);
  assert.equal(execute(d, 'admin', { type: 'saveTask', id: task.id, input: task }), d);
});
test('assigned person must belong to team; invalid task fields rejected', () => {
  for (const bad of [
    { ...input, assigneeId: 'sofia' },
    { ...input, description: ' ' },
    { ...input, dueAt: 'bad-date' },
    { ...free, assigneeId: 'mateo' },
    { ...input, teamId: 'missing' },
  ])
    assert.throws(() => execute(seed(), 'admin', { type: 'saveTask', input: bad }));
});
test('task edits notify old and new relevant teams and record changed values', () => {
  const d = execute(
    seed(),
    'admin',
    {
      type: 'saveTask',
      id: 'task-1',
      input: { ...input, priority: 'Baja', teamId: 'welcome', assigneeId: 'sofia' },
    },
    now,
  );
  assert.ok(d.notifications.some((n) => n.recipientId === 'sofia' && n.type === 'assignment'));
  assert.ok(d.notifications.some((n) => n.recipientId === 'mateo' && n.type === 'updated'));
  assert.ok(d.activity.some((a) => a.description.includes('Alta → Baja')));
  assert.equal(isAppData(d), true);
});
test('channel reads and writes are restricted in the service', () => {
  const d = seed();
  assert.throws(() => readMessages(d, 'mateo', 'welcome'), /acceso/);
  assert.throws(
    () =>
      execute(d, 'mateo', { type: 'sendMessage', channelId: 'welcome', content: 'No permitido' }),
    /acceso/,
  );
  assert.throws(
    () =>
      execute(d, 'lucia', {
        type: 'sendMessage',
        channelId: 'production',
        content: 'No permitido',
      }),
    /acceso/,
  );
  const next = execute(d, 'mateo', {
    type: 'sendMessage',
    channelId: 'technical',
    content: 'Mensaje técnico',
  });
  assert.equal(readMessages(next, 'lucia', 'technical').at(-1)!.content, 'Mensaje técnico');
  assert.equal(readMessages(next, 'admin', 'technical').at(-1)!.content, 'Mensaje técnico');
  assert.equal(
    accessibleChannels(
      next,
      next.users.find((u) => u.id === 'mateo')!,
    ).length,
    2,
  );
  assert.equal(
    execute(next, 'sofia', {
      type: 'sendMessage',
      channelId: 'general',
      content: 'Hola',
    }).messages.at(-1)!.content,
    'Hola',
  );
});
test('admin manages teams, users, members and a unique leader', () => {
  let d = execute(seed(), 'admin', { type: 'saveTeam', name: 'Logística', leaderId: null });
  const team = d.teams.at(-1)!;
  assert.ok(d.channels.some((c) => c.teamId === team.id));
  d = execute(d, 'admin', {
    type: 'saveUser',
    name: 'Nueva Persona',
    role: 'TEAM_LEADER',
    teamId: team.id,
  });
  assert.equal(d.users.at(-1)!.teamId, team.id);
  d = execute(d, 'admin', {
    type: 'saveTeam',
    id: team.id,
    name: 'Logística y montaje',
    leaderId: null,
  });
  assert.equal(d.users.at(-1)!.role, 'STAFF');
  assert.equal(d.channels.find((c) => c.teamId === team.id)!.name, 'Logística y montaje');
  d = execute(d, 'admin', {
    type: 'saveUser',
    id: 'elena',
    name: 'Elena Cruz',
    role: 'TEAM_LEADER',
    teamId: 'technical',
  });
  assert.equal(d.users.find((u) => u.id === 'lucia')!.role, 'STAFF');
  assert.equal(isAppData(d), true);
  assert.throws(
    () => execute(d, 'lucia', { type: 'saveTeam', name: 'No autorizado', leaderId: null }),
    /ADMIN/,
  );
  assert.throws(
    () =>
      execute(d, 'mateo', { type: 'saveUser', name: 'Nuevo admin', role: 'ADMIN', teamId: null }),
    /ADMIN/,
  );
});
test('cannot remove last admin or orphan tasks when changing membership', () => {
  assert.throws(
    () =>
      execute(seed(), 'admin', {
        type: 'saveUser',
        id: 'admin',
        name: 'Alex Morgan',
        role: 'STAFF',
        teamId: null,
      }),
    /al menos un ADMIN/,
  );
  assert.throws(
    () =>
      execute(seed(), 'admin', {
        type: 'saveUser',
        id: 'mateo',
        name: 'Mateo Ruiz',
        role: 'STAFF',
        teamId: 'welcome',
      }),
    /Reasigna/,
  );
});
test('only designated team staff can increment seats; total is reconstructable', () => {
  const before = seed();
  const d = execute(before, 'sofia', { type: 'incrementSeats', amount: 3 }, now);
  assert.equal(seatTotal(d), seatTotal(before) + 3);
  assert.equal(d.activity.at(-1)!.actorId, 'sofia');
  for (const actor of ['admin', 'mateo', 'lucia'])
    assert.throws(
      () => execute(d, actor, { type: 'incrementSeats', amount: 1 }),
      /equipo designado/,
    );
  for (const amount of [0, -1, 1.5, Infinity, 1001])
    assert.throws(() => execute(d, 'sofia', { type: 'incrementSeats', amount }), /entero/);
  const changed = execute(d, 'admin', { type: 'seatingTeam', teamId: 'technical' });
  assert.throws(() => execute(changed, 'sofia', { type: 'incrementSeats', amount: 1 }));
  assert.equal(seatTotal(execute(changed, 'lucia', { type: 'incrementSeats', amount: 1 })), 188);
});
test('countdown skips multiple elapsed segments precisely and finishes once at zero', () => {
  let d = execute(
    seed(),
    'admin',
    {
      type: 'segments',
      segments: [
        { id: 'a', name: 'Uno', durationMs: 1000 },
        { id: 'b', name: 'Dos', durationMs: 2000 },
        { id: 'c', name: 'Tres', durationMs: 3000 },
      ],
    },
    now,
  );
  d = execute(d, 'admin', { type: 'timer', action: 'start' }, now);
  const middle = reconcileCountdown(d.countdown, now + 3500);
  assert.equal(middle.currentIndex, 2);
  assert.equal(middle.remainingMs, 2500);
  assert.equal(middle.endsAt, now + 6000);
  const end = reconcileCountdown(middle, now + 20000);
  assert.equal(end.status, 'finished');
  assert.equal(end.remainingMs, 0);
  assert.equal(end.endsAt, null);
  assert.deepEqual(reconcileCountdown(end, now + 30000), end);
});
test('countdown pause, resume, restart, stop, editing and permissions', () => {
  let d = execute(seed(), 'admin', { type: 'timer', action: 'start' }, now);
  d = execute(d, 'admin', { type: 'timer', action: 'pause' }, now + 1000);
  assert.equal(d.countdown.remainingMs, 899000);
  assert.equal(reconcileCountdown(d.countdown, now + 100000).remainingMs, 899000);
  d = execute(d, 'admin', { type: 'timer', action: 'resume' }, now + 100000);
  assert.equal(d.countdown.endsAt, now + 999000);
  d = execute(d, 'admin', { type: 'timer', action: 'restart' }, now + 100001);
  assert.equal(d.countdown.endsAt, now + 100001 + 900000);
  assert.throws(
    () => execute(d, 'admin', { type: 'segments', segments: d.countdown.segments }),
    /Detén/,
  );
  assert.throws(() => execute(d, 'mateo', { type: 'timer', action: 'pause' }), /ADMIN/);
  d = execute(d, 'admin', { type: 'timer', action: 'stop' }, now + 100002);
  assert.equal(d.countdown.status, 'stopped');
  assert.equal(d.countdown.currentIndex, 0);
  assert.throws(() =>
    execute(d, 'admin', { type: 'segments', segments: [{ id: 'a', name: 'bad', durationMs: 0 }] }),
  );
  assert.throws(() => execute(d, 'admin', { type: 'segments', segments: [] }));
});
test('notifications can only be marked read by recipient', () => {
  assert.throws(
    () => execute(seed(), 'sofia', { type: 'readNotification', id: 'notice-1' }),
    /pertenece/,
  );
  const d = execute(seed(), 'mateo', { type: 'readNotification' });
  assert.equal(d.notifications[0].read, true);
  assert.equal(d.notifications[1].read, false);
});
test('leaders see their team activity but not other team tasks', () => {
  const d = seed();
  const leader = d.users.find((u) => u.id === 'lucia')!;
  assert.ok(visibleTasks(d, leader).every((t) => t.teamId === 'technical'));
  assert.ok(
    visibleActivity(d, leader).every((a) => a.teamId === 'technical' || a.actorId === leader.id),
  );
});
test('repository initializes only once and preserves messages/tasks on reload', () => {
  const storage = new MemoryStorage();
  const repo = new LocalRepository(storage as Storage);
  const first = repo.load();
  const changed = execute(first, 'mateo', {
    type: 'sendMessage',
    channelId: 'general',
    content: 'Persistencia comprobada',
  });
  repo.save(changed);
  const reopened = new LocalRepository(storage as Storage).load();
  assert.deepEqual(reopened, changed);
  assert.equal(reopened.messages.at(-1)!.content, 'Persistencia comprobada');
});
test('corrupt/incompatible data remains untouched until explicit reset', () => {
  const storage = new MemoryStorage();
  const repo = new LocalRepository(storage as Storage);
  for (const raw of [
    '{broken',
    JSON.stringify({ ...seed(), schemaVersion: 99 }),
    JSON.stringify({ ...seed(), users: null }),
  ]) {
    storage.setItem(STORAGE_KEY, raw);
    assert.throws(() => repo.load(), /conservado/);
    assert.equal(storage.getItem(STORAGE_KEY), raw);
  }
  assert.equal(isAppData(repo.reset()), true);
});
test('schema validator rejects malformed timers, entities and dangling references', () => {
  for (const mutate of [
    (d: AppData) => {
      d.countdown.currentIndex = 99;
    },
    (d: AppData) => {
      d.tasks[0].assigneeId = 'missing';
    },
    (d: AppData) => {
      d.messages[0].authorId = 'missing';
    },
    (d: AppData) => {
      d.seatIncrements[0].amount = -1;
    },
    (d: AppData) => {
      d.countdown.segments[0].durationMs = 0;
    },
  ]) {
    const d = seed();
    mutate(d);
    assert.equal(isAppData(d), false);
  }
});
test('storage write failure is visible and leaves previous snapshot intact', () => {
  const storage = new MemoryStorage();
  const repo = new LocalRepository(storage as Storage);
  const before = repo.load();
  storage.setItem = () => {
    throw new Error('QuotaExceededError');
  };
  assert.throws(
    () => repo.save(execute(before, 'sofia', { type: 'incrementSeats', amount: 1 })),
    /no se aplicó/,
  );
  assert.deepEqual(repo.load(), before);
});
