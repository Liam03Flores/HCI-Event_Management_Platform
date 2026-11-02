import type { AppData, Task } from '../domain/types.ts';

export function createDemoData(now = Date.now()): AppData {
  const date = new Date(now);
  date.setDate(date.getDate() + 4);
  date.setHours(19, 0, 0, 0);
  const at = (hours: number) => new Date(now + hours * 3_600_000).toISOString();
  const descriptions = [
    'Revisar la iluminación del escenario',
    'Confirmar la distribución de asientos',
    'Preparar credenciales del equipo',
    'Verificar micrófonos y monitores',
    'Señalizar los accesos al auditorio',
    'Revisar la escaleta con producción',
    'Organizar el material de bienvenida',
    'Confirmar el montaje del escenario',
  ];
  const tasks: Task[] = descriptions.map((description, i) => ({
    id: `task-${i + 1}`,
    description,
    teamId: ['technical', 'welcome', 'production'][i % 3],
    priority: (['Alta', 'Media', 'Baja'] as const)[i % 3],
    dueAt: at(20 + i * 5),
    assignment: i === 3 || i === 4 || i === 6 ? 'free' : 'individual',
    assigneeId: i === 3 || i === 4 || i === 6 ? null : ['mateo', 'sofia', 'diego'][i % 3],
    status: i > 5 ? 'Completada' : i < 2 ? 'En curso' : 'Pendiente',
    createdAt: at(-24),
    createdBy: 'admin',
    updatedAt: at(-2),
  }));
  // Free tasks always start pending, with no assignee.
  tasks
    .filter((t) => t.assignment === 'free')
    .forEach((t) => {
      t.status = 'Pendiente';
    });
  return {
    schemaVersion: 1,
    event: {
      name: 'Encuentro Aurora',
      startsAt: date.toISOString(),
      venue: 'Auditorio Central · Evento de demostración',
    },
    users: [
      { id: 'admin', name: 'Alex Morgan', role: 'ADMIN', teamId: null },
      { id: 'lucia', name: 'Lucía Torres', role: 'TEAM_LEADER', teamId: 'technical' },
      { id: 'mateo', name: 'Mateo Ruiz', role: 'STAFF', teamId: 'technical' },
      { id: 'elena', name: 'Elena Cruz', role: 'STAFF', teamId: 'technical' },
      { id: 'sofia', name: 'Sofía Vega', role: 'STAFF', teamId: 'welcome' },
      { id: 'pablo', name: 'Pablo Luna', role: 'STAFF', teamId: 'welcome' },
      { id: 'diego', name: 'Diego Sol', role: 'TEAM_LEADER', teamId: 'production' },
    ],
    teams: [
      { id: 'technical', name: 'Técnica', color: '#7b91b0' },
      { id: 'welcome', name: 'Accesos', color: '#c59b69' },
      { id: 'production', name: 'Producción', color: '#8b9b79' },
    ],
    tasks,
    channels: [
      { id: 'general', name: 'General', teamId: null },
      ...['technical', 'welcome', 'production'].map((id, i) => ({
        id,
        name: ['Técnica', 'Accesos', 'Producción'][i],
        teamId: id,
      })),
    ],
    messages: [
      {
        id: 'msg-1',
        channelId: 'general',
        authorId: 'admin',
        content:
          '¡Buen día, equipo! Estamos a cuatro días. Revisen sus tareas y avísennos por aquí si necesitan apoyo.',
        createdAt: at(-2),
      },
      {
        id: 'msg-2',
        channelId: 'general',
        authorId: 'lucia',
        content: 'La revisión técnica ya está en marcha. Hoy verificamos luces y sonido.',
        createdAt: at(-1.5),
      },
      {
        id: 'msg-3',
        channelId: 'general',
        authorId: 'sofia',
        content: 'Recibido. Estamos preparando los accesos y la distribución de asientos.',
        createdAt: at(-1),
      },
      {
        id: 'msg-4',
        channelId: 'technical',
        authorId: 'lucia',
        content: 'Empecemos por las luces del escenario principal.',
        createdAt: at(-1),
      },
      {
        id: 'msg-5',
        channelId: 'welcome',
        authorId: 'sofia',
        content: 'Contaremos los asientos por secciones para evitar duplicados.',
        createdAt: at(-1),
      },
      {
        id: 'msg-6',
        channelId: 'production',
        authorId: 'diego',
        content: 'La escaleta de demostración está lista para revisión.',
        createdAt: at(-1),
      },
    ],
    countdown: {
      segments: [
        { id: 'seg-1', name: 'Apertura de puertas', durationMs: 900_000 },
        { id: 'seg-2', name: 'Bienvenida', durationMs: 300_000 },
        { id: 'seg-3', name: 'Acto principal', durationMs: 2_700_000 },
      ],
      currentIndex: 0,
      status: 'stopped',
      endsAt: null,
      remainingMs: 900_000,
    },
    seatingTeamId: 'welcome',
    seatIncrements: [
      { id: 'seat-1', userId: 'sofia', amount: 120, createdAt: at(-3) },
      { id: 'seat-2', userId: 'pablo', amount: 64, createdAt: at(-2) },
    ],
    notifications: [
      {
        id: 'notice-1',
        recipientId: 'mateo',
        type: 'assignment',
        message: 'Nueva tarea: Revisar la iluminación del escenario',
        createdAt: at(-2),
        read: false,
        taskId: 'task-1',
      },
      {
        id: 'notice-2',
        recipientId: 'admin',
        type: 'updated',
        message: 'El equipo ya comenzó la preparación del evento.',
        createdAt: at(-1),
        read: false,
        taskId: null,
      },
    ],
    activity: [
      {
        id: 'activity-1',
        actorId: 'admin',
        action: 'demo',
        entityId: 'event',
        teamId: null,
        description: 'Preparó el evento y las tareas de demostración.',
        createdAt: at(-24),
      },
      {
        id: 'activity-2',
        actorId: 'sofia',
        action: 'seats',
        entityId: 'seat-1',
        teamId: 'welcome',
        description: 'Registró 120 asientos.',
        createdAt: at(-3),
      },
      {
        id: 'activity-3',
        actorId: 'pablo',
        action: 'seats',
        entityId: 'seat-2',
        teamId: 'welcome',
        description: 'Registró 64 asientos.',
        createdAt: at(-2),
      },
    ],
  };
}
