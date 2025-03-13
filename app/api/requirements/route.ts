import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { SystemRequirementService } from "@/libs/services/systemRequirementService";

export const runtime = 'nodejs';

/**
 * GET /api/requirements
 * Obtiene todos los requisitos del usuario actual
 */
export async function GET() {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const userId = session.user.id as string;
    const requirements = await SystemRequirementService.getAllByUser(userId);

    return NextResponse.json(requirements, { status: 200 });
  } catch (error) {
    console.error("Error al obtener requisitos:", error);
    return NextResponse.json(
      { error: "Error al obtener los requisitos" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/requirements
 * Crea un nuevo requisito del sistema
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const userId = session.user.id as string;
    const data = await request.json();

    const requirement = await SystemRequirementService.create(userId, data);

    return NextResponse.json(requirement, { status: 201 });
  } catch (error) {
    console.error("Error al crear requisito:", error);
    return NextResponse.json(
      { error: "Error al crear el requisito" },
      { status: 500 }
    );
  }
}
