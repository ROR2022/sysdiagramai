import { NextResponse } from 'next/server';
import clientPromise from '@/libs/mongo';
import { createVerificationToken } from '@/libs/verification-token';
import { sendVerificationEmail } from '@/libs/email';
import { auth } from '@/auth';

// Especificar explícitamente el runtime para evitar problemas con TurboPack
export const runtime = "nodejs";

// Endpoint para reenviar email de verificación
export async function POST() {
  try {
    // Obtener sesión del usuario usando auth()
    const session = await auth();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'No se encontró una sesión activa' },
        { status: 401 }
      );
    }
    
    // Obtener detalles del usuario desde MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Obtener usuario completo desde la base de datos
    const email = session.user.email;
    
    // Consultar por email en lugar de por ID para evitar problemas de tipo
    const user = await db.collection('users').findOne({
      email: email
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    const name = user.name || 'Usuario';
    
    console.log("[ResendVerification] Reenviando email de verificación a:", email);
    
    // Generar nuevo token de verificación
    const verificationToken = await createVerificationToken(email);
    
    // Construir URL de verificación
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/api/auth/verify?token=${verificationToken}`;
    
    // Enviar email
    await sendVerificationEmail(
      email,
      name,
      verificationUrl
    );
    
    console.log("[ResendVerification] ✅ Email de verificación reenviado correctamente");
    
    return NextResponse.json({
      success: true,
      message: 'Email de verificación reenviado correctamente'
    });
  } catch (error) {
    console.error("[ResendVerification] ❌ Error al reenviar email de verificación:", error);
    
    return NextResponse.json(
      { error: 'Error al reenviar el email de verificación' },
      { status: 500 }
    );
  }
} 