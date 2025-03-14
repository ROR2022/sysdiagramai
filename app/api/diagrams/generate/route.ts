import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/libs/mongo';
import { ObjectId } from 'mongodb';

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
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    // Obtener el ID del requisito del cuerpo de la solicitud
    const { requirementId } = await request.json();
    
    if (!requirementId) {
      return NextResponse.json(
        { error: "ID de requisito no proporcionado" },
        { status: 400 }
      );
    }
    
    // Conectar a la base de datos
    const client = await clientPromise;
    const db = client.db();
    
    // Buscar el requisito por ID
    const requirement = await db.collection("requirements").findOne({
      _id: new ObjectId(requirementId),
      userId: session.user.id
    });
    
    if (!requirement) {
      return NextResponse.json(
        { error: "Requisito no encontrado o no autorizado" },
        { status: 404 }
      );
    }
    
    // Actualizar el estado del requisito a "generating"
    await db.collection("requirements").updateOne(
      { _id: new ObjectId(requirementId) },
      { $set: { status: "generating", updated: new Date() } }
    );
    
    // Aquí iría la lógica para generar los diagramas
    // Por ahora, simplemente devolvemos una respuesta exitosa
    
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
