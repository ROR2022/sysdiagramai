import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import clientPromise from '@/libs/mongo';
import { ObjectId } from 'mongodb';
import { createVerificationToken } from '@/libs/verification-token';
import { sendVerificationEmail } from '@/libs/email';

// Declaramos explícitamente que este código debe ejecutarse en el entorno Node.js
export const runtime = 'nodejs';

// Este endpoint manejará el registro de nuevos usuarios
export async function POST(req: Request) {
  console.log("[SignUp] Iniciando procesamiento de solicitud de registro...");
  
  try {
    // Extraer datos del cuerpo de la solicitud
    const body = await req.json();
    console.log("[SignUp] Datos recibidos:", JSON.stringify(body));
    
    const { name, email, password } = body;
    
    // Validación básica
    if (!name || !email || !password) {
      console.log("[SignUp] ❌ Validación fallida: campos incompletos");
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }
    
    // Validar formato de email (validación simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("[SignUp] ❌ Validación fallida: formato de email inválido");
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }
    
    // Validar longitud mínima de la contraseña
    if (password.length < 8) {
      console.log("[SignUp] ❌ Validación fallida: contraseña demasiado corta");
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    try {
      // Obtener cliente de MongoDB 
      console.log("[SignUp] Conectando a MongoDB...");
      const client = await clientPromise;
      console.log("[SignUp] ✅ Conexión a MongoDB establecida");
      
      const db = client.db();
      console.log("[SignUp] Accediendo a la base de datos...");

      // Verificar si el usuario ya existe
      console.log("[SignUp] Verificando si el usuario ya existe...");
      const existingUser = await db.collection('users').findOne({ email });
      
      if (existingUser) {
        console.log("[SignUp] ❌ El email ya está registrado");
        return NextResponse.json(
          { error: 'El email ya está registrado' },
          { status: 400 }
        );
      }
      
      console.log("[SignUp] ✅ Email disponible para registro");

      // Encriptar la contraseña
      console.log("[SignUp] Encriptando contraseña...");
      const hashedPassword = await hash(password, 10);
      console.log("[SignUp] ✅ Contraseña encriptada correctamente");

      // Crear nuevo usuario con la estructura que espera NextAuth
      // Referencia: https://authjs.dev/reference/adapter/mongodb
      const now = new Date();
      const userId = new ObjectId();
      
      // Documento de usuario siguiendo la estructura de NextAuth
      const userDoc = {
        _id: userId,
        name,
        email,
        emailVerified: null, // El email aún no está verificado
        image: null,
        password: hashedPassword,  // Campo adicional, no utilizado por NextAuth pero útil para login personalizado
        createdAt: now,
        updatedAt: now
      };

      // Insertar el usuario en la colección users
      console.log("[SignUp] Insertando usuario en la colección users...");
      const result = await db.collection('users').insertOne(userDoc);
      
      if (!result.acknowledged) {
        throw new Error("Fallo al insertar el usuario en la base de datos");
      }
      
      console.log("[SignUp] ✅ Usuario insertado correctamente, ID:", userId.toString());

      // Generar token de verificación
      console.log("[SignUp] Generando token de verificación para el email...");
      const verificationToken = await createVerificationToken(email);
      console.log("[SignUp] ✅ Token de verificación generado");

      // Construir URL de verificación
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const verificationUrl = `${baseUrl}/api/auth/verify?token=${verificationToken}`;
      console.log("[SignUp] URL de verificación:", verificationUrl);

      // Enviar email de verificación
      try {
        console.log("[SignUp] Enviando email de verificación...");
        await sendVerificationEmail(email, name, verificationUrl);
        console.log("[SignUp] ✅ Email de verificación enviado correctamente");
      } catch (emailError) {
        // No queremos fallar el registro si el email falla, solo lo registramos
        console.error("[SignUp] ❌ Error al enviar email de verificación:", emailError);
        // Podríamos implementar una cola de reintentos o un sistema de notificación
      }
      
      // En modo desarrollo, incluimos la URL para facilitar pruebas
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          { 
            success: true, 
            message: 'Usuario registrado exitosamente. Por favor verifica tu email.',
            user: { id: userId.toString(), name, email },
            // Solo incluimos la URL en desarrollo para facilitar pruebas
            verificationUrl
          },
          { status: 201 }
        );
      }

      return NextResponse.json(
        { 
          success: true, 
          message: 'Usuario registrado exitosamente. Por favor verifica tu email.',
          user: { id: userId.toString(), name, email }
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("[SignUp] ❌ Error en la operación de base de datos:", dbError);
      return NextResponse.json(
        { error: 'Error al guardar el usuario. Por favor intenta nuevamente.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[SignUp] ❌ Error general en el procesamiento:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor. Por favor intenta más tarde.' },
      { status: 500 }
    );
  }
} 