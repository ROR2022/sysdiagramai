import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from '@/libs/mongo';
import { ObjectId } from 'mongodb';

// Especificar explícitamente el runtime para evitar problemas con TurboPack
export const runtime = "nodejs";

/**
 * GET /api/requirements/[id]
 * Obtiene un requisito específico por ID
 */


// Define the correct type for the params
interface DiagramParams {
  params: {
    id: string;
  }
}

export async function GET(
  request: Request,
  { params }: DiagramParams
) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    const { id } = params;
    // Obtener el ID del requisito de los parámetros de ruta
    const requirementId = id;
    
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
        { error: "Requisito no encontrado" },
        { status: 404 }
      );
    }
    
    // Retornar el requisito
    return NextResponse.json(requirement);
    
  } catch (error: unknown) {
    console.error("Error al obtener requisito:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al obtener el requisito", details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/requirements/[id]
 * Actualiza un requisito existente
 */
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    // Obtener el ID del requisito de los parámetros de ruta
    const requirementId = context.params.id;
    
    if (!requirementId) {
      return NextResponse.json(
        { error: "ID de requisito no proporcionado" },
        { status: 400 }
      );
    }
    
    // Obtener los datos del cuerpo de la solicitud
    const data = await request.json();
    
    // Conectar a la base de datos
    const client = await clientPromise;
    const db = client.db();
    
    // Verificar que el requisito exista y pertenezca al usuario
    const existingRequirement = await db.collection("requirements").findOne({
      _id: new ObjectId(requirementId),
      userId: session.user.id
    });
    
    if (!existingRequirement) {
      return NextResponse.json(
        { error: "Requisito no encontrado o no autorizado" },
        { status: 404 }
      );
    }
    
    // Preparar los datos a actualizar
    const updateData = {
      ...data,
      updated: new Date(),
      userId: session.user.id
    };
    
    // Actualizar el requisito
    const result = await db.collection("requirements").updateOne(
      { _id: new ObjectId(requirementId) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "No se pudo actualizar el requisito" },
        { status: 500 }
      );
    }
    
    // Obtener el requisito actualizado
    const updatedRequirement = await db.collection("requirements").findOne({
      _id: new ObjectId(requirementId)
    });
    
    // Retornar el requisito actualizado
    return NextResponse.json(updatedRequirement);
    
  } catch (error: unknown) {
    console.error("Error al actualizar requisito:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al actualizar el requisito", details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/requirements/[id]
 * Elimina un requisito existente
 */
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    // Obtener el ID del requisito de los parámetros de ruta
    const requirementId = context.params.id;
    
    if (!requirementId) {
      return NextResponse.json(
        { error: "ID de requisito no proporcionado" },
        { status: 400 }
      );
    }
    
    // Conectar a la base de datos
    const client = await clientPromise;
    const db = client.db();
    
    // Verificar que el requisito exista y pertenezca al usuario
    const existingRequirement = await db.collection("requirements").findOne({
      _id: new ObjectId(requirementId),
      userId: session.user.id
    });
    
    if (!existingRequirement) {
      return NextResponse.json(
        { error: "Requisito no encontrado o no autorizado" },
        { status: 404 }
      );
    }
    
    // Eliminar el requisito
    const result = await db.collection("requirements").deleteOne({
      _id: new ObjectId(requirementId),
      userId: session.user.id
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "No se pudo eliminar el requisito" },
        { status: 500 }
      );
    }
    
    // Retornar éxito
    return NextResponse.json({
      success: true,
      message: "Requisito eliminado correctamente"
    });
    
  } catch (error: unknown) {
    console.error("Error al eliminar requisito:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al eliminar el requisito", details: errorMessage },
      { status: 500 }
    );
  }
}
