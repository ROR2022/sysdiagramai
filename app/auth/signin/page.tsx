'use client';

import { useState, useEffect, Suspense } from 'react';
// Eliminamos la importación estática
//import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// export const runtime = 'nodejs'; // Descomenta si es necesario

interface GetParamsProps {
  setSignInProps: (params: ISignInProps) => void;
}

const GetParams = ({setSignInProps}: GetParamsProps) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const message = searchParams.get('message') || '';
  const error_param = searchParams.get('error') || '';
  const action = searchParams.get('action') || '';

  useEffect(() => {
    setSignInProps({ callbackUrl, message, error: error_param, action });
  }, 
  //eslint-disable-next-line react-hooks/exhaustive-deps
  [callbackUrl, message, error_param, action]);
  return null;
}

// Función auxiliar para iniciar sesión usando dynamic import
async function handleSignInWithCredentials(options: { 
  email: string; 
  password?: string; 
  callbackUrl?: string; 
  redirect?: boolean;
}) {
  try {
    const { signIn } = await import('next-auth/react');
    return await signIn('credentials', options);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
}

// Función auxiliar para iniciar sesión con Google
async function handleSignInWithGoogle(callbackUrl?: string) {
  try {
    const { signIn } = await import('next-auth/react');
    return await signIn('google', { callbackUrl, redirect: true });
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    throw error;
  }
}

interface ISignInProps {
  callbackUrl?: string;
  message?: string;
  error?: string;
  action?: string;
}
 const initialSignInProps: ISignInProps = {
  callbackUrl: '/dashboard',
  message: '',
  error: '',
  action: ''
 }

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [authMethod, setAuthMethod] = useState<'magic' | 'password'>('magic');
  const [signInProps, setSignInProps] = useState<ISignInProps>(initialSignInProps);
  

  useEffect(() => {
    console.log('[SignInForm] URL:', window.location.href);
    console.log('[SignInForm] callbackUrl:', signInProps.callbackUrl);

    // Verificar si hay mensajes de éxito en la URL
    if (signInProps.message === 'check-email') {
      setSuccessMessage('Te hemos enviado un enlace para iniciar sesión a tu email.');
    } else if (signInProps.message === 'verified') {
      setSuccessMessage('¡Email verificado correctamente! Ahora puedes iniciar sesión.');
    } else if (signInProps.message === 'emailVerified' && signInProps.action === 'refresh') {
      setSuccessMessage('¡Tu email ha sido verificado! Por favor inicia sesión nuevamente para actualizar tu sesión.');
    } else if (signInProps.message === 'check-email') {
      setSuccessMessage('Revisa tu email para iniciar sesión');
    }

    // Verificar si hay errores de autenticación en la URL
    if (signInProps.error === 'CredentialsSignin') {
      console.log('[SignInForm] Error en URL:', signInProps.error);
      setError('Email o contraseña incorrectos');
    }
  }, [signInProps.callbackUrl, signInProps.message, signInProps.error, signInProps.action]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await handleSignInWithGoogle(signInProps.callbackUrl);
    } catch (error) {
      console.error('[SignInForm] Error al iniciar sesión con Google:', error);
      setError('Error al iniciar sesión con Google');
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!email) {
      setError('Por favor ingresa tu dirección de correo electrónico');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa una dirección de correo electrónico válida');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('[SignInForm] Enviando inicio de sesión con email mágico...');
      await handleSignInWithCredentials({ 
        email, 
        callbackUrl: signInProps.callbackUrl, 
        redirect: false 
      });
      
      // Si llegamos aquí, mostramos al usuario que revise su email
      setSuccessMessage('Por favor revisa tu email para continuar con el inicio de sesión');
      setEmail('');
    } catch (error) {
      console.error('[SignInForm] Error al enviar el email:', error);
      setError('Error al enviar el enlace. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("[SignInForm] Error: Formato de email inválido");
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log("[SignInForm] Autenticando con credenciales:", { email });
      console.log("[SignInForm] Valor de callbackUrl:", signInProps.callbackUrl);
      console.log("[SignInForm] Estrategia de sesión actualizada a JWT para depuración");
      console.log("[SignInForm] NEXTAUTH_URL:", process.env.NEXTAUTH_URL || 'no establecido');
      
      // Usamos redirección automática permitiendo que NextAuth maneje el flujo
      console.log("[SignInForm] Llamando a signIn con redirect:true...");
      
      // Asegurarnos de que el callbackUrl es absoluto
      const absoluteCallbackUrl = signInProps.callbackUrl?.startsWith('http') 
        ? signInProps.callbackUrl 
        : `${process.env.NEXTAUTH_URL || window.location.origin}${signInProps.callbackUrl}`;
        
      console.log("[SignInForm] URL de callback absoluta:", absoluteCallbackUrl);
      
      await handleSignInWithCredentials({ 
        email,
        password,
        callbackUrl: absoluteCallbackUrl,
        redirect: true
      });
      
      // Este código solo se ejecutará si redirect:true falla por algún motivo
      console.log("[SignInForm] ¡NOTA! Este mensaje no debería verse si redirect:true funciona correctamente");
      
    } catch (error) {
      console.error('[SignInForm] Error durante el proceso de autenticación:', error);
      setError('Error al iniciar sesión. Por favor verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden">
      <Suspense fallback={<div>Cargando...</div>}>
        <GetParams setSignInProps={setSignInProps} />
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
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-transparent dark:from-primary/10 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-secondary/20 to-transparent dark:from-secondary/10 blur-3xl"></div>
      </div>
      
      {/* Logo gráfico decorativo */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-primary/10 dark:text-primary/5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32">
          <path d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" />
        </svg>
      </div>
      
      <div className="card bg-base-100 shadow-xl border border-base-300 dark:border-base-700 w-full max-w-md relative z-10 backdrop-blur-sm bg-base-100/90 dark:bg-base-100/80">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-base-content">SysDiagramAI</h1>
            <p className="text-base-content/70 mt-2">Inicia sesión para continuar</p>
          </div>

          {successMessage && (
            <div className="bg-success/10 border-l-4 border-success text-success p-4 mb-5 rounded-r-md shadow-sm animate-fadeIn" role="status">
              <p className="font-medium">{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="bg-error/10 border-l-4 border-error text-error-content p-4 mb-5 rounded-r-md shadow-sm animate-fadeIn" role="alert">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="btn btn-outline hover:bg-base-200 dark:hover:bg-base-700 w-full flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-base-content" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando...
                </span>
              ) : (
                <>
                  <svg className="h-5 w-5 text-primary" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.787-1.638-4.139-2.639-6.735-2.639-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10-7.584 10-10 0-0.772-0.098-1.5-0.226-2.177l-9.774 0.448z" />
                  </svg>
                  <span>Continuar con Google</span>
                </>
              )}
            </button>

            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-300 dark:border-base-600"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-base-100 px-2 text-base-content/60 dark:bg-base-100/80">o</span>
              </div>
            </div>

            {showEmailInput ? (
              <div>
                {/* Tabs para elegir tipo de autenticación */}
                <div className="tabs tabs-boxed bg-base-200/50 p-1 mb-4">
                  <a 
                    className={`tab flex-1 ${authMethod === 'magic' ? 'tab-active' : ''}`}
                    onClick={() => setAuthMethod('magic')}
                  >
                    Email Mágico
                  </a>
                  <a 
                    className={`tab flex-1 ${authMethod === 'password' ? 'tab-active' : ''}`}
                    onClick={() => setAuthMethod('password')}
                  >
                    Contraseña
                  </a>
                </div>
                
                {authMethod === 'magic' ? (
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Correo electrónico</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tucorreo@ejemplo.com"
                        className="input input-bordered w-full text-base-content bg-base-100"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 hover:brightness-105"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-base-content" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando enlace...
                        </span>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>Enviar enlace de acceso</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordSignIn} className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Correo electrónico</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tucorreo@ejemplo.com"
                        className="input input-bordered w-full text-base-content bg-base-100"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Contraseña</span>
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        className="input input-bordered w-full text-base-content bg-base-100"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 hover:brightness-105"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-base-content" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Iniciando sesión...
                        </span>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span>Iniciar sesión</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowEmailInput(true)}
                className="btn btn-primary w-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 hover:brightness-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Continuar con Email</span>
              </button>
            )}
          </div>

          <div className="mt-8 text-center text-sm">
            <p className="text-base-content/70">
              Al iniciar sesión, aceptas nuestros{' '}
              <Link href="/terms" className="link link-hover text-primary font-medium transition-colors">
                Términos de servicio
              </Link>{' '}
              y{' '}
              <Link href="/privacy" className="link link-hover text-primary font-medium transition-colors">
                Política de privacidad
              </Link>
            </p>
          </div>
          
          <div className="divider my-6"></div>
          
          <p className="text-center text-sm text-base-content/60">
            ¿Nuevo en SysDiagramAI?{' '}
            <Link href="/auth/signup" className="text-primary font-medium hover:underline">
              Crear una cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 