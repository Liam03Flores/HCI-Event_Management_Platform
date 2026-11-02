import { createDemoData } from '../data/seed.ts';
import type { AppData } from '../domain/types.ts';

export const STORAGE_KEY = 'event-management-platform:v1';
const SESSION_KEY = 'event-management-platform:session';
export interface DataRepository {
  load(): AppData;
  save(data: AppData): void;
  reset(): AppData;
}
type RecordValue = Record<string, unknown>;
const object = (v: unknown): v is RecordValue => !!v && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === 'string' && v.length > 0;
const date = (v: unknown) => text(v) && Number.isFinite(Date.parse(v));
const nullableText = (v: unknown) => v === null || text(v);
const choice = (v: unknown, values: string[]) => typeof v === 'string' && values.includes(v);
const array = (v: unknown, check: (v: RecordValue) => boolean) =>
  Array.isArray(v) && v.every((x) => object(x) && check(x));

export function isAppData(value: unknown): value is AppData {
  if (
    !object(value) ||
    value.schemaVersion !== 1 ||
    !object(value.event) ||
    !text(value.event.name) ||
    !date(value.event.startsAt) ||
    !text(value.event.venue)
  )
    return false;
  if (
    !array(
      value.users,
      (u) =>
        text(u.id) &&
        text(u.name) &&
        choice(u.role, ['ADMIN', 'TEAM_LEADER', 'STAFF']) &&
        nullableText(u.teamId),
    )
  )
    return false;
  if (!array(value.teams, (t) => text(t.id) && text(t.name) && text(t.color))) return false;
  if (
    !array(
      value.tasks,
      (t) =>
        text(t.id) &&
        text(t.description) &&
        choice(t.priority, ['Alta', 'Media', 'Baja']) &&
        (t.dueAt === null || date(t.dueAt)) &&
        text(t.teamId) &&
        choice(t.assignment, ['individual', 'free']) &&
        nullableText(t.assigneeId) &&
        choice(t.status, ['Pendiente', 'En curso', 'Completada']) &&
        date(t.createdAt) &&
        text(t.createdBy) &&
        date(t.updatedAt),
    )
  )
    return false;
  if (!array(value.channels, (c) => text(c.id) && text(c.name) && nullableText(c.teamId)))
    return false;
  if (
    !array(
      value.messages,
      (m) =>
        text(m.id) && text(m.channelId) && text(m.authorId) && text(m.content) && date(m.createdAt),
    )
  )
    return false;
  if (
    !array(
      value.seatIncrements,
      (s) =>
        text(s.id) &&
        text(s.userId) &&
        Number.isSafeInteger(s.amount) &&
        Number(s.amount) > 0 &&
        date(s.createdAt),
    )
  )
    return false;
  if (
    !array(
      value.notifications,
      (n) =>
        text(n.id) &&
        text(n.recipientId) &&
        choice(n.type, ['assignment', 'accepted', 'updated']) &&
        text(n.message) &&
        date(n.createdAt) &&
        typeof n.read === 'boolean' &&
        nullableText(n.taskId),
    )
  )
    return false;
  if (
    !array(
      value.activity,
      (a) =>
        text(a.id) &&
        text(a.actorId) &&
        text(a.action) &&
        text(a.entityId) &&
        nullableText(a.teamId) &&
        text(a.description) &&
        date(a.createdAt),
    )
  )
    return false;
  const c = value.countdown;
  if (
    !object(c) ||
    !array(
      c.segments,
      (s) =>
        text(s.id) &&
        text(s.name) &&
        Number.isSafeInteger(s.durationMs) &&
        Number(s.durationMs) >= 1000 &&
        Number(s.durationMs) <= 86_400_000,
    ) ||
    !Array.isArray(c.segments) ||
    !c.segments.length ||
    !Number.isInteger(c.currentIndex) ||
    Number(c.currentIndex) < 0 ||
    Number(c.currentIndex) >= c.segments.length ||
    !choice(c.status, ['stopped', 'running', 'paused', 'finished']) ||
    !Number.isFinite(c.remainingMs) ||
    Number(c.remainingMs) < 0 ||
    !(c.endsAt === null || Number.isFinite(c.endsAt)) ||
    (c.status === 'running' && c.endsAt === null)
  )
    return false;
  const d = value as unknown as AppData;
  const timer = d.countdown;
  if (
    timer.remainingMs > timer.segments[timer.currentIndex].durationMs ||
    (timer.status !== 'running' && timer.endsAt !== null) ||
    (timer.status === 'finished' &&
      (timer.remainingMs !== 0 || timer.currentIndex !== timer.segments.length - 1)) ||
    (timer.status === 'stopped' &&
      (timer.currentIndex !== 0 || timer.remainingMs !== timer.segments[0].durationMs))
  )
    return false;
  const userIds = new Set(d.users.map((u) => u.id));
  const teamIds = new Set(d.teams.map((t) => t.id));
  const taskIds = new Set(d.tasks.map((t) => t.id));
  const channelIds = new Set(d.channels.map((c) => c.id));
  const lists = [
    d.users,
    d.teams,
    d.tasks,
    d.channels,
    d.messages,
    d.notifications,
    d.activity,
    d.seatIncrements,
    d.countdown.segments,
  ];
  if (
    lists.some((list) => new Set(list.map((x) => x.id)).size !== list.length) ||
    !d.users.some((u) => u.role === 'ADMIN') ||
    !teamIds.has(d.seatingTeamId)
  )
    return false;
  if (!d.channels.some((c) => c.teamId === null)) return false;
  if (
    d.users.some(
      (u) =>
        (u.teamId !== null && !teamIds.has(u.teamId)) ||
        (u.role === 'ADMIN' && u.teamId !== null) ||
        (u.role === 'TEAM_LEADER' && !u.teamId),
    )
  )
    return false;
  if (
    d.teams.some(
      (t) => d.users.filter((u) => u.teamId === t.id && u.role === 'TEAM_LEADER').length > 1,
    )
  )
    return false;
  if (
    d.tasks.some(
      (t) =>
        !teamIds.has(t.teamId) ||
        !userIds.has(t.createdBy) ||
        (t.assigneeId !== null &&
          !d.users.some((u) => u.id === t.assigneeId && u.teamId === t.teamId)) ||
        (t.assignment === 'individual' && !t.assigneeId) ||
        (!t.assigneeId && t.status !== 'Pendiente'),
    )
  )
    return false;
  return (
    d.channels.every((c) => !c.teamId || teamIds.has(c.teamId)) &&
    d.messages.every((m) => userIds.has(m.authorId) && channelIds.has(m.channelId)) &&
    d.notifications.every(
      (n) => userIds.has(n.recipientId) && (!n.taskId || taskIds.has(n.taskId)),
    ) &&
    d.seatIncrements.every((s) => userIds.has(s.userId)) &&
    d.activity.every((a) => userIds.has(a.actorId))
  );
}

