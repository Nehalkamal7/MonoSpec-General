'use client';

import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeMode } from '@/types';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useThemeStore();

  const options: { mode: ThemeMode; icon: typeof Sun; label: string }[] = [
    { mode: 'light', icon: Sun, label: 'Light' },
    { mode: 'dark', icon: Moon, label: 'Dark' },
    { mode: 'system', icon: Laptop, label: 'System' },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-1 p-0.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        {options.map(({ mode, icon: Icon, label }) => {
          const isActive = theme === mode;
          return (
            <button
              key={mode}
              onClick={() => setTheme(mode)}
              title={`Switch to ${label} mode`}
              className={`p-1.5 rounded-md transition-all ${
                isActive
                  ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] shadow-xs font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] w-full">
      {options.map(({ mode, icon: Icon, label }) => {
        const isActive = theme === mode;
        return (
          <button
            key={mode}
            onClick={() => setTheme(mode)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs transition-all ${
              isActive
                ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] font-medium shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
