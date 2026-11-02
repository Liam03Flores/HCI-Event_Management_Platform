import { Timer } from 'lucide-react';
import { useApp } from '../app/store';
import { reconcileCountdown, remainingTime } from '../domain/countdown';

export const timerLabels = {
  stopped: 'Sin iniciar',
  running: 'En marcha',
  paused: 'En pausa',
  finished: 'Terminada',
};
export function formatTime(ms: number) {
  const s = Math.ceil(Math.max(0, ms) / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
export function CountdownDisplay({ compact = false }: { compact?: boolean }) {
  const { data, now } = useApp();
  const c = reconcileCountdown(data.countdown, now);
  const remaining = remainingTime(c, now);
  const segment = c.segments[c.currentIndex];
  const progress = Math.min(100, Math.max(0, 100 * (1 - remaining / segment.durationMs)));
  return (
    <div className={`countdown-display ${compact ? 'compact' : ''}`}>
      <div className="countdown-top">
        <span>
          <Timer size={15} /> COUNTDOWN
        </span>
        <span className={`timer-status ${c.status}`}>{timerLabels[c.status]}</span>
      </div>
      <div
        className="countdown-digits"
        role="timer"
        aria-label={`Tiempo restante: ${formatTime(remaining)}`}
      >
        {formatTime(remaining)}
      </div>
      <p>{c.status === 'finished' ? 'Secuencia completada' : segment.name}</p>
      {!compact && (
        <>
          <div className="countdown-track">
            <span style={{ width: `${progress}%` }} />
          </div>
          <span className="countdown-caption">
            SEGMENTO {c.currentIndex + 1} DE {c.segments.length}
          </span>
        </>
      )}
    </div>
  );
}
