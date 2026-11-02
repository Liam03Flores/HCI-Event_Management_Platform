import { useState } from 'react';
import {
  Plus,
  Search,
  ArrowRight,
  ClipboardList,
  CheckCircle2,
  ListTodo,
  Clock3,
} from 'lucide-react';
import { useApp } from '../app/store';
import { isAdmin, visibleTasks } from '../domain/service';
import type { Task, TaskInput, TaskStatus } from '../domain/types';
import {
  Avatar,
  DueDate,
  Empty,
  Modal,
  PageHeading,
  PriorityBadge,
  StatusBadge,
  dateLabel,
} from '../components/ui';

const statuses: TaskStatus[] = ['Pendiente', 'En curso', 'Completada'];
export function TasksPage({ dashboard = false }: { dashboard?: boolean }) {
  const { data, user } = useApp();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [team, setTeam] = useState('all');
  const [tab, setTab] = useState('mine');
  const [selected, setSelected] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  if (!user) return null;
  const admin = isAdmin(user);
  const tasks = visibleTasks(data, user);
  const available = tasks.filter((t) => !t.assigneeId);
  const mine = tasks.filter((t) => t.assigneeId === user.id);
  const source = admin ? tasks : tab === 'available' ? available : tab === 'team' ? tasks : mine;
  const filtered = source.filter(
    (t) =>
      t.description.toLocaleLowerCase().includes(search.toLocaleLowerCase()) &&
      (status === 'all' || t.status === status) &&
      (team === 'all' || t.teamId === team),
  );
  const editing = data.tasks.find((t) => t.id === selected);
  return (
    <>
      <PageHeading
        eyebrow={admin ? 'CENTRO DE OPERACIONES' : `HOLA, ${user.name.split(' ')[0].toUpperCase()}`}
        title={
          admin
            ? dashboard
              ? 'Todo listo para un gran evento.'
              : 'Tareas del evento'
            : 'Vamos paso a paso.'
        }
        description={
          admin
            ? 'Una vista clara de lo que importa. Tu equipo, en movimiento.'
            : 'Tus tareas y tu equipo, siempre a la mano.'
        }
        action={
          admin && (
            <button className="btn primary" onClick={() => setCreating(true)}>
              <Plus size={17} />
              Nueva tarea
            </button>
          )
        }
      />
      {(dashboard || !admin) && (
        <div className={`stats-grid ${!admin ? 'staff-stats' : ''}`}>
          {[
            {
              label: admin ? 'Tareas del evento' : 'Mis tareas',
              value: admin ? tasks.length : mine.length,
              icon: ClipboardList,
              tone: 'green',
            },
            {
              label: 'En curso',
              value: (admin ? tasks : mine).filter((t) => t.status === 'En curso').length,
              icon: Clock3,
              tone: 'orange',
            },
            {
              label: 'Completadas',
              value: (admin ? tasks : mine).filter((t) => t.status === 'Completada').length,
              icon: CheckCircle2,
              tone: 'green',
            },
            ...(admin
              ? [
                  {
                    label: 'Tareas disponibles',
                    value: available.length,
                    icon: ListTodo,
                    tone: 'neutral',
                  },
                ]
              : []),
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-top">
                <span>{s.label}</span>
                <s.icon size={17} className={`tone-${s.tone}`} />
              </div>
              <strong>{String(s.value).padStart(2, '0')}</strong>
              <span className="stat-caption">
                {s.label === 'Completadas'
                  ? 'Cada avance cuenta'
                  : s.label === 'Tareas disponibles'
                    ? 'Listas para el equipo'
                    : 'Preparación del evento'}
              </span>
            </div>
          ))}
        </div>
      )}
      <section className="panel task-panel">
        <div className="section-heading">
          <div>
            <h2>
              {admin ? 'Tablero de tareas' : 'Tasks'}{' '}
              <span className="count-pill">{source.length}</span>
            </h2>
            <p className="muted small-text">
              {admin
                ? 'Cada responsabilidad, con nombre y fecha.'
                : 'Concéntrate en tu siguiente paso.'}
            </p>
          </div>
          {admin && (
            <span className="live-label">
              <i /> Preparación
            </span>
          )}
        </div>
        {!admin && (
          <div className="tab-bar">
            <button className={tab === 'mine' ? 'active' : ''} onClick={() => setTab('mine')}>
              Asignadas <span>{mine.length}</span>
            </button>
            <button
              className={tab === 'available' ? 'active' : ''}
              onClick={() => setTab('available')}
            >
              Disponibles <span>{available.length}</span>
            </button>
            {user.role === 'TEAM_LEADER' && (
              <button className={tab === 'team' ? 'active' : ''} onClick={() => setTab('team')}>
                Mi equipo
              </button>
            )}
          </div>
        )}
        <div className="filters">
          <div className="search-field">
            <Search size={17} />
            <input
              aria-label="Buscar tareas"
              placeholder="Buscar una tarea…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            aria-label="Filtrar por estado"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {admin && (
            <select
              aria-label="Filtrar por equipo"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            >
              <option value="all">Todos los equipos</option>
              {data.teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}
        </div>
        {filtered.length === 0 ? (
          <Empty title="Todo despejado por aquí">
            Prueba otro filtro o vuelve cuando haya nuevas tareas.
          </Empty>
        ) : admin ? (
          <div className="table-scroll" role="region" aria-label="Tabla de tareas" tabIndex={0}>
            <table className="task-table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Responsable</th>
                  <th>Equipo</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Fecha límite</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const assignee = data.users.find((u) => u.id === t.assigneeId);
                  return (
                    <tr key={t.id}>
                      <td>
                        <button className="task-title" onClick={() => setSelected(t.id)}>
                          {t.description}
                          <span>
                            {t.assignment === 'free' && !t.assigneeId
                              ? 'Tarea libre · Disponible'
                              : `TSK-${String(data.tasks.indexOf(t) + 1).padStart(3, '0')}`}
                          </span>
                        </button>
                      </td>
                      <td>
                        {assignee ? (
                          <div className="person-cell">
                            <Avatar name={assignee.name} small />
                            <span>{assignee.name}</span>
                          </div>
                        ) : (
                          <span className="unassigned">Sin asignar</span>
                        )}
                      </td>
                      <td>
                        <span className="team-label">
                          <i
                            style={{
                              background: data.teams.find((team) => team.id === t.teamId)?.color,
                            }}
                          />
                          {data.teams.find((team) => team.id === t.teamId)?.name}
                        </span>
                      </td>
                      <td>
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                      <td>
                        <DueDate value={t.dueAt} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="task-cards" role="region" aria-label="Lista de tareas" tabIndex={0}>
            {filtered.map((t) => (
              <TaskCard key={t.id} task={t} onOpen={() => setSelected(t.id)} />
            ))}
          </div>
        )}
        <div className="table-footer">
          <span>
            {filtered.length} {filtered.length === 1 ? 'tarea' : 'tareas'}
            {admin ? ` de ${tasks.length}` : ''}
          </span>
          <span>Datos de demostración · Guardado local</span>
        </div>
      </section>
      {creating && <TaskEditor onClose={() => setCreating(false)} />}
      {editing && <TaskDetail task={editing} onClose={() => setSelected(null)} />}
    </>
  );
}
function TaskCard({ task, onOpen }: { task: Task; onOpen: () => void }) {
  const { user, run, data } = useApp();
  return (
    <article className="task-card">
      <div className="flex items-center justify-between">
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
      </div>
      <button className="card-task-title" onClick={onOpen}>
        {task.description}
        <ArrowRight size={17} />
      </button>
      <p className="muted small-text">
        {data.teams.find((t) => t.id === task.teamId)?.name} · <DueDate value={task.dueAt} />
      </p>
      {!task.assigneeId && user?.role === 'STAFF' ? (
        <button
          className="btn secondary w-full"
          onClick={() =>
            run({ type: 'acceptTask', id: task.id }, 'La tarea ahora está asignada a ti.')
          }
        >
          Aceptar tarea
        </button>
      ) : task.assigneeId === user?.id ? (
        <label className="status-control">
          Estado
          <select
            aria-label={`Estado de ${task.description}`}
            value={task.status}
            onChange={(e) =>
              run(
                { type: 'taskStatus', id: task.id, status: e.target.value as TaskStatus },
                'Estado actualizado.',
              )
            }
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      ) : (
        <span className="muted small-text">
          {data.users.find((u) => u.id === task.assigneeId)?.name ?? 'Disponible para STAFF'}
        </span>
      )}
    </article>
  );
}
function TaskDetail({ task, onClose }: { task: Task; onClose: () => void }) {
  const { data, user, run } = useApp();
  const [edit, setEdit] = useState(false);
  if (edit) return <TaskEditor task={task} onClose={onClose} />;
  return (
    <Modal title="Detalle de la tarea" onClose={onClose}>
      <div className="detail-content">
        <div className="flex gap-3">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
        <h3>{task.description}</h3>
        <dl className="detail-grid">
          <div>
            <dt>Responsable</dt>
            <dd>
              {data.users.find((u) => u.id === task.assigneeId)?.name ??
                'Disponible · Sin responsable'}
            </dd>
          </div>
          <div>
            <dt>Equipo</dt>
            <dd>{data.teams.find((t) => t.id === task.teamId)?.name}</dd>
          </div>
          <div>
            <dt>Fecha límite</dt>
            <dd>{dateLabel(task.dueAt, true)}</dd>
          </div>
          <div>
            <dt>Última actualización</dt>
            <dd>{dateLabel(task.updatedAt, true)}</dd>
          </div>
        </dl>
        {(user?.role === 'ADMIN' || user?.id === task.assigneeId) && (
          <label>
            Estado
            <select
              value={task.status}
              disabled={!task.assigneeId}
              onChange={(e) =>
                run({ type: 'taskStatus', id: task.id, status: e.target.value as TaskStatus })
              }
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        )}
        <div className="modal-actions">
          {user?.role === 'ADMIN' && (
            <button className="btn primary" onClick={() => setEdit(true)}>
              Editar tarea
            </button>
          )}
          {user?.role === 'STAFF' && !task.assigneeId && (
            <button
              className="btn primary"
              onClick={() => {
                if (run({ type: 'acceptTask', id: task.id }, 'Tarea aceptada.')) onClose();
              }}
            >
              Aceptar tarea
            </button>
          )}
          <button className="btn secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
function localInput(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}
function TaskEditor({ task, onClose }: { task?: Task; onClose: () => void }) {
  const { data, run, notice } = useApp();
  const [form, setForm] = useState<TaskInput>(
    task
      ? {
          description: task.description,
          priority: task.priority,
          dueAt: task.dueAt,
          teamId: task.teamId,
          assignment: task.assignment,
          assigneeId: task.assigneeId,
        }
      : {
          description: '',
          priority: 'Media',
          dueAt: null,
          teamId: data.teams[0].id,
          assignment: 'individual',
          assigneeId: null,
        },
  );
  const [due, setDue] = useState(localInput(task?.dueAt ?? null));
  return (
    <Modal title={task ? 'Editar tarea' : 'Una nueva tarea'} onClose={onClose}>
      <form
        className="form-stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (
            run(
              {
                type: 'saveTask',
                id: task?.id,
                input: { ...form, dueAt: due ? new Date(due).toISOString() : null },
              },
              task ? 'Tarea actualizada.' : 'Tarea creada.',
            )
          )
            onClose();
        }}
      >
        <label>
          Descripción
          <textarea
            value={form.description}
            required
            minLength={3}
            maxLength={500}
            placeholder="¿Qué necesita hacer el equipo?"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <div className="form-grid">
          <label>
            Equipo
            <select
              value={form.teamId}
              onChange={(e) => setForm({ ...form, teamId: e.target.value, assigneeId: null })}
            >
              {data.teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Prioridad
            <select
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value as TaskInput['priority'] })
              }
            >
              {['Alta', 'Media', 'Baja'].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Fecha límite <span className="muted">(opcional)</span>
          <input type="datetime-local" value={due} onChange={(e) => setDue(e.target.value)} />
        </label>
        <label>
          Tipo de asignación
          <select
            value={form.assignment}
            onChange={(e) =>
              setForm({
                ...form,
                assignment: e.target.value as TaskInput['assignment'],
                assigneeId: null,
              })
            }
          >
            <option value="individual">Individual · Elegir responsable</option>
            <option value="free">Libre · Disponible para el equipo</option>
          </select>
        </label>
        {(form.assignment === 'individual' || !!form.assigneeId) && (
          <label>
            Responsable
            <select
              value={form.assigneeId ?? ''}
              required={form.assignment === 'individual'}
              onChange={(e) => setForm({ ...form, assigneeId: e.target.value || null })}
            >
              <option value="">
                {form.assignment === 'free'
                  ? 'Volver a publicar sin responsable'
                  : 'Selecciona una persona'}
              </option>
              {data.users
                .filter((u) => u.teamId === form.teamId && u.role !== 'ADMIN')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
            </select>
          </label>
        )}
        {form.assignment === 'free' && !form.assigneeId && (
          <p className="info-box">
            El personal de este equipo podrá aceptar la tarea. Se publicará como pendiente y sin
            responsable.
          </p>
        )}
        {notice?.error && (
          <p className="field-error" role="alert">
            {notice.message}
          </p>
        )}
        <div className="modal-actions">
          <button className="btn secondary" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn primary" type="submit">
            {task ? 'Guardar cambios' : 'Crear tarea'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
