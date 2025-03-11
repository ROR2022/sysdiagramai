'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  // Función para reenviar el email de verificación
  const handleResendEmail = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al reenviar el email de verificación');
      }
      
      setMessage('¡Email reenviado correctamente! Por favor revisa tu bandeja de entrada.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error al reenviar el email');
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const handleSignOut = async () => {
    setLoading(true);
    try {
      // Importamos dinámicamente para evitar problemas con TurboPack
      const { signOut } = await import('next-auth/react');
      await signOut({ redirect: false });
      router.push('/auth/signin');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Fallback en caso de error: redirección manual
      router.push('/auth/signin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-warning/20 to-transparent dark:from-warning/10 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-info/20 to-transparent dark:from-info/10 blur-3xl"></div>
      </div>
      
      <div className="card bg-base-100 shadow-xl border border-base-300 dark:border-base-700 w-full max-w-md relative z-10 backdrop-blur-sm bg-base-100/90 dark:bg-base-100/80">
        <div className="card-body p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-warning/20 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-base-content">Verifica tu email</h1>
          </div>
          
          <div className="bg-warning/10 border-l-4 border-warning text-warning-content p-4 mb-5 rounded-r-md shadow-sm">
            <p className="font-medium">Tu cuenta está casi lista.</p>
            <p className="mt-1 text-sm">Hemos enviado un email de verificación a tu dirección de correo. Por favor revisa tu bandeja de entrada y haz clic en el enlace de verificación.</p>
          </div>

          {message && (
            <div className="bg-info/10 border-l-4 border-info text-info-content p-4 mb-5 rounded-r-md shadow-sm">
              <p className="font-medium">{message}</p>
            </div>
          )}

          <div className="space-y-4 mt-6">
            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : 'Reenviar email de verificación'}
            </button>
            
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="btn btn-outline w-full"
            >
              Cerrar sesión
            </button>
          </div>

          <div className="mt-8 text-center text-sm">
            <p className="text-base-content/70">
              Si continúas experimentando problemas, por favor{' '}
              <Link href="/contact" className="link link-hover text-primary font-medium transition-colors">
                contacta a soporte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 