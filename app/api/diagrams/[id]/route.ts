import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/libs/mongo';
import { ObjectId } from 'mongodb';

// Especificar explícitamente el runtime para evitar problemas con TurboPack
export const runtime = "nodejs";


export async function GET(
  request: NextRequest,
) {
  try {
    //obtener el id de la url pero el id es el penultimo de la url 
    const listUrl = request.nextUrl.pathname.split('/');
    const id = listUrl[listUrl.length - 2];
    // Verificar autenticación
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Validar `id`
    if (id) {
      return NextResponse.json({ error: "ID de diagrama no proporcionado" }, { status: 400 });
    }

    const diagramId = id;

    /* if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID de diagrama inválido" }, { status: 400 });
    } */

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


    //return NextResponse.json({ id });
  } catch (error) {
    console.error("Error al obtener diagrama:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}


/* export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = params;

    const diagramId = id; 

    if (!ObjectId.isValid(diagramId)) {
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
} */