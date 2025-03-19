import { NextResponse } from 'next/server';
import { DiagramService } from '@/libs/services/diagramService';
import { GenerationStatusService } from '@/libs/services/generationStatusService';
import connectDB from '@/libs/mongoose';

// Configurar para que este endpoint se ejecute en el entorno de Node.js
export const runtime = 'nodejs';

// Configuración para reintentos y timeout
const MAX_RETRIES = 3;
const TIMEOUT_MS = 60000; // 1 minuto en producción - ajustar según necesidad

// POST: Manejar la solicitud de generación de diagramas
export async function POST(request: Request) {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    const { requirementId, userId, token } = await request.json();

    // Validar parámetros requeridos
    if (!requirementId || !userId) {
      console.error('[Webhook] Faltan parámetros requeridos:', { requirementId, userId });
      return NextResponse.json({ 
        error: 'Faltan parámetros requeridos (requirementId o userId)' 
      }, { status: 400 });
    }

    // Validar el token usando el nuevo servicio
    const isValidToken = await GenerationStatusService.verifyToken(requirementId, userId, token);
    if (!token || !isValidToken) {
      console.error('[Webhook] Token inválido o no proporcionado');
      return NextResponse.json({ error: 'Token no válido o no proporcionado' }, { status: 401 });
    }

    // Actualizar estado a "in_progress"
    await GenerationStatusService.updateStatus(
      requirementId,
      userId,
      "in_progress",
      "Iniciando generación de diagramas"
    );

    console.log(`[Webhook] Iniciando generación de diagramas para el requisito: ${requirementId}`);

    // Crear un timeout para detectar operaciones que tardan demasiado
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('La generación de diagramas ha excedido el tiempo límite'));
      }, TIMEOUT_MS);
    });

    // Iniciar la generación de diagramas con timeout
    try {
      const generationPromise = DiagramService.generateDiagrams(requirementId, userId);
      // Usar Promise.race para implementar el timeout
      const updatedRequirement = await Promise.race([
        generationPromise,
        timeoutPromise
      ]) as ReturnType<typeof DiagramService.generateDiagrams>;

      if (!updatedRequirement) {
        throw new Error('No se pudo actualizar el requisito');
      }

      // Actualizar estado a "completed"
      await GenerationStatusService.updateStatus(
        requirementId,
        userId,
        "completed",
        "Diagramas generados correctamente"
      );

      console.log(`[Webhook] Generación completada exitosamente para: ${requirementId}`);

      return NextResponse.json({ 
        success: true, 
        message: 'Diagramas generados correctamente',
        requirementId
      });
    } catch (error: unknown) {
      // Verificar si es un error de timeout
      const isTimeout = error instanceof Error && 
                      error.message.includes('excedido el tiempo límite');
      
      // Obtener el estado actual para verificar la cantidad de reintentos
      const currentStatus = await GenerationStatusService.getStatus(requirementId, userId);
      const retryCount = currentStatus?.retryCount || 0;
      
      // Decidir si reintentamos o marcamos como fallido definitivamente
      if (isTimeout && retryCount < MAX_RETRIES) {
        console.log(`[Webhook] Timeout detectado, reintento ${retryCount + 1}/${MAX_RETRIES}`);
        
        // Actualizar estado para reintentar
        await GenerationStatusService.incrementRetry(requirementId, userId);
        
        // Reintentamos la generación con un nuevo webhook
        const baseUrl = request.headers.get('origin') || request.headers.get('host') || '';
        const protocol = baseUrl.includes('localhost') ? 'http' : 'https';
        const webhookUrl = baseUrl.startsWith('http') 
          ? `${baseUrl}/api/webhooks/diagrams/generate` 
          : `${protocol}://${baseUrl}/api/webhooks/diagrams/generate`;
        
        // Generar un nuevo token para el reintento
        const newStatus = await GenerationStatusService.initGeneration(requirementId, userId);
        const newToken = newStatus.requestToken;
        
        // Disparar el webhook de forma asíncrona después de un breve retraso
        setTimeout(() => {
          fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requirementId, userId, token: newToken })
          }).catch(e => console.error('[Webhook] Error al reintentar:', e));
        }, 5000); // Esperar 5 segundos antes de reintentar
        
        return NextResponse.json({ 
          success: true, 
          message: 'Reintentando generación de diagramas',
          requirementId,
          retry: retryCount + 1
        });
      } else {
        // Marcar como fallido definitivamente
        console.error('[Webhook] Error en generación de diagramas:', error);
        
        const errorMessage = isTimeout 
          ? 'La generación de diagramas tomó demasiado tiempo' 
          : (error instanceof Error ? error.message : String(error));
          
        await GenerationStatusService.setError(
          requirementId, 
          userId, 
          errorMessage
        );
        
        return NextResponse.json({ 
          error: 'Error al procesar la generación de diagramas', 
          details: error instanceof Error ? error.message : String(error),
          requirementId
        }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('[Webhook] Error general en webhook:', error);
    return NextResponse.json({ 
      error: 'Error al procesar la generación de diagramas', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 