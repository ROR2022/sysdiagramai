'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface GetParamsProps {
  setError: (error: string) => void;
}

const GetParams = ({setError}: GetParamsProps) => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    setError(error || '');
  }, [error, setError]);

  return null;
}

export default function AuthError() {
  const [error, setError] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Mapeo de códigos de error a mensajes amigables
    const errorMessages: Record<string, string> = {
      'Configuration': 'Error en la configuración de autenticación. Por favor contacte al administrador.',
      'AccessDenied': 'Acceso denegado. No tienes permiso para iniciar sesión.',
      'Verification': 'El enlace de verificación ha expirado o ya ha sido utilizado.',
      'OAuthSignin': 'Error al iniciar el proceso de autenticación con el proveedor.',
      'OAuthCallback': 'Error al procesar la respuesta del proveedor de autenticación.',
      'OAuthCreateAccount': 'No se pudo crear una cuenta con el proveedor de autenticación.',
      'EmailCreateAccount': 'No se pudo crear una cuenta con el correo electrónico proporcionado.',
      'Callback': 'Error al procesar la solicitud de inicio de sesión.',
      'OAuthAccountNotLinked': 'La cuenta ya existe con un proveedor diferente.',
      'EmailSignin': 'Error al enviar el correo electrónico de verificación.',
      'CredentialsSignin': 'Error al iniciar sesión. Verifica tus credenciales.',
      'SessionRequired': 'Se requiere iniciar sesión para acceder a esta página.',
      'Default': 'Ocurrió un error durante la autenticación. Por favor intenta nuevamente.',
    };

    setErrorMessage(errorMessages[error as string] || errorMessages['Default']);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden">
      <Suspense fallback={<div>Cargando...</div>}>
        <GetParams setError={setError} />
      </Suspense>
      {/* Enlace para regresar al inicio */}
      <Link href="/" className="absolute top-6 left-6 btn btn-ghost btn-circle text-base-content hover:bg-base-300/50 z-20 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="sr-only">Regresar al inicio</span>
      </Link>
      
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-error/20 to-transparent dark:from-error/10 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-secondary/20 to-transparent dark:from-secondary/10 blur-3xl"></div>
      </div>
      
      <div className="card bg-base-100 shadow-xl border border-base-300 dark:border-base-700 w-full max-w-md relative z-10 backdrop-blur-sm bg-base-100/90 dark:bg-base-100/80">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-base-content">Error de autenticación</h1>
          </div>

          <div className="bg-error/10 border-l-4 border-error text-error-content p-4 mb-5 rounded-r-md shadow-sm">
            <p className="font-medium">{errorMessage}</p>
            <p className="text-sm mt-2 text-base-content/70">Código de error: {error || 'Desconocido'}</p>
          </div>

          <div className="space-y-4 mt-6">
            <Link 
              href="/auth/signin" 
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
              Volver a intentar inicio de sesión
            </Link>

            <Link 
              href="/" 
              className="btn btn-outline btn-secondary w-full flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
              </svg>
              Ir a la página principal
            </Link>
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