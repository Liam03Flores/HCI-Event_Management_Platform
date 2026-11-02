import type { Countdown } from './types.ts';

// Reconcile elapsed wall-clock time, including multiple segments while the tab was closed.
export function reconcileCountdown(input: Countdown, now: number): Countdown {
  const c = structuredClone(input);
  if (c.status !== 'running' || c.endsAt === null) return c;
  while (now >= c.endsAt) {
    if (c.currentIndex >= c.segments.length - 1) {
      c.status = 'finished';
      c.remainingMs = 0;
      c.endsAt = null;
      return c;
    }
    c.currentIndex += 1;
    c.endsAt += c.segments[c.currentIndex].durationMs;
  }
  c.remainingMs = Math.max(0, c.endsAt - now);
  return c;
}

export function remainingTime(c: Countdown, now: number) {
  return c.status === 'running' && c.endsAt !== null ? Math.max(0, c.endsAt - now) : c.remainingMs;
}
