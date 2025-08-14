'use client';

import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}