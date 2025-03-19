import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/libs/mongoose';
import { SystemRequirement } from '@/libs/models/systemRequirement';

export const dynamic = 'force-dynamic';

// Especificar explícitamente el runtime para evitar problemas con TurboPack
export const runtime = "nodejs";

// Función para generar un token simple
function generateToken(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * POST /api/diagrams/generate
 * Inicia el proceso de generación de diagramas para un requisito específico
 */
export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session || !session.user) {
      console.log("No autorizado, no session.user");
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    // Obtener el ID del requisito del cuerpo de la solicitud
    const { requirementId } = await request.json();
    
    if (!requirementId) {
      console.log("No se proporcionó ID de requisito");
      return NextResponse.json(
        { error: "ID de requisito no proporcionado" },
        { status: 400 }
      );
    }
    
    // Conectar a la base de datos
    await connectDB();
    // Buscar el requisito por ID
    const requirement = await SystemRequirement.findOne({
      _id: requirementId,
      userId: session.user.id
    });
    
    if (!requirement) {
      console.log("Requisito no encontrado o no autorizado");
      return NextResponse.json(
        { error: "Requisito no encontrado o no autorizado" },
        { status: 404 }
      );
    }
    
    // Actualizar el estado del requisito a "generating"
    await SystemRequirement.updateOne(
      { _id: requirementId },
      { $set: { status: "generating", updated: new Date() } }
    );
    
    // Generar un token para la solicitud al webhook
    const token = generateToken();
    
    // Obtener el origen de la solicitud para construir la URL del webhook
    const origin = request.headers.get('origin') || request.headers.get('host') || '';
    const protocol = origin.startsWith('localhost') ? 'http' : 'https';
    const baseUrl = origin.startsWith('http') ? origin : `${protocol}://${origin}`;
    
    // Disparar el webhook de forma asíncrona
    fetch(`${baseUrl}/api/webhooks/diagrams/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requirementId,
        userId: session.user.id,
        token
      }),
    }).catch(error => {
      console.error('Error al disparar el webhook:', error);
    });
    
    return NextResponse.json({
      success: true,
      message: "Generación de diagramas iniciada correctamente",
      requirementId
    });
    
  } catch (error: unknown) {
    console.error("Error al generar diagramas:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al generar diagramas", details: errorMessage },
      { status: 500 }
    );
  }
}
