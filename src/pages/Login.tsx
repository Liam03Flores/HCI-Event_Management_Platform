import { useState } from 'react';
import { ArrowRight, Layers3, CalendarDays, MapPin, Check, Sparkles } from 'lucide-react';
import { useApp } from '../app/store';
import { findUsersByName } from '../domain/service';
import { Avatar, dateLabel, roleLabel } from '../components/ui';
import type { User } from '../domain/types';

export function Login() {
  const { data, login } = useApp();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [matches, setMatches] = useState<User[]>([]);
  function submit() {
    const found = findUsersByName(data, name);
    setError('');
    setMatches([]);
    if (!found.length)
      setError(
        'No encontramos ese nombre. Usa uno de los usuarios de demostración o consulta a ADMIN.',
      );
    else if (found.length === 1) login(found[0].id);
    else setMatches(found);
  }
  return (
    <div className="login-layout">
      <section className="login-story">
        <a href="#/" className="brand">
          <span className="brand-symbol">
            <Layers3 size={22} />
          </span>
          <span>
            event<span className="brand-light">flow</span>
            <small>EVENT MANAGEMENT PLATFORM</small>
          </span>
        </a>
        <div className="login-story-content">
          <span className="light-tag">
            <Sparkles size={14} /> CADA DETALLE, EN SU LUGAR
          </span>
          <h1>
            Un gran evento.
            <br />
            Un equipo
            <br />
            <em>en sintonía.</em>
          </h1>
          <p>
            El espacio donde la planificación se convierte en acción. Coordina, comunica y acompaña
            a tu equipo.
          </p>
          <div className="event-ticket">
            <div>
              <p className="eyebrow">PRÓXIMO EN ESCENA</p>
              <h2>{data.event.name}</h2>
              <span>
                <CalendarDays size={15} />
                {dateLabel(data.event.startsAt, true)}
              </span>
              <span>
                <MapPin size={15} />
                Auditorio Central
              </span>
            </div>
            <div className="ticket-stamp">
              D−4<small>DEMO</small>
            </div>
          </div>
        </div>
        <div className="story-footer">
          <span>
            <Check size={14} /> Tareas claras
          </span>
          <span>
            <Check size={14} /> Equipo conectado
          </span>
          <span>
            <Check size={14} /> Todo bajo control
          </span>
        </div>
      </section>
      <main className="login-main">
        <div className="login-card">
          <span className="edition">
            ESPACIO DE DEMOSTRACIÓN <span>01</span>
          </span>
          <h2>Hola, qué bueno verte.</h2>
          <p className="muted">Ingresa con tu nombre para entrar al equipo.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <label htmlFor="login-name">Tu nombre</label>
            <input
              id="login-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setMatches([]);
                setError('');
              }}
              autoComplete="name"
              placeholder="Escribe tu nombre completo"
              required
              autoFocus
            />
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            <button className="btn primary w-full" type="submit">
              Entrar al espacio <ArrowRight size={17} />
            </button>
          </form>
          {matches.length > 1 && (
            <div className="duplicate-options">
              <p>Hay varias personas con ese nombre. Selecciona tu equipo:</p>
              {matches.map((u) => (
                <button key={u.id} className="demo-person" onClick={() => login(u.id)}>
                  {u.name} · {data.teams.find((t) => t.id === u.teamId)?.name ?? 'Administración'} ·{' '}
                  {u.id.slice(-6)}
                </button>
              ))}
            </div>
          )}
          <div className="demo-accounts">
            <p className="eyebrow">EXPLORA CON UN USUARIO DE EJEMPLO</p>
            {data.users
              .filter((u) => ['admin', 'mateo', 'sofia', 'lucia'].includes(u.id))
              .map((u) => (
                <button
                  className="demo-person"
                  key={u.id}
                  onClick={() => {
                    setName(u.name);
                    setMatches([]);
                    setError('');
                  }}
                >
                  <Avatar name={u.name} small />
                  <span>
                    <strong>{u.name}</strong>
                    <small>
                      {roleLabel[u.role]}
                      {u.teamId ? ` · ${data.teams.find((t) => t.id === u.teamId)?.name}` : ''}
                    </small>
                  </span>
                  <ArrowUpIcon />
                </button>
              ))}
          </div>
          <p className="login-note">
            Demostración local, sin autenticación real. Los datos se guardan únicamente en este
            navegador; no se sincronizan entre dispositivos.
          </p>
        </div>
        <span className="login-copyright">EVENTFLOW · HECHO PARA TRABAJAR EN EQUIPO</span>
      </main>
    </div>
  );
}
function ArrowUpIcon() {
  return <ArrowRight size={16} className="ml-auto" />;
}
