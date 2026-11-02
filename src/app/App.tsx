import { useEffect, useState } from 'react';
import {
  Activity,
  Armchair,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Hash,
  Home,
  LayoutDashboard,
  Layers3,
  LogOut,
  Map,
  Menu,
  MessageSquare,
  Plus,
  Radio,
  Settings,
  Timer,
  UserRound,
  Users,
  UsersRound,
  X,
} from 'lucide-react';
import { useApp } from './store';
import { Login } from '../pages/Login';
import { TasksPage } from '../pages/Tasks';
import { PeoplePage } from '../pages/People';
import { ChatPage } from '../pages/Chat';
import {
  ActivityPage,
  CountdownPage,
  NotificationsPage,
  NotFoundPage,
  ProfilePage,
  SeatsPage,
  SettingsPage,
} from '../pages/Operations';
import { Avatar, Modal, dateLabel, roleLabel } from '../components/ui';
import { CountdownDisplay } from '../components/CountdownDisplay';
import { seatTotal } from '../domain/service';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tasks', label: 'Tareas', icon: ClipboardList },
  { path: '/people', label: 'Personal', icon: Users },
  { path: '/teams', label: 'Equipos', icon: UsersRound },
  { path: '/channels', label: 'Canales', icon: Hash },
  { path: '/countdown', label: 'Countdown', icon: Timer },
  { path: '/seats', label: 'Conteo de asientos', icon: Armchair },
  { path: '/chat', label: 'Chat', icon: MessageSquare },
  { path: '/activity', label: 'Actividad', icon: Activity },
];
function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/');
  useEffect(() => {
    const update = () => {
      setRoute(window.location.hash.slice(1) || '/');
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return route;
}
export function App() {
  const { data, user, notice, dismiss, logout } = useApp();
  const route = useRoute();
  const [help, setHelp] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => setMenu(false), [route]);
  useEffect(() => {
    window.scrollTo({ top: 0 });
    setHelp(false);
    setMenu(false);
  }, [user?.id]);
  if (!user) return <Login />;
  const admin = user.role === 'ADMIN';
  const unread = data.notifications.filter((n) => n.recipientId === user.id && !n.read).length;
  const protectedRoutes = ['/people', '/teams', '/settings'];
  function page() {
    if (!admin && protectedRoutes.includes(route))
      return (
        <div className="panel access-denied">
          <h1>Esta sección es de ADMIN</h1>
          <p>Tu rol no permite gestionar personas, equipos o configuración.</p>
          <a href="#/" className="btn primary">
            Volver a Home
          </a>
        </div>
      );
    switch (route) {
      case '/':
        return <TasksPage dashboard={admin} />;
      case '/tasks':
        return <TasksPage />;
      case '/people':
        return <PeoplePage />;
      case '/teams':
        return <PeoplePage teams />;
      case '/channels':
        return <ChatPage channelsOnly />;
      case '/chat':
        return <ChatPage />;
      case '/countdown':
        return <CountdownPage />;
      case '/seats':
        return <SeatsPage />;
      case '/activity':
        return <ActivityPage />;
      case '/notifications':
        return <NotificationsPage />;
      case '/profile':
        return <ProfilePage />;
      case '/settings':
        return <SettingsPage />;
      case '/walkie-talkie':
      case '/extra':
      case '/map':
        return <NotFoundPage />;
      default:
        if (route.startsWith('/chat/')) return <ChatPage channelId={route.split('/')[2]} />;
        return <NotFoundPage />;
    }
  }
  return (
    <div className={admin ? 'admin-app' : 'staff-app'}>
      {admin && (
        <>
          <aside id="admin-sidebar" className={`sidebar ${menu ? 'open' : ''}`}>
            <a href="#/" className="brand">
              <span className="brand-symbol">
                <Layers3 size={21} />
              </span>
              <span>
                event<span className="brand-light">flow</span>
                <small>EVENT MANAGEMENT PLATFORM</small>
              </span>
            </a>
            <div className="workspace-switch">
              <span className="workspace-avatar">A</span>
              <span>
                <strong>Encuentro Aurora</strong>
                <small>Espacio de trabajo</small>
              </span>
              <ChevronDown size={15} />
            </div>
            <p className="nav-heading">ESPACIO DE TRABAJO</p>
            <nav aria-label="Navegación principal">
              {navItems.map((item) => (
                <a
                  href={`#${item.path}`}
                  className={
                    route === item.path || (item.path === '/chat' && route.startsWith('/chat/'))
                      ? 'active'
                      : ''
                  }
                  key={item.path}
                >
                  <item.icon size={18} />
                  {item.label}
                  {item.path === '/tasks' && (
                    <span className="nav-count">
                      {data.tasks.filter((t) => t.status !== 'Completada').length}
                    </span>
                  )}
                </a>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <a href="#/settings" className={route === '/settings' ? 'active' : ''}>
                <Settings size={18} />
                Configuración
              </a>
              <button onClick={() => setHelp(true)}>
                <CircleHelp size={18} />
                Ayuda y guía
              </button>
              <div className="sidebar-profile">
                <Avatar name={user.name} />
                <a href="#/profile">
                  <strong>{user.name}</strong>
                  <small>ADMIN</small>
                </a>
                <button className="icon-btn" aria-label="Cerrar sesión" onClick={logout}>
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </aside>
          {menu && (
            <button
              aria-label="Cerrar menú"
              className="sidebar-backdrop"
              onClick={() => setMenu(false)}
            />
          )}
        </>
      )}
      <div className="app-body">
        <header className="topbar">
          {admin ? (
            <>
              <button
                className="icon-btn menu-toggle"
                aria-label="Abrir menú"
                aria-expanded={menu}
                aria-controls="admin-sidebar"
                onClick={() => setMenu(!menu)}
              >
                <Menu size={22} />
              </button>
              <div className="breadcrumbs">
                Espacio de trabajo <span>/</span>{' '}
                <strong>
                  {navItems.find((i) => i.path === route)?.label ??
                    (route === '/notifications'
                      ? 'Notificaciones'
                      : route === '/profile'
                        ? 'Profile'
                        : route === '/settings'
                          ? 'Configuración'
                          : route.startsWith('/chat/')
                            ? 'Chat'
                            : 'Sección provisional')}
                </strong>
              </div>
              <div className="topbar-right">
                <span className="demo-label">
                  <i /> DEMO LOCAL
                </span>
                <button className="icon-btn" aria-label="Ayuda" onClick={() => setHelp(true)}>
                  <CircleHelp size={19} />
                </button>
                <a
                  className="icon-btn notification-bell"
                  href="#/notifications"
                  aria-label={`Notificaciones, ${unread} sin leer`}
                >
                  <Bell size={19} />
                  {unread > 0 && <span>{unread}</span>}
                </a>
                <a href="#/profile" aria-label="Mi perfil">
                  <Avatar name={user.name} small />
                </a>
              </div>
            </>
          ) : (
            <>
              <a className="staff-brand" href="#/">
                <Layers3 size={23} />
                <span>
                  {data.event.name}
                  <small>EVENT MANAGEMENT PLATFORM</small>
                </span>
              </a>
              <div className="flex gap-2">
                <button className="icon-btn" aria-label="Ayuda" onClick={() => setHelp(true)}>
                  <CircleHelp size={20} />
                </button>
                <a
                  className="icon-btn notification-bell"
                  href="#/notifications"
                  aria-label={`Notificaciones, ${unread} sin leer`}
                >
                  <Bell size={20} />
                  {unread > 0 && <span>{unread}</span>}
                </a>
                <a href="#/profile" aria-label="Mi perfil">
                  <Avatar name={user.name} small />
                </a>
              </div>
            </>
          )}
        </header>
        {admin ? (
          <div className="event-banner">
            <div className="event-banner-title">
              <span className="event-monogram">
                <Layers3 size={23} />
              </span>
              <div>
                <h2>
                  {data.event.name}
                  <span>DEMO</span>
                </h2>
                <p>{data.event.venue}</p>
              </div>
            </div>
            <div className="event-banner-date">
              <CalendarDays size={18} />
              <span>{dateLabel(data.event.startsAt, true)}</span>
              <strong>A 4 días del evento</strong>
            </div>
          </div>
        ) : (
          <>
            <div className="staff-context">
              <a href="#/countdown">
                <CountdownDisplay compact />
              </a>
              <div className="staff-identity">
                <Avatar name={user.name} />
                <strong>{user.name.split(' ')[0]}</strong>
                <span>{roleLabel[user.role]}</span>
                <small>{data.teams.find((t) => t.id === user.teamId)?.name ?? 'Sin equipo'}</small>
              </div>
            </div>
            <div className="online-banner">
              <span>
                <i />
                Online
              </span>
              <span>Demo local · Sin sincronización</span>
            </div>
          </>
        )}
        <div className={admin ? 'content-layout' : 'staff-content'}>
          <main
            id="main-content"
            className={`main-content ${route === '/' || route === '/tasks' ? 'task-view' : ''}`}
            key={route}
          >
            {page()}
            {!admin && (route === '/' || route === '/tasks') && (
              <>
                <section className="quick-section">
                  <p className="eyebrow">A UN TOQUE DE DISTANCIA</p>
                  <div className="quick-links">
                    {[
                      { href: '/tasks', label: 'Tasks', icon: ClipboardList },
                      { href: '/chat', label: 'Chat', icon: MessageSquare },
                      { href: '/walkie-talkie', label: 'Walkie Talkie', icon: Radio },
                      { href: '/channels', label: 'Channel', icon: Hash },
                    ].map((i) => (
                      <a href={`#${i.href}`} key={i.href}>
                        <i.icon size={23} />
                        <strong>{i.label}</strong>
                      </a>
                    ))}
                  </div>
                </section>
                <div className="staff-extra-links">
                  <a className="btn secondary" href="#/seats">
                    <Armchair size={17} />
                    Conteo de asientos
                  </a>
                  {user.role === 'TEAM_LEADER' && (
                    <a className="btn secondary" href="#/activity">
                      <Activity size={17} />
                      Actividad del equipo
                    </a>
                  )}
                </div>
              </>
            )}
          </main>
          {admin && <ContextPanel />}
        </div>
        <footer className="app-footer">
          <span>EVENTFLOW · EVENT MANAGEMENT PLATFORM</span>
          <span>Todo comienza con un buen equipo.</span>
        </footer>
      </div>
      {!admin && (
        <nav className="bottom-nav" aria-label="Navegación inferior">
          {[
            { href: '/', label: 'Home', icon: Home },
            { href: '/extra', label: 'Extra', icon: Plus },
            { href: '/map', label: 'Map', icon: Map },
            { href: '/profile', label: 'Profile', icon: UserRound },
          ].map((i) => (
            <a key={i.href} href={`#${i.href}`} className={route === i.href ? 'active' : ''}>
              <i.icon size={21} />
              {i.label}
            </a>
          ))}
        </nav>
      )}
      {notice && (
        <div
          className={`toast ${notice.error ? 'error' : ''}`}
          role={notice.error ? 'alert' : 'status'}
        >
          <span>{notice.error ? <CircleHelp size={19} /> : <Check size={19} />}</span>
          <p>{notice.message}</p>
          <button className="icon-btn" aria-label="Cerrar aviso" onClick={dismiss}>
            <X size={16} />
          </button>
        </div>
      )}
      {help && (
        <Modal title="Una guía para empezar" onClose={() => setHelp(false)}>
          <div className="help-content">
            <p>
              Este es un evento ficticio para probar la coordinación de un equipo, cuatro días antes
              de su realización.
            </p>
            <ul>
              <li>
                <strong>ADMIN:</strong> crea tareas, gestiona personal y controla la secuencia.
              </li>
              <li>
                <strong>STAFF:</strong> consulta sus tareas, acepta tareas libres de su equipo y
                actualiza su estado.
              </li>
              <li>
                <strong>Líder:</strong> consulta el trabajo del equipo y coordina por chat. No crea
                ni asigna tareas.
              </li>
              <li>
                <strong>Asientos:</strong> solo el personal del equipo designado puede registrar
                incrementos.
              </li>
            </ul>
            <p className="info-box">
              Todo se guarda en este navegador. Online es un indicador de demostración. Walkie
              Talkie, Extra y Map llevan a una página 404 provisional.
            </p>
            <button className="btn primary" onClick={() => setHelp(false)}>
              Entendido
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
function ContextPanel() {
  const { data } = useApp();
  const [preview, setPreview] = useState('chat');
  const messages = data.messages.filter((m) => m.channelId === 'general').slice(-3);
  return (
    <aside className="context-panel" aria-label="Resumen del evento">
      <section className="panel countdown-widget">
        <CountdownDisplay />
        <a href="#/countdown">
          Controlar secuencia <ArrowUpRight size={15} />
        </a>
      </section>
      <section className="panel seat-widget">
        <div className="widget-heading">
          <span>CONTEO DE ASIENTOS</span>
          <Armchair size={18} />
        </div>
        <div className="seat-widget-total">
          {seatTotal(data)}
          <small>asientos</small>
        </div>
        <div className="seat-widget-footer">
          <span>
            <i />
            {data.teams.find((t) => t.id === data.seatingTeamId)?.name}
          </span>
          <a aria-label="Ver conteo de asientos" href="#/seats">
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <section className="panel preview-widget">
        <div className="preview-tabs">
          <button
            onClick={() => setPreview('chat')}
            className={preview === 'chat' ? 'active' : ''}
            aria-pressed={preview === 'chat'}
          >
            <MessageSquare size={15} />
            Chat
          </button>
          <button
            onClick={() => setPreview('todo')}
            className={preview === 'todo' ? 'active' : ''}
            aria-pressed={preview === 'todo'}
          >
            <ClipboardList size={15} />
            To-do
          </button>
        </div>
        {preview === 'chat' ? (
          <>
            <div className="preview-channel">
              <Hash size={16} />
              <strong>General</strong>
              <span className="muted">{data.users.length} personas</span>
            </div>
            <div className="chat-preview-messages">
              {messages.map((m) => (
                <div key={m.id}>
                  <Avatar small name={data.users.find((u) => u.id === m.authorId)?.name ?? ''} />
                  <article>
                    <strong>
                      {data.users.find((u) => u.id === m.authorId)?.name}
                      <time>
                        {new Date(m.createdAt).toLocaleTimeString('es-MX', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </time>
                    </strong>
                    <p>{m.content}</p>
                  </article>
                </div>
              ))}
            </div>
            <a className="preview-link" href="#/chat">
              Abrir conversación
              <ArrowUpRight size={15} />
            </a>
          </>
        ) : (
          <>
            <div className="todo-preview">
              {data.tasks
                .filter((t) => t.status !== 'Completada')
                .slice(0, 4)
                .map((t) => (
                  <a href="#/tasks" key={t.id}>
                    <span className="todo-dot" />
                    {t.description}
                  </a>
                ))}
            </div>
            <a className="preview-link" href="#/tasks">
              Ver todas las tareas
              <ArrowUpRight size={15} />
            </a>
          </>
        )}
      </section>
      <p className="context-footnote">
        <Layers3 size={14} /> Un equipo. Un mismo objetivo.
      </p>
    </aside>
  );
}