export class LocalRepository implements DataRepository {
  private storage: Storage;
  constructor(storage: Storage) {
    this.storage = storage;
  }
  load(): AppData {
    let raw: string | null;
    try {
      raw = this.storage.getItem(STORAGE_KEY);
    } catch {
      throw new Error(
        'No se puede acceder al almacenamiento del navegador. Revisa los permisos de este sitio.',
      );
    }
    if (raw === null) {
      const data = createDemoData();
      this.save(data);
      return data;
    }
    try {
      const data: unknown = JSON.parse(raw);
      if (isAppData(data)) return data;
    } catch {
      /* Preserve original bytes for recovery. */
    }
    throw new Error(
      'Los datos guardados están dañados o tienen una versión incompatible. Se han conservado sin cambios. Puedes descargar una copia o restaurar la demostración.',
    );
  }
  save(data: AppData) {
    if (!isAppData(data)) {
      throw new Error(
        'Los cambios contienen datos inválidos o inconsistentes. La operación no se aplicó.',
      );
    }
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      throw new Error(
        'No se pudo guardar. El almacenamiento está lleno o bloqueado. La operación no se aplicó.',
      );
    }
  }
  reset() {
    const data = createDemoData();
    this.save(data);
    return data;
  }
  rawBackup() {
    return this.storage.getItem(STORAGE_KEY) ?? '{}';
  }
}
export const session = {
  get(): string | null {
    try {
      return sessionStorage.getItem(SESSION_KEY);
    } catch {
      return null;
    }
  },
  set(id: string | null) {
    try {
      if (id) sessionStorage.setItem(SESSION_KEY, id);
      else sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* Session remains usable in memory. */
    }
  },
};
