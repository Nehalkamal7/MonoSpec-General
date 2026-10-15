'use client';

import React, { useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const initializeTheme = useThemeStore((s) => s.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return <>{children}</>;
}
