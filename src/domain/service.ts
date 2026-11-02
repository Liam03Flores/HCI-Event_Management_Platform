import type {
  AppData,
  Countdown,
  Role,
  Segment,
  Task,
  TaskInput,
  TaskStatus,
  User,
} from './types.ts';
import { reconcileCountdown } from './countdown.ts';

export type Command =
  | { type: 'saveTask'; id?: string; input: TaskInput }
  | { type: 'acceptTask'; id: string }
  | { type: 'taskStatus'; id: string; status: TaskStatus }
  | { type: 'sendMessage'; channelId: string; content: string }
  | { type: 'readNotification'; id?: string }
  | { type: 'saveUser'; id?: string; name: string; role: Role; teamId: string | null }
  | { type: 'saveTeam'; id?: string; name: string; leaderId: string | null }
  | { type: 'seatingTeam'; teamId: string }
  | { type: 'incrementSeats'; amount: number }
  | { type: 'segments'; segments: Segment[] }
  | { type: 'timer'; action: 'start' | 'pause' | 'resume' | 'restart' | 'stop' };

export const uid = () => crypto.randomUUID();
function ensure(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
export function getUser(data: AppData, id: string) {
  const user = data.users.find((u) => u.id === id);
  ensure(user, 'La sesión ya no es válida. Vuelve a entrar.');
  return user;
}
export const isAdmin = (user: User) => user.role === 'ADMIN';
export function visibleTasks(data: AppData, user: User) {
  user = getUser(data, user.id);
  return data.tasks.filter(
    (t) =>
      isAdmin(user) ||
      t.assigneeId === user.id ||
      (t.teamId === user.teamId && (user.role === 'TEAM_LEADER' || !t.assigneeId)),
  );
}
export function accessibleChannels(data: AppData, user: User) {
  user = getUser(data, user.id);
  return data.channels.filter((c) => isAdmin(user) || !c.teamId || c.teamId === user.teamId);
}
export function readMessages(data: AppData, userId: string, channelId: string) {
  const user = getUser(data, userId);
  ensure(
    accessibleChannels(data, user).some((c) => c.id === channelId),
    'No tienes acceso a este canal.',
  );
  return data.messages.filter((m) => m.channelId === channelId);
}
export function visibleActivity(data: AppData, user: User) {
  user = getUser(data, user.id);
  return data.activity.filter(
    (a) =>
      isAdmin(user) ||
      a.actorId === user.id ||
      (user.role === 'TEAM_LEADER' && a.teamId !== null && a.teamId === user.teamId),
  );
}
export function findUsersByName(data: AppData, name: string) {
  const normalize = (s: string) =>
    s
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('es');
  return data.users.filter((u) => normalize(u.name) === normalize(name));
}
export const seatTotal = (data: AppData) =>
  data.seatIncrements.reduce((sum, entry) => sum + entry.amount, 0);

// Pure transaction: validates current permissions before returning one atomic state update.
export function execute(
  source: AppData,
  actorId: string,
  command: Command,
  now = Date.now(),
): AppData {
  const data = structuredClone(source);
  const actor = getUser(data, actorId);
  const at = new Date(now).toISOString();
  const admin = () => ensure(isAdmin(actor), 'Solo ADMIN puede realizar esta acción.');
  const log = (
    action: string,
    entityId: string,
    description: string,
    teamId: string | null = null,
  ) => {
    data.activity.push({
      id: uid(),
      actorId,
      action,
      entityId,
      description,
      teamId,
      createdAt: at,
    });
  };
  const notify = (
    ids: string[],
    type: 'assignment' | 'accepted' | 'updated',
    message: string,
    taskId: string,
  ) => {
    [...new Set(ids)]
      .filter((id) => id !== actorId)
      .forEach((recipientId) =>
        data.notifications.push({
          id: uid(),
          recipientId,
          type,
          message,
          taskId,
          createdAt: at,
          read: false,
        }),
      );
  };
  const recipients = (task: Task) =>
    data.users
      .filter((u) => isAdmin(u) || u.id === task.assigneeId || u.teamId === task.teamId)
      .map((u) => u.id);
  const taskById = (id: string) => {
    const t = data.tasks.find((t) => t.id === id);
    ensure(t, 'Esta tarea ya no existe.');
    return t;
  };

  switch (command.type) {
    case 'saveTask': {
      admin();
      ensure(typeof command.input.description === 'string', 'La descripción no es válida.');
      // Whitelist editable fields. A stale form or direct caller must not replace
      // the current status, identity, creator, or timestamps through this operation.
      const input: TaskInput = {
        description: command.input.description.trim(),
        priority: command.input.priority,
        dueAt: command.input.dueAt,
        teamId: command.input.teamId,
        assignment: command.input.assignment,
        assigneeId: command.input.assigneeId,
      };
      ensure(
        input.description.length >= 3 && input.description.length <= 500,
        'La descripción debe tener entre 3 y 500 caracteres.',
      );
      ensure(
        ['Alta', 'Media', 'Baja'].includes(input.priority),
        'Selecciona una prioridad válida.',
      );
      ensure(
        data.teams.some((t) => t.id === input.teamId),
        'Selecciona un equipo válido.',
      );
      ensure(
        input.dueAt === null ||
          (typeof input.dueAt === 'string' && Number.isFinite(Date.parse(input.dueAt))),
        'La fecha límite no es válida.',
      );
      ensure(
        ['individual', 'free'].includes(input.assignment),
        'Selecciona un tipo de asignación válido.',
      );
      if (input.assignment === 'individual')
        ensure(input.assigneeId, 'Selecciona a la persona responsable.');
      ensure(
        input.assigneeId === null ||
          (typeof input.assigneeId === 'string' && input.assigneeId.length > 0),
        'El responsable no es válido.',
      );
      if (input.assigneeId)
        ensure(
          data.users.some(
            (u) => u.id === input.assigneeId && u.teamId === input.teamId && !isAdmin(u),
          ),
          'El responsable debe pertenecer al equipo seleccionado.',
        );
      const previous = command.id ? structuredClone(taskById(command.id)) : null;
      if (!previous && input.assignment === 'free')
        ensure(!input.assigneeId, 'Una tarea libre debe publicarse sin responsable.');
      const task: Task = previous
        ? { ...previous, ...input, updatedAt: at }
        : {
            ...input,
            id: uid(),
            status: 'Pendiente',
            createdAt: at,
            updatedAt: at,
            createdBy: actorId,
          };
      if (!task.assigneeId) task.status = 'Pendiente';
      if (previous) data.tasks[data.tasks.findIndex((t) => t.id === task.id)] = task;
      else data.tasks.push(task);
      const fields: (keyof TaskInput)[] = [
        'description',
        'priority',
        'dueAt',
        'teamId',
        'assignment',
        'assigneeId',
      ];
      const labels = {
        description: 'descripción',
        priority: 'prioridad',
        dueAt: 'fecha límite',
        teamId: 'equipo',
        assignment: 'asignación',
        assigneeId: 'responsable',
      };
      const show = (key: keyof TaskInput, value: string | null) =>
        key === 'teamId'
          ? data.teams.find((t) => t.id === value)?.name
          : key === 'assigneeId'
            ? (data.users.find((u) => u.id === value)?.name ?? 'Sin responsable')
            : (value ?? 'Sin fecha');
      const changes = previous
        ? fields
            .filter((k) => previous[k] !== task[k])
            .map((k) => `${labels[k]}: ${show(k, previous[k])} → ${show(k, task[k])}`)
            .join('; ')
        : '';
      if (previous && !changes) return source;
      log(
        previous ? 'task-edited' : 'task-created',
        task.id,
        previous ? `Editó «${task.description}»: ${changes}.` : `Creó «${task.description}».`,
        task.teamId,
      );
      if (previous && previous.status !== task.status) {
        log(
          'task-status',
          task.id,
          `«${task.description}»: ${previous.status} → ${task.status}.`,
          task.teamId,
        );
      }
      if (task.assigneeId && previous?.assigneeId !== task.assigneeId) {
        log(
          'task-assigned',
          task.id,
          `Asignó «${task.description}» a ${getUser(data, task.assigneeId).name}.`,
          task.teamId,
        );
        notify([task.assigneeId], 'assignment', `Nueva tarea: ${task.description}`, task.id);
      }
      notify(
        [...recipients(task), ...(previous ? recipients(previous) : [])].filter(
          (id) => id !== task.assigneeId || previous?.assigneeId === task.assigneeId,
        ),
        'updated',
        `${previous ? 'Se actualizó' : task.assigneeId ? 'Nueva tarea del equipo' : 'Nueva tarea disponible'}: ${task.description}`,
        task.id,
      );
      break;
    }
    case 'acceptTask': {
      const task = taskById(command.id);
      ensure(
        actor.role === 'STAFF' && actor.teamId === task.teamId,
        'Solo STAFF del equipo puede aceptar esta tarea.',
      );
      ensure(
        task.assignment === 'free' && task.assigneeId === null && task.status === 'Pendiente',
        'Esta tarea ya no está disponible.',
      );
      task.assigneeId = actorId;
      task.updatedAt = at;
      log('task-accepted', task.id, `Aceptó «${task.description}».`, task.teamId);
      notify(recipients(task), 'accepted', `${actor.name} aceptó: ${task.description}`, task.id);
      break;
    }
    case 'taskStatus': {
      const task = taskById(command.id);
      ensure(
        isAdmin(actor) || task.assigneeId === actorId,
        'Solo puedes actualizar las tareas que tienes asignadas.',
      );
      ensure(
        ['Pendiente', 'En curso', 'Completada'].includes(command.status),
        'El estado no es válido.',
      );
      ensure(
        task.assigneeId || command.status === 'Pendiente',
        'Asigna la tarea antes de cambiar su estado.',
      );
      if (task.status === command.status) return source;
      const old = task.status;
      task.status = command.status;
      task.updatedAt = at;
      log('task-status', task.id, `«${task.description}»: ${old} → ${task.status}.`, task.teamId);
      notify(recipients(task), 'updated', `${task.description}: ${task.status}`, task.id);
      break;
    }
    case 'sendMessage': {
      readMessages(data, actorId, command.channelId);
      const content = command.content.trim();
      ensure(
        content.length > 0 && content.length <= 2000,
        'Escribe un mensaje de hasta 2000 caracteres.',
      );
      data.messages.push({
        id: uid(),
        channelId: command.channelId,
        authorId: actorId,
        content,
        createdAt: at,
      });
      break;
    }
    case 'readNotification': {
      if (command.id)
        ensure(
          data.notifications.some((n) => n.id === command.id && n.recipientId === actorId),
          'Esta notificación no te pertenece.',
        );
      data.notifications
        .filter((n) => n.recipientId === actorId && (!command.id || command.id === n.id))
        .forEach((n) => {
          n.read = true;
        });
      break;
    }
    case 'saveUser': {
      admin();
      const name = command.name.trim();
      ensure(
        name.length >= 2 && name.length <= 80,
        'El nombre debe tener entre 2 y 80 caracteres.',
      );
      ensure(['ADMIN', 'TEAM_LEADER', 'STAFF'].includes(command.role), 'El rol no es válido.');
      const teamId = command.role === 'ADMIN' ? null : command.teamId;
      ensure(!teamId || data.teams.some((t) => t.id === teamId), 'El equipo no existe.');
      ensure(command.role !== 'TEAM_LEADER' || teamId, 'Un líder necesita un equipo.');
      const previous = command.id ? getUser(data, command.id) : null;
      if (previous?.role === 'ADMIN' && command.role !== 'ADMIN')
        ensure(data.users.filter(isAdmin).length > 1, 'Debe quedar al menos un ADMIN.');
      if (previous && previous.teamId !== teamId)
        ensure(
          !data.tasks.some((t) => t.assigneeId === previous.id && t.teamId !== teamId),
          'Reasigna primero las tareas de esta persona antes de cambiar su equipo o convertirla en ADMIN.',
        );
      if (command.role === 'TEAM_LEADER')
        data.users
          .filter((u) => u.teamId === teamId && u.role === 'TEAM_LEADER' && u.id !== command.id)
          .forEach((u) => {
            u.role = 'STAFF';
          });
      const user = { id: command.id ?? uid(), name, role: command.role, teamId };
      if (previous) data.users[data.users.findIndex((u) => u.id === previous.id)] = user;
      else data.users.push(user);
      log(
        'user',
        user.id,
        `${previous ? 'Actualizó' : 'Creó'} a ${name}: ${command.role}, ${data.teams.find((t) => t.id === teamId)?.name ?? 'sin equipo'}.`,
        teamId,
      );
      break;
    }
    case 'saveTeam': {
      admin();
      const name = command.name.trim();
      ensure(
        name.length >= 2 && name.length <= 60,
        'El nombre del equipo debe tener entre 2 y 60 caracteres.',
      );
      ensure(
        !data.teams.some((t) => t.id !== command.id && t.name.toLowerCase() === name.toLowerCase()),
        'Ya existe un equipo con ese nombre.',
      );
      const previous = command.id ? data.teams.find((t) => t.id === command.id) : null;
      ensure(!command.id || previous, 'El equipo no existe.');
      const id = command.id ?? uid();
      if (command.leaderId)
        ensure(
          data.users.some((u) => u.id === command.leaderId && u.teamId === id && !isAdmin(u)),
          'El líder debe ser integrante del equipo.',
        );
      if (previous) {
        previous.name = name;
        const channel = data.channels.find((c) => c.teamId === id);
        if (channel) channel.name = name;
      } else {
        data.teams.push({ id, name, color: '#8b9b79' });
        data.channels.push({ id: uid(), name, teamId: id });
      }
      data.users
        .filter((u) => u.teamId === id && u.role === 'TEAM_LEADER')
        .forEach((u) => {
          u.role = 'STAFF';
        });
      if (command.leaderId) getUser(data, command.leaderId).role = 'TEAM_LEADER';
      log(
        'team',
        id,
        `${previous ? 'Actualizó' : 'Creó'} el equipo ${name}. Líder: ${data.users.find((u) => u.id === command.leaderId)?.name ?? 'sin asignar'}.`,
        id,
      );
      break;
    }
    case 'seatingTeam': {
      admin();
      ensure(
        data.teams.some((t) => t.id === command.teamId),
        'El equipo no existe.',
      );
      data.seatingTeamId = command.teamId;
      log(
        'seating-team',
        command.teamId,
        `Designó a ${data.teams.find((t) => t.id === command.teamId)?.name} para contar asientos.`,
        command.teamId,
      );
      break;
    }
    case 'incrementSeats': {
      ensure(
        !isAdmin(actor) && actor.teamId === data.seatingTeamId,
        'Solo el personal del equipo designado puede registrar asientos.',
      );
      ensure(
        Number.isSafeInteger(command.amount) && command.amount > 0 && command.amount <= 1000,
        'El incremento debe ser un entero entre 1 y 1000.',
      );
      const id = uid();
      data.seatIncrements.push({ id, userId: actorId, amount: command.amount, createdAt: at });
      log(
        'seats',
        id,
        `Registró ${command.amount} ${command.amount === 1 ? 'asiento' : 'asientos'}. Total: ${seatTotal(data)}.`,
        actor.teamId,
      );
      break;
    }
    case 'segments': {
      admin();
      ensure(
        data.countdown.status === 'stopped' || data.countdown.status === 'finished',
        'Detén la secuencia antes de editar los segmentos.',
      );
      ensure(
        command.segments.length > 0 && command.segments.length <= 50,
        'La secuencia debe tener entre 1 y 50 segmentos.',
      );
      ensure(
        new Set(command.segments.map((s) => s.id)).size === command.segments.length,
        'Los segmentos deben tener identificadores únicos.',
      );
      command.segments.forEach((s) =>
        ensure(
          s.id &&
            s.name.trim().length > 0 &&
            s.name.trim().length <= 80 &&
            Number.isSafeInteger(s.durationMs) &&
            s.durationMs >= 1000 &&
            s.durationMs <= 86_400_000,
          'Cada segmento necesita un nombre y una duración de 1 segundo a 24 horas.',
        ),
      );
      data.countdown = {
        segments: command.segments.map((s) => ({ ...s, name: s.name.trim() })),
        currentIndex: 0,
        status: 'stopped',
        endsAt: null,
        remainingMs: command.segments[0].durationMs,
      };
      log('countdown', 'countdown', 'Actualizó los segmentos y su orden.');
      break;
    }
    case 'timer': {
      admin();
      const c: Countdown = reconcileCountdown(data.countdown, now);
      data.countdown = c;
      switch (command.action) {
        case 'start':
          ensure(
            c.status === 'stopped' || c.status === 'finished',
            'La secuencia ya está iniciada.',
          );
          c.currentIndex = 0;
          c.remainingMs = c.segments[0].durationMs;
          c.endsAt = now + c.remainingMs;
          c.status = 'running';
          break;
        case 'pause':
          ensure(c.status === 'running', 'La secuencia no está en marcha.');
          c.status = 'paused';
          c.endsAt = null;
          break;
        case 'resume':
          ensure(c.status === 'paused', 'La secuencia no está pausada.');
          c.status = 'running';
          c.endsAt = now + c.remainingMs;
          break;
        case 'restart':
          c.remainingMs = c.segments[c.currentIndex].durationMs;
          c.endsAt = c.status === 'running' ? now + c.remainingMs : null;
          if (c.status === 'finished') c.status = 'paused';
          break;
        case 'stop':
          c.currentIndex = 0;
          c.remainingMs = c.segments[0].durationMs;
          c.endsAt = null;
          c.status = 'stopped';
          break;
        default:
          throw new Error('Control de countdown no válido.');
      }
      const labels = {
        start: 'Inició la secuencia.',
        pause: 'Pausó la secuencia.',
        resume: 'Reanudó la secuencia.',
        restart: 'Reinició el segmento actual.',
        stop: 'Detuvo y reinició la secuencia.',
      };
      log('countdown', 'countdown', labels[command.action]);
      break;
    }
    default:
      throw new Error('Operación desconocida.');
  }
  return data;
}
