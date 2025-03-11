'use client';

//import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
// Eliminamos la importación estática de signOut
import Link from 'next/link';
import { User } from 'next-auth';

async function checkVerification() {
  try {
    const res = await fetch('/api/auth/check-verification');
    const data = await res.json();
    
    if (res.ok) {
      return { verified: true, user: data.user, needsSessionRefresh: data.needsSessionRefresh };
    } else {
      return { verified: false, error: data.error };
    }
  } catch (error) {
    console.error('Error checking verification:', error);
    return { verified: false, error: 'Error al verificar email' };
  }
}

// Función auxiliar para cerrar sesión usando dynamic import
async function handleSignOut(callbackUrl?: string) {
  try {
    const { signOut } = await import('next-auth/react');
    await signOut({ redirect: true, callbackUrl: callbackUrl || '/auth/signin' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    // Fallback en caso de error: redirección manual
    window.location.href = callbackUrl || '/auth/signin';
  }
}

// Verificación del lado del cliente
export default function Dashboard() {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const result = await checkVerification();
        console.log('Resultado de verificación:', result);

        if (result.verified) {
          setIsVerified(true);
          setUserData(result.user);
        } else {
          console.error('Error al verificar email:', result.error);
          setError(result.error || 'Error desconocido');
          setIsVerified(false);
        }
      } catch (error) {
        console.error('Error al verificar email:', error);
        setError('Error inesperado al verificar email');
        setIsVerified(false);
      }
      
      setIsLoading(false);
    };
    
    verifyEmail();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-base-content/70">Cargando...</p>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="card bg-base-100 shadow-xl p-6 max-w-md w-full mx-auto">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4 text-error">Error</h1>
          <p className="mb-6">
            {error || "Email no verificado"}
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              Reintentar
            </button>
            <button 
              onClick={() => handleSignOut('/auth/signin')}
              className="btn btn-outline"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-base-content text-2xl mb-6">Dashboard</h1>
          
          <div className="bg-base-200 text-base-content p-4 rounded-lg mb-6">
            <h2 className="text-lg font-bold mb-2">Tu información</h2>
            <p><strong>Nombre:</strong> {userData?.name}</p>
            <p><strong>Email:</strong> {userData?.email}</p>
            <p><strong>Email verificado:</strong> ✅</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link href="/profile" className="btn btn-primary">
              Mi perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 