import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppData } from '../domain/types';
import { AppContext } from './store';
import type { AppContextValue } from './store';
import { execute } from '../domain/service';
import { reconcileCountdown } from '../domain/countdown';
import { LocalRepository, session } from '../services/repository';

const errorText = (error: unknown) =>
  error instanceof Error ? error.message : 'No se pudo completar la operación.';

// This module exports only a component so Fast Refresh can retain the provider.
export function AppProvider({ children }: { children: ReactNode }) {
  const [repository] = useState(() => {
    try {
      return new LocalRepository(window.localStorage);
    } catch {
      return null;
    }
  });
  const [initial] = useState(() => {
    try {
      if (!repository)
        throw new Error(
          'El almacenamiento local está bloqueado. Habilítalo y vuelve a cargar la página.',
        );
      return { data: repository.load(), error: '' };
    } catch (error) {
      return { data: null, error: errorText(error) };
    }
  });
  const [data, setData] = useState<AppData | null>(initial.data);
  const [bootError, setBootError] = useState(initial.error);
  const [userId, setUserId] = useState(session.get);
  const [notice, setNotice] = useState<AppContextValue['notice']>(null);
  const [now, setNow] = useState(Date.now);
  const tell = (message: string, error = false) => setNotice({ message, error });
  const user = data?.users.find((u) => u.id === userId) ?? null;
  useEffect(() => {
    const timer = window.setInterval(() => {
      const time = Date.now();
      setNow(time);
      if (!repository || !data || data.countdown.status !== 'running') return;
      const reconciled = reconcileCountdown(data.countdown, time);
      if (
        reconciled.currentIndex !== data.countdown.currentIndex ||
        reconciled.status !== data.countdown.status
      ) {
        try {
          const current = repository.load();
          const next = { ...current, countdown: reconcileCountdown(current.countdown, time) };
          repository.save(next);
          setData(next);
        } catch (error) {
          tell(errorText(error), true);
        }
      }
    }, 500);
    return () => window.clearInterval(timer);
  }, [data, repository]);
  const reset = () => {
    try {
      if (!repository) throw new Error('El almacenamiento local no está disponible.');
      setData(repository.reset());
      session.set(null);
      setUserId(null);
      setBootError('');
      setNotice(null);
      window.location.hash = '/';
    } catch (error) {
      setBootError(errorText(error));
      tell(errorText(error), true);
    }
  };
  if (!data)
    return (
      <div className="recovery">
        <div className="panel">
          <p className="eyebrow">RECUPERACIÓN LOCAL</p>
          <h1>No pudimos cargar tus datos</h1>
          <p role="alert">{bootError}</p>
          <div className="flex flex-wrap gap-3">
            <button
              className="btn secondary"
              onClick={() => {
                try {
                  const blob = new Blob([repository?.rawBackup() ?? '{}'], {
                    type: 'application/json',
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'aurora-datos-recuperacion.json';
                  a.click();
                  setTimeout(() => URL.revokeObjectURL(url), 1000);
                } catch (error) {
                  setBootError(errorText(error));
                }
              }}
            >
              Descargar copia
            </button>
            <button
              className="btn primary"
              onClick={() => {
                if (
                  window.confirm(
                    'Esto reemplazará los datos locales. Descarga una copia antes si quieres conservarlos. ¿Restaurar la demostración?',
                  )
                )
                  reset();
              }}
            >
              Restaurar demostración
            </button>
          </div>
        </div>
      </div>
    );
  const run: AppContextValue['run'] = (command, message = 'Cambios guardados.') => {
    try {
      if (!user || !repository) throw new Error('Vuelve a entrar para continuar.');
      const current = repository.load();
      const next = execute(current, user.id, command);
      repository.save(next);
      setData(next);
      if (message) tell(message);
      return true;
    } catch (error) {
      tell(errorText(error), true);
      return false;
    }
  };
  return (
    <AppContext.Provider
      value={{
        data,
        user,
        now,
        notice,
        run,
        tell,
        dismiss: () => setNotice(null),
        login: (id) => {
          session.set(id);
          setUserId(id);
          setNotice(null);
        },
        logout: () => {
          session.set(null);
          setUserId(null);
          setNotice(null);
          window.location.hash = '/';
        },
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
