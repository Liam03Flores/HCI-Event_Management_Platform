export type Role = 'ADMIN' | 'TEAM_LEADER' | 'STAFF';
export type TaskStatus = 'Pendiente' | 'En curso' | 'Completada';
export type Priority = 'Alta' | 'Media' | 'Baja';
export interface User {
  id: string;
  name: string;
  role: Role;
  teamId: string | null;
}
export interface Team {
  id: string;
  name: string;
  color: string;
}
// Membership and leadership are derived from User.teamId / User.role: no duplicated lists.
export interface Task {
  id: string;
  description: string;
  priority: Priority;
  dueAt: string | null;
  teamId: string;
  assignment: 'individual' | 'free';
  assigneeId: string | null;
  status: TaskStatus;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}
export type TaskInput = Pick<
  Task,
  'description' | 'priority' | 'dueAt' | 'teamId' | 'assignment' | 'assigneeId'
>;
export interface Channel {
  id: string;
  name: string;
  teamId: string | null;
}
export interface Message {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  createdAt: string;
}
export interface Segment {
  id: string;
  name: string;
  durationMs: number;
}
export interface Countdown {
  segments: Segment[];
  currentIndex: number;
  status: 'stopped' | 'running' | 'paused' | 'finished';
  endsAt: number | null;
  remainingMs: number;
}
export interface SeatIncrement {
  id: string;
  userId: string;
  amount: number;
  createdAt: string;
}
export interface Notification {
  id: string;
  recipientId: string;
  type: 'assignment' | 'accepted' | 'updated';
  message: string;
  createdAt: string;
  read: boolean;
  taskId: string | null;
}
export interface Activity {
  id: string;
  actorId: string;
  action: string;
  entityId: string;
  teamId: string | null;
  description: string;
  createdAt: string;
}
export interface AppData {
  schemaVersion: 1;
  event: { name: string; startsAt: string; venue: string };
  users: User[];
  teams: Team[];
  tasks: Task[];
  channels: Channel[];
  messages: Message[];
  countdown: Countdown;
  seatingTeamId: string;
  seatIncrements: SeatIncrement[];
  notifications: Notification[];
  activity: Activity[];
}
