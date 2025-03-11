import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Esta función se ejecuta en todas las solicitudes a las rutas incluidas en el matcher
export async function middleware(request: NextRequest) {
  // Log para depuración
  console.log('[Middleware] URL solicitada:', request.nextUrl.pathname);
  
  // Verificar si la ruta solicitada está protegida
  const isProtectedRoute = [
    '/dashboard', 
    '/profile', 
    '/home'
  ].some(route => request.nextUrl.pathname.startsWith(route));
  
  // Verificar todas las cookies de sesión posibles
  let token = null;
  let foundCookieName = null;
  
  // Definir las cookies de sesión válidas (¡no incluir cookies CSRF u otras!)
  const sessionCookieNames = [
    // Solo cookies de sesión reales
    'authjs.session-token',
    '__Secure-authjs.session-token',
    '__Host-authjs.session-token',
    // Versiones antiguas
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    '__Host-next-auth.session-token',
  ];
  
  // Otras cookies que no son de sesión pero queremos mostrar en los logs
  /* const otherCookieNames = [
    'authjs.csrf-token',
    'authjs.callback-url',
    'authjs.pkce.code_verifier',
    'next-auth.csrf-token',
    'next-auth.callback-url',
    // Para JWT específicamente
    'next-auth.jwt',
    'authjs.jwt',
    '__Secure-authjs.jwt',
    '__Secure-next-auth.jwt'
  ]; */
  
  // Buscar solo en cookies de sesión para validar autenticación
  for (const name of sessionCookieNames) {
    const cookieValue = request.cookies.get(name)?.value;
    if (cookieValue) {
      token = cookieValue;
      foundCookieName = name;
      console.log(`[Middleware] Cookie de sesión válida encontrada: ${name}`);
      break;
    }
  }
  
  // Log para depuración
  console.log(`[Middleware] Cookie de sesión encontrada: ${foundCookieName || 'ninguna'}`);
  
  // Imprimir todas las cookies para depuración
  const allCookies = Array.from(request.cookies.getAll());
  console.log(`[Middleware] Total cookies (${allCookies.length}):`, 
    allCookies.map(c => `${c.name}: ${c.value.substring(0, 10)}...`));
  
  // Si es una ruta protegida y no hay token, redirigir a login
  if (isProtectedRoute && !token) {
    console.log('[Middleware] Redirigiendo a signin, ruta protegida sin token');
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Si hay un token válido y va a signin, redirigir a dashboard
  if (token && request.nextUrl.pathname.startsWith('/auth/signin')) {
    console.log('[Middleware] Redirigiendo a dashboard, hay token en página signin');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  console.log('[Middleware] Continuando con la solicitud normal');
  return NextResponse.next();
}

// Configurar las rutas en las que se ejecutará el middleware
export const config = {
  matcher: [
    // Rutas protegidas
    '/dashboard/:path*', 
    '/profile/:path*', 
    '/home/:path*',
    // Página de login (para redirigir si ya está autenticado)
    '/auth/signin',
  ],
}; 