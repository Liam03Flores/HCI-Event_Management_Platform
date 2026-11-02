import { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Armchair,
  Check,
  Bell,
  Activity as ActivityIcon,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../app/store';
import { isAdmin, seatTotal, uid, visibleActivity } from '../domain/service';
import { Avatar, Empty, PageHeading, dateLabel, roleLabel } from '../components/ui';
import { CountdownDisplay } from '../components/CountdownDisplay';
import type { Segment } from '../domain/types';

export function CountdownPage() {
  const { data, user, run } = useApp();
  const c = data.countdown;
  const admin = user?.role === 'ADMIN';
  const [segments, setSegments] = useState<Segment[]>(structuredClone(c.segments));
  const [dirty, setDirty] = useState(false);
  const editable = c.status === 'stopped' || c.status === 'finished';
  function update(items: Segment[]) {
    setSegments(items);
    setDirty(true);
  }
  function move(index: number, direction: number) {
    const next = [...segments];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    update(next);
  }
  return (
    <>
      <PageHeading
        eyebrow="EL RITMO DEL EVENTO"
        title="Cada momento tiene su tiempo."
        description="Configura la secuencia y acompaña cada segmento del evento."
      />
      <div className="operations-grid">
        <section className="panel timer-main">
          <CountdownDisplay />
          {admin && (
            <div className="timer-controls">
              {(c.status === 'stopped' || c.status === 'finished') && (
                <button
                  className="btn primary"
                  disabled={dirty}
                  onClick={() => run({ type: 'timer', action: 'start' }, 'Secuencia iniciada.')}
                >
                  <Play size={17} />
                  Iniciar secuencia
                </button>
              )}
              {c.status === 'running' && (
                <button
                  className="btn primary"
                  onClick={() => run({ type: 'timer', action: 'pause' }, 'Secuencia pausada.')}
                >
                  <Pause size={17} />
                  Pausar
                </button>
              )}
              {c.status === 'paused' && (
                <button
                  className="btn primary"
                  onClick={() => run({ type: 'timer', action: 'resume' }, 'Secuencia reanudada.')}
                >
                  <Play size={17} />
                  Reanudar
                </button>
              )}
              <button
                className="btn secondary"
                disabled={dirty}
                onClick={() => {
                  if (window.confirm('¿Reiniciar el tiempo del segmento actual?'))
                    run({ type: 'timer', action: 'restart' });
                }}
              >
                <RotateCcw size={15} />
                Reiniciar segmento
              </button>
              {c.status !== 'stopped' && (
                <button
                  className="btn secondary"
                  onClick={() => {
                    if (window.confirm('¿Detener la secuencia y volver al primer segmento?'))
                      run({ type: 'timer', action: 'stop' });
                  }}
                >
                  <Square size={15} />
                  Detener secuencia
                </button>
              )}
            </div>
          )}
          <p className="muted small-text text-center">
            El tiempo se calcula con el reloj del dispositivo y continúa al recargar.
          </p>
        </section>
        <section className="panel segments-panel">
          <div className="section-heading">
            <h2>Secuencia del evento</h2>
            <span className="count-pill">{c.segments.length}</span>
          </div>
          {admin ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (run({ type: 'segments', segments }, 'Secuencia guardada.')) setDirty(false);
              }}
            >
              <fieldset disabled={!editable}>
                <div className="segment-list">
                  {segments.map((s, i) => (
                    <div className="segment-edit" key={s.id}>
                      <span className="segment-number">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <label>
                          Nombre del segmento
                          <input
                            value={s.name}
                            required
                            maxLength={80}
                            onChange={(e) =>
                              update(
                                segments.map((x) =>
                                  x.id === s.id ? { ...x, name: e.target.value } : x,
                                ),
                              )
                            }
                          />
                        </label>
                        <label>
                          Duración (segundos)
                          <input
                            type="number"
                            min={1}
                            max={86400}
                            step={1}
                            required
                            value={s.durationMs / 1000 || ''}
                            onChange={(e) =>
                              update(
                                segments.map((x) =>
                                  x.id === s.id
                                    ? { ...x, durationMs: Number(e.target.value) * 1000 }
                                    : x,
                                ),
                              )
                            }
                          />
                        </label>
                      </div>
                      <div className="segment-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          disabled={i === 0}
                          aria-label={`Subir ${s.name}`}
                          onClick={() => move(i, -1)}
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn"
                          disabled={i === segments.length - 1}
                          aria-label={`Bajar ${s.name}`}
                          onClick={() => move(i, 1)}
                        >
                          <ArrowDown size={16} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn"
                          disabled={segments.length === 1}
                          aria-label={`Eliminar ${s.name}`}
                          onClick={() => {
                            if (window.confirm(`¿Quitar «${s.name}» de la secuencia?`))
                              update(segments.filter((x) => x.id !== s.id));
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="segment-footer">
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() =>
                      update([
                        ...segments,
                        { id: uid(), name: 'Nuevo segmento', durationMs: 60000 },
                      ])
                    }
                  >
                    <Plus size={16} />
                    Añadir segmento
                  </button>
                  <button type="submit" className="btn primary" disabled={!dirty}>
                    Guardar secuencia
                  </button>
                </div>
              </fieldset>
              {!editable && (
                <p className="info-box">Detén la secuencia para editar sus segmentos.</p>
              )}
              {dirty && (
                <p className="info-box">
                  Tienes cambios pendientes. Guarda la secuencia antes de iniciarla.
                </p>
              )}
            </form>
          ) : (
            <ol className="segment-list">
              {c.segments.map((s, i) => (
                <li className="read-segment" key={s.id}>
                  <span className="segment-number">{i + 1}</span>
                  <span>{s.name}</span>
                  <strong>{s.durationMs / 60000} min</strong>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </>
  );
}
export function SeatsPage() {
  const { data, user, run } = useApp();
  const [amount, setAmount] = useState(1);
  const [team, setTeam] = useState(data.seatingTeamId);
  if (!user) return null;
  const canCount = !isAdmin(user) && user.teamId === data.seatingTeamId;
  return (
    <>
      <PageHeading
        eyebrow="CONTROL DE AFORO OPERATIVO"
        title="Cada asiento cuenta."
        description="Registra los asientos contabilizados por el equipo responsable."
      />
      <div className="operations-grid">
        <section className="panel seats-main">
          <span className="seat-icon">
            <Armchair size={32} />
          </span>
          <p className="eyebrow">TOTAL CONTABILIZADO</p>
          <strong className="seat-total">{seatTotal(data).toLocaleString('es-MX')}</strong>
          <p className="muted">asientos registrados</p>
          <span className="badge seating-badge">
            Equipo responsable: {data.teams.find((t) => t.id === data.seatingTeamId)?.name}
          </span>
          {canCount ? (
            <form
              className="seat-controls"
              onSubmit={(e) => {
                e.preventDefault();
                run(
                  { type: 'incrementSeats', amount },
                  `${amount} ${amount === 1 ? 'asiento registrado' : 'asientos registrados'}.`,
                );
              }}
            >
              <label>
                Asientos a sumar
                <input
                  type="number"
                  min={1}
                  max={1000}
                  step={1}
                  required
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </label>
              <button className="btn primary" type="submit">
                <Plus size={19} />
                Registrar incremento
              </button>
            </form>
          ) : (
            <p className="info-box">
              {isAdmin(user)
                ? 'ADMIN consulta el total. El registro lo realiza el personal del equipo designado.'
                : 'Tu equipo no está autorizado para registrar asientos.'}
            </p>
          )}
          {isAdmin(user) && (
            <form
              className="form-stack"
              onSubmit={(e) => {
                e.preventDefault();
                run({ type: 'seatingTeam', teamId: team }, 'Equipo responsable actualizado.');
              }}
            >
              <label>
                Designar equipo
                <select value={team} onChange={(e) => setTeam(e.target.value)}>
                  {data.teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
              <button className="btn secondary" disabled={team === data.seatingTeamId}>
                Guardar equipo responsable
              </button>
            </form>
          )}
        </section>
        <section className="panel">
          <div className="section-heading">
            <h2>Últimos registros</h2>
            <span className="count-pill">{data.seatIncrements.length}</span>
          </div>
          <div className="activity-list">
            {[...data.seatIncrements].reverse().map((s) => (
              <div className="activity-item" key={s.id}>
                <Avatar name={data.users.find((u) => u.id === s.userId)?.name ?? ''} small />
                <div>
                  <strong>{data.users.find((u) => u.id === s.userId)?.name}</strong>
                  <p className="muted small-text">{dateLabel(s.createdAt, true)}</p>
                </div>
                <span className="increment-amount">+{s.amount}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
export function ActivityPage() {
  const { data, user } = useApp();
  if (!user) return null;
  const items = visibleActivity(data, user);
  return (
    <>
      <PageHeading
        eyebrow="LA HISTORIA DEL EVENTO"
        title="Todo avance deja una huella."
        description="Quién hizo qué y cuándo. Una vista de la actividad registrada."
      />
      <section className="panel">
        <div className="section-heading">
          <h2>Historial de actividad</h2>
          <span className="count-pill">{items.length}</span>
        </div>
        <div className="activity-list">
          {[...items].reverse().map((a) => (
            <article className="activity-item" key={a.id}>
              <span className="activity-icon">
                <ActivityIcon size={17} />
              </span>
              <div>
                <strong>{data.users.find((u) => u.id === a.actorId)?.name}</strong>
                <p>{a.description}</p>
                <time className="muted small-text" dateTime={a.createdAt}>
                  {dateLabel(a.createdAt, true)}
                </time>
              </div>
            </article>
          ))}
          {!items.length && <Empty title="Aún no hay actividad" />}
        </div>
      </section>
    </>
  );
}
export function NotificationsPage() {
  const { data, user, run } = useApp();
  const items = data.notifications.filter((n) => n.recipientId === user?.id);
  return (
    <>
      <PageHeading
        eyebrow="NO PIERDAS EL HILO"
        title="Tus notificaciones"
        description="Asignaciones y cambios que necesitan tu atención."
        action={
          <button
            className="btn secondary"
            disabled={!items.some((n) => !n.read)}
            onClick={() =>
              run({ type: 'readNotification' }, 'Notificaciones marcadas como leídas.')
            }
          >
            <Check size={16} />
            Marcar todas como leídas
          </button>
        }
      />
      <section className="panel notification-list">
        {[...items].reverse().map((n) => (
          <article key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
            <span className="activity-icon">
              <Bell size={18} />
            </span>
            <div>
              <p>{n.message}</p>
              <time className="muted small-text">{dateLabel(n.createdAt, true)}</time>
              {n.taskId && (
                <a href="#/tasks" className="text-link">
                  Ver tareas
                </a>
              )}
            </div>
            {!n.read && (
              <button
                className="icon-btn"
                aria-label={`Marcar como leída: ${n.message}`}
                onClick={() => run({ type: 'readNotification', id: n.id }, 'Notificación leída.')}
              >
                <Check size={18} />
              </button>
            )}
          </article>
        ))}
        {!items.length && (
          <Empty title="Estás al día">Aquí aparecerán las novedades que te corresponden.</Empty>
        )}
      </section>
    </>
  );
}
export function ProfilePage() {
  const { data, user, logout } = useApp();
  if (!user) return null;
  return (
    <>
      <PageHeading
        eyebrow="TU ESPACIO EN EL EQUIPO"
        title="Profile"
        description="Tu información dentro de este evento."
      />
      <section className="panel profile-panel">
        <Avatar name={user.name} />
        <h2>{user.name}</h2>
        <span className="badge role-badge">{roleLabel[user.role]}</span>
        <dl className="detail-grid">
          <div>
            <dt>Equipo</dt>
            <dd>{data.teams.find((t) => t.id === user.teamId)?.name ?? 'Administración'}</dd>
          </div>
          <div>
            <dt>Evento</dt>
            <dd>{data.event.name}</dd>
          </div>
        </dl>
        <p className="info-box">
          <ShieldCheck size={18} />
          Tu rol es asignado por ADMIN. Esta entrada por nombre es una demostración local, sin
          autenticación segura.
        </p>
        <button className="btn secondary" onClick={logout}>
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </section>
    </>
  );
}
export function SettingsPage() {
  const { reset } = useApp();
  return (
    <>
      <PageHeading
        eyebrow="CONFIGURACIÓN LOCAL"
        title="Un espacio para probar."
        description="Los datos de esta demostración se conservan en este navegador."
      />
      <section className="panel settings-panel">
        <h2>Datos de demostración</h2>
        <p>
          Restaura el evento, sus usuarios, tareas, mensajes, segmentos y conteo inicial. Esta
          acción reemplaza todos los cambios locales y cierra la sesión.
        </p>
        <button
          className="btn danger"
          onClick={() => {
            if (
              window.confirm(
                '¿Restaurar todos los datos de ejemplo? Se perderán tus cambios locales y se cerrará la sesión.',
              )
            )
              reset();
          }}
        >
          <RotateCcw size={17} />
          Restaurar datos de ejemplo
        </button>
        <hr />
        <h2>Acerca de esta versión</h2>
        <p>Event Management Platform · v1.0</p>
        <p className="muted">
          Demostración frontend sin servidor ni sincronización entre dispositivos. Todos los
          nombres, mensajes y cifras son ficticios. Walkie Talkie, Extra y Map son accesos
          provisionales.
        </p>
      </section>
    </>
  );
}
export function NotFoundPage() {
  return (
    <div className="not-found">
      <span className="eyebrow">UN ESPACIO POR CONSTRUIR</span>
      <strong>
        404<span>.</span>
      </strong>
      <h1>Esto llegará en otro momento.</h1>
      <p className="muted">
        Esta sección es provisional y no forma parte de la demostración actual.
      </p>
      <a className="btn primary" href="#/">
        Volver a Home
      </a>
    </div>
  );
}
