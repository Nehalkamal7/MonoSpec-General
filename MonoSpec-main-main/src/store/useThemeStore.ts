import { create } from 'zustand';
import { ThemeMode } from '@/types';

interface ThemeStore {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: ThemeMode) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'dark',
  resolvedTheme: 'dark',

  setTheme: (theme) => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('monospec-theme', theme);

    let resolved: 'dark' | 'light' = 'dark';
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = theme;
    }

    const root = document.documentElement;
    if (resolved === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    set({ theme, resolvedTheme: resolved });
  },

  initializeTheme: () => {
    if (typeof window === 'undefined') return;

    const savedTheme = (localStorage.getItem('monospec-theme') as ThemeMode) || 'dark';
    get().setTheme(savedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (get().theme === 'system') {
        const resolved = e.matches ? 'dark' : 'light';
        const root = document.documentElement;
        if (resolved === 'dark') {
          root.classList.add('dark');
          root.style.colorScheme = 'dark';
        } else {
          root.classList.remove('dark');
          root.style.colorScheme = 'light';
        }
        set({ resolvedTheme: resolved });
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
  },
}));
