import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/libs/mongoose';
import { SystemRequirement } from '@/libs/models/systemRequirement';
import { GenerationStatusService } from '@/libs/services/generationStatusService';

export const dynamic = 'force-dynamic';

// Especificar explícitamente el runtime para evitar problemas con TurboPack
export const runtime = "nodejs";

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
    
    // Iniciar el seguimiento de estado de generación
    const generationStatus = await GenerationStatusService.initGeneration(
      requirementId,
      session.user.id as string
    );
    
    console.log(`Iniciando generación de diagramas para requisito ${requirementId}`);
    
    // Obtener el origen de la solicitud para construir la URL del webhook
    const origin = request.headers.get('origin') || request.headers.get('host') || '';
    const protocol = origin.includes('localhost') ? 'http' : 'https';
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
        token: generationStatus.requestToken
      }),
    }).catch(error => {
      console.error('Error al disparar el webhook:', error);
      // Registrar el error en el estado de generación, pero no afectar la respuesta al cliente
      GenerationStatusService.addLog(
        requirementId,
        session.user.id as string,
        `Error al iniciar el webhook: ${error instanceof Error ? error.message : String(error)}`,
        'error'
      ).catch(e => console.error('Error al registrar log:', e));
    });
    
    return NextResponse.json({
      success: true,
      message: "Generación de diagramas iniciada correctamente",
      requirementId,
      statusId: generationStatus._id
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
