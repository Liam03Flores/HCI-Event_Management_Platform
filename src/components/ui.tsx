import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Check, Circle, Clock3, X, CalendarDays, ArrowUpRight } from 'lucide-react';
import type { Priority, TaskStatus } from '../domain/types';

export const roleLabel = { ADMIN: 'Administrador', STAFF: 'Staff', TEAM_LEADER: 'Líder de equipo' };
export function Avatar({ name, small = false }: { name: string; small?: boolean }) {
  return (
    <span aria-hidden="true" className={`avatar ${small ? 'small' : ''}`}>
      {name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')}
    </span>
  );
}
export function StatusBadge({ status }: { status: TaskStatus }) {
  const Icon = status === 'Completada' ? Check : status === 'En curso' ? Clock3 : Circle;
  return (
    <span className={`badge status-${status.replace(' ', '-').toLowerCase()}`}>
      <Icon size={12} />
      {status}
    </span>
  );
}
export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`priority priority-${priority.toLowerCase()}`}>
      <span aria-hidden="true">{priority === 'Alta' ? '↑' : priority === 'Media' ? '−' : '↓'}</span>{' '}
      {priority}
    </span>
  );
}
export function dateLabel(value: string | null, full = false) {
  return value
    ? new Intl.DateTimeFormat('es-MX', {
        day: 'numeric',
        month: 'short',
        ...(full ? ({ hour: '2-digit', minute: '2-digit' } as const) : {}),
      }).format(new Date(value))
    : 'Sin fecha';
}
export function DueDate({ value }: { value: string | null }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <CalendarDays size={13} />
      {dateLabel(value)}
    </span>
  );
}
export function Empty({
  title = 'No hay elementos por ahora',
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty">
      <Circle size={28} />
      <h3>{title}</h3>
      {children && <p>{children}</p>}
    </div>
  );
}
export function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      className={`modal ${wide ? 'wide' : ''}`}
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const box = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < box.left ||
            e.clientX > box.right ||
            e.clientY < box.top ||
            e.clientY > box.bottom
          )
            onClose();
        }
      }}
      aria-labelledby="dialog-title"
    >
      <div className="modal-heading">
        <h2 id="dialog-title">{title}</h2>
        <button className="icon-btn" aria-label="Cerrar" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="text-link" href={href}>
      {children}
      <ArrowUpRight size={15} />
    </a>
  );
}
