'use client';

import { SessionProvider } from 'next-auth/react';
import ProtectedRoute from '../components/ProtectedRoute';

export default function ProtectedLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <SessionProvider>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </SessionProvider>
  );
} 