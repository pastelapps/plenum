'use client';

import { useContext } from 'react';
import { TurmaContext, type TurmaContextValue } from '@/components/dynamic/TurmaProvider';

export function useTurma(): TurmaContextValue {
  const context = useContext(TurmaContext);
  if (!context) {
    throw new Error('useTurma must be used within a <TurmaProvider>');
  }
  return context;
}
