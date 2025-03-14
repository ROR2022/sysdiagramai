import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';



/**
 * GET /api/uploads/[...path]
 * Sirve archivos estáticos desde la carpeta uploads
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación (opcional, depende de tus requisitos de seguridad)
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Extraer el path antes de usarlo de la url  
    const pathSegments = request.nextUrl.pathname.split('/').slice(2);

    // Construir la ruta del archivo
    const filePath = path.join(process.cwd(), 'uploads', ...pathSegments);

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }

    // Leer el archivo
    const fileBuffer = fs.readFileSync(filePath);
    
    // Determinar el tipo MIME basado en la extensión
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream'; // por defecto
    
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.json') contentType = 'application/json';
    else if (ext === '.md') contentType = 'text/markdown';
    
    // Devolver el archivo con el tipo de contenido adecuado
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // cache for 1 day
      },
    });
    
  } catch (error) {
    console.error('Error al servir el archivo:', error);
    return NextResponse.json(
      { error: 'Error al servir el archivo' },
      { status: 500 }
    );
  }
}
