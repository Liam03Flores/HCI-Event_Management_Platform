import { useEffect, useRef, useState } from 'react';
import { Hash, Send, Users, ArrowUpRight, MessageSquare } from 'lucide-react';
import { useApp } from '../app/store';
import { accessibleChannels, readMessages } from '../domain/service';
import { Avatar, Empty, PageHeading, dateLabel } from '../components/ui';

export function ChatPage({
  channelsOnly = false,
  channelId = 'general',
}: {
  channelsOnly?: boolean;
  channelId?: string;
}) {
  const { data, user, run } = useApp();
  const [content, setContent] = useState('');
  const end = useRef<HTMLDivElement>(null);
  const channels = user ? accessibleChannels(data, user) : [];
  const channel = channels.find((c) => c.id === channelId);
  const messages = user && channel ? readMessages(data, user.id, channel.id) : [];
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' });
  }, [messages.length, channelId]);
  useEffect(() => {
    setContent('');
  }, [channelId]);
  if (!user) return null;
  if (channelsOnly)
    return (
      <>
        <PageHeading
          eyebrow="LA CONVERSACIÓN, EN SU LUGAR"
          title="Canales del evento"
          description="Un espacio general y un canal para cada equipo."
        />
        <div className="teams-grid">
          {channels.map((c) => (
            <a href={`#/chat/${c.id}`} className="panel channel-card" key={c.id}>
              <div className="flex justify-between">
                <span className="team-icon">
                  <Hash size={25} />
                </span>
                <ArrowUpRight size={19} />
              </div>
              <h2>{c.name}</h2>
              <p className="muted">
                {c.teamId ? 'Solo integrantes del equipo y ADMIN' : 'Todo el personal del evento'}
              </p>
              <span className="flex gap-2 items-center small-text">
                <MessageSquare size={15} />
                {data.messages.filter((m) => m.channelId === c.id).length} mensajes
              </span>
            </a>
          ))}
        </div>
      </>
    );
  if (!channel)
    return (
      <section className="panel">
        <Empty title="No tienes acceso a este canal">
          Selecciona uno de tus canales autorizados.
        </Empty>
        <a className="btn primary" href="#/channels">
          Ver mis canales
        </a>
      </section>
    );
  return (
    <>
      <PageHeading
        eyebrow="COMUNICACIÓN DEL EQUIPO"
        title="Una conversación que nos conecta."
        description="Mensajes locales para mantener a todos en contexto."
      />
      <div className="chat-layout panel">
        <nav className="channel-nav" aria-label="Canales de chat">
          <p className="eyebrow">CANALES</p>
          {channels.map((c) => (
            <a className={c.id === channel.id ? 'active' : ''} href={`#/chat/${c.id}`} key={c.id}>
              <Hash size={17} />
              {c.name}
              {c.teamId === null && <span className="count-pill">{data.users.length}</span>}
            </a>
          ))}
          <p className="chat-local-note">
            Demostración local.
            <br />
            Los mensajes no se envían a otros dispositivos.
          </p>
        </nav>
        <section className="chat-conversation">
          <header>
            <div>
              <h2>
                <Hash size={21} />
                {channel.name}
              </h2>
              <p className="muted small-text">
                {channel.teamId ? 'El espacio de tu equipo' : 'El punto de encuentro de todos'}
              </p>
            </div>
            <span className="muted inline-flex gap-2 items-center">
              <Users size={17} />
              {channel.teamId
                ? data.users.filter((u) => u.teamId === channel.teamId || u.role === 'ADMIN').length
                : data.users.length}
            </span>
          </header>
          <div
            className="messages"
            role="log"
            aria-label={`Mensajes de ${channel.name}`}
            aria-live="polite"
          >
            <div className="chat-date">CONVERSACIÓN DEL EVENTO</div>
            {!messages.length && (
              <Empty title="Comienza la conversación">
                Comparte una actualización con tu equipo.
              </Empty>
            )}
            {messages.map((m) => {
              const author = data.users.find((u) => u.id === m.authorId);
              return (
                <article className={`message ${m.authorId === user.id ? 'own' : ''}`} key={m.id}>
                  <Avatar name={author?.name ?? 'Usuario'} small />
                  <div>
                    <div className="message-author">
                      <strong>{author?.name}</strong>
                      <time dateTime={m.createdAt}>{dateLabel(m.createdAt, true)}</time>
                    </div>
                    <p>{m.content}</p>
                  </div>
                </article>
              );
            })}
            <div ref={end} />
          </div>
          <form
            className="message-composer"
            onSubmit={(e) => {
              e.preventDefault();
              if (run({ type: 'sendMessage', channelId: channel.id, content }, '')) setContent('');
            }}
          >
            <input
              aria-label="Mensaje"
              placeholder={`Escribe en #${channel.name.toLowerCase()}…`}
              value={content}
              maxLength={2000}
              required
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              className="btn primary"
              type="submit"
              aria-label="Enviar mensaje"
              disabled={!content.trim()}
            >
              <Send size={18} />
              <span>Enviar</span>
            </button>
          </form>
          <p className="composer-note">
            Visible para quienes tienen acceso a este canal, en este navegador.
          </p>
        </section>
      </div>
    </>
  );
}
