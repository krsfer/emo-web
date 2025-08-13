'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/types/theme';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme();

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return 'fas fa-sun';
      case 'dark':
        return 'fas fa-moon';
      case 'system':
        return 'fas fa-desktop';
      default:
        return 'fas fa-sun';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode';
      case 'dark':
        return 'Dark mode';
      case 'system':
        return 'System mode';
      default:
        return 'Theme';
    }
  };

  return (
    <button
      className="nav-button theme-toggle"
      onClick={cycleTheme}
      title={`Current: ${getThemeLabel()}. Click to change theme.`}
      aria-label={`Current theme: ${getThemeLabel()}. Click to cycle through themes.`}
      type="button"
    >
      <i className={getThemeIcon()} aria-hidden="true" />
      <span className="sr-only">{getThemeLabel()}</span>
    </button>
  );
};