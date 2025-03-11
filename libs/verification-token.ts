import { randomBytes } from 'crypto';
import clientPromise from './mongo';

/**
 * Interfaz para tokens de verificación, compatible con la estructura de Auth.js
 */
export interface VerificationToken {
  identifier: string;  // Email del usuario
  token: string;       // Token único
  expires: Date;       // Fecha de expiración
}

/**
 * Genera un token aleatorio seguro
 */
export function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Crea y almacena un token de verificación para un usuario
 * @param email Email del usuario para quien se genera el token
 * @param expiresInHours Horas hasta que expire el token (default: 24)
 * @returns El token generado
 */
export async function createVerificationToken(email: string, expiresInHours: number = 24): Promise<string> {
  try {
    console.log("[VerificationToken] Creando token para:", email);
    
    // Generar token aleatorio
    const token = generateToken();
    
    // Calcular fecha de expiración
    const expires = new Date();
    expires.setHours(expires.getHours() + expiresInHours);
    
    // Conectar a la base de datos
    const client = await clientPromise;
    const db = client.db();
    
    // Primero eliminamos cualquier token existente para este email
    await db.collection('verification_tokens').deleteMany({ identifier: email });
    
    // Crear nuevo token
    const verificationToken: VerificationToken = {
      identifier: email,
      token,
      expires,
    };
    
    // Guardar en la base de datos
    await db.collection('verification_tokens').insertOne(verificationToken);
    console.log("[VerificationToken] Token creado exitosamente para:", email);
    
    return token;
  } catch (error) {
    console.error("[VerificationToken] Error al crear token:", error);
    throw error;
  }
}

/**
 * Verifica si un token es válido y no ha expirado
 * @param token Token a verificar
 * @returns El email asociado al token si es válido, null en caso contrario
 */
export async function verifyToken(token: string): Promise<string | null> {
  try {
    console.log("[VerificationToken] Verificando token:", token);
    
    // Conectar a la base de datos
    const client = await clientPromise;
    const db = client.db();
    
    // Buscar el token
    const verificationToken = await db.collection('verification_tokens').findOne({
      token,
      expires: { $gt: new Date() } // Solo tokens no expirados
    });
    
    if (!verificationToken) {
      console.log("[VerificationToken] Token inválido o expirado");
      return null;
    }
    
    console.log("[VerificationToken] Token válido para:", verificationToken.identifier);
    return verificationToken.identifier;
  } catch (error) {
    console.error("[VerificationToken] Error al verificar token:", error);
    return null;
  }
}

/**
 * Marca un email como verificado en la base de datos
 * @param email Email a marcar como verificado
 * @returns true si se actualizó correctamente, false en caso contrario
 */
export async function markEmailAsVerified(email: string): Promise<boolean> {
  try {
    console.log("[VerificationToken] Marcando email como verificado:", email);
    
    // Conectar a la base de datos
    const client = await clientPromise;
    const db = client.db();
    
    // Actualizar el usuario
    const result = await db.collection('users').updateOne(
      { email },
      { 
        $set: { 
          emailVerified: new Date(),
          updatedAt: new Date()
        } 
      }
    );
    
    // Eliminar todos los tokens para este email
    await db.collection('verification_tokens').deleteMany({ identifier: email });
    
    if (result.matchedCount === 0) {
      console.log("[VerificationToken] No se encontró el usuario con email:", email);
      return false;
    }
    
    console.log("[VerificationToken] Email marcado como verificado:", email);
    return true;
  } catch (error) {
    console.error("[VerificationToken] Error al marcar email como verificado:", error);
    return false;
  }
} 