import { NextResponse } from 'next/server';
import clientPromise from '@/libs/mongo';
import { auth } from '@/auth';

// Declaramos explícitamente que este código debe ejecutarse en el entorno Node.js
export const runtime = 'nodejs';

// En /api/auth/check-verification/route.ts
export async function GET() {
    try {
      // Obtenemos la sesión con la función auth() correcta
      const session = await auth();
      
      // Si no hay sesión, retornar no autorizado
      if (!session || !session.user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
      }
      
      // Verificar si el JWT tiene la información de emailVerified
      if (session.user.emailVerified) {
        return NextResponse.json({ 
          verified: true,
          user: session.user 
        });
      }
      
      // Si llegamos aquí, el usuario está autenticado pero el email no está verificado
      // Verificamos en la base de datos por si el JWT no está actualizado
      const client = await clientPromise;
      const db = client.db();
      
      const userFromDb = await db.collection('users').findOne({ 
        email: session.user.email 
      });
      
      if (userFromDb && userFromDb.emailVerified) {
        // El email está verificado en la base de datos pero no en el JWT
        return NextResponse.json({ 
          verified: true,
          user: {
            ...session.user,
            emailVerified: userFromDb.emailVerified
          },
          note: "JWT desactualizado, se recomienda actualizar la sesión" 
        });
      }
      
      // El email no está verificado ni en el JWT ni en la base de datos
      return NextResponse.json({ 
        verified: false,
        user: session.user 
      });
      
    } catch (error) {
      console.error("Error al verificar email:", error);
      return NextResponse.json({ error: "Error al verificar el estado del email" }, { status: 500 });
    }
}