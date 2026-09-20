'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Zap } from 'lucide-react';

const PUBLIC_PATHS = ['/login'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p));

  useEffect(() => {
    if (!isLoading && !user && !isPublic) {
      router.replace('/login');
    }
  }, [user, isLoading, isPublic, router]);

  // Show branded splash while checking auth
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
          gap: 20,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #00f0ff 0%, #0050ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(0, 240, 255, 0.5)',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}
        >
          <Zap size={34} color="#070b14" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #00f0ff, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 6,
            }}
          >
            GridFlex AI
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Initializing secure session…
          </div>
        </div>
        <style>{`
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 30px rgba(0, 240, 255, 0.4); transform: scale(1); }
            50% { box-shadow: 0 0 60px rgba(0, 240, 255, 0.7); transform: scale(1.05); }
          }
        `}</style>
      </div>
    );
  }

  // Block render on protected pages while unauthenticated
  if (!user && !isPublic) {
    return null;
  }

  return <>{children}</>;
}
