'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * AuthGuard allows full public browsing of all demo & judge pages without blocking.
 * Keeps auth context active for optional authenticated portal actions.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  // Subtle non-blocking render during initial session hydration
  if (isLoading) {
    return <>{children}</>;
  }

  return <>{children}</>;
}

