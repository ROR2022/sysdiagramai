import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/libs/mongo';
import { ObjectId } from 'mongodb';

// Especificar explícitamente el runtime para evitar problemas con TurboPack
export const runtime = "nodejs";

// GET: Obtener un diagrama específico por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Validar `params`
    if (!params?.id) {
      console.error("ID de diagrama no proporcionado");
      return NextResponse.json({ error: "ID de diagrama no proporcionado" }, { status: 400 });
    }

    const diagramId = params.id;

    if (!ObjectId.isValid(diagramId)) {
      console.error("ID de diagrama inválido:", diagramId);
      return NextResponse.json({ error: "ID de diagrama inválido" }, { status: 400 });
    }

    // Conectar a la base de datos
    const client = await clientPromise;
    const db = client.db();

    // Buscar el diagrama por ID
    const diagram = await db.collection("diagrams").findOne({
      _id: new ObjectId(diagramId),
    });

    if (!diagram) {
      return NextResponse.json({ error: "Diagrama no encontrado" }, { status: 404 });
    }

    // Verificar acceso del usuario
    if (diagram.userId?.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "No tienes permiso para acceder a este diagrama" },
        { status: 403 }
      );
    }

    // Retornar el diagrama
    return NextResponse.json(diagram);
    
  } catch (error: unknown) {
    console.error("Error al obtener diagrama:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
