import { createContext, useContext } from 'react';
import type { AppData, User } from '../domain/types';
import type { Command } from '../domain/service';

export interface AppContextValue {
  data: AppData;
  user: User | null;
  now: number;
  notice: { message: string; error: boolean } | null;
  run: (command: Command, message?: string) => boolean;
  login: (id: string) => void;
  logout: () => void;
  tell: (message: string, error?: boolean) => void;
  dismiss: () => void;
  reset: () => void;
}

// Keep the context identity outside the provider's Fast Refresh boundary.
export const AppContext = createContext<AppContextValue | null>(null);
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppProvider requerido');
  return ctx;
}
