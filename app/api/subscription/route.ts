import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { SubscriptionService } from '@/libs/services/subscriptionService';

// Configurar para que este endpoint se ejecute en el entorno de Node.js
export const runtime = 'nodejs';

/**
 * GET /api/subscription
 * Obtiene la suscripción del usuario actual
 */
export async function GET() {
  // Verificar autenticación
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }
  
  try {
    // Obtener la suscripción del usuario
    let subscription = await SubscriptionService.getByUserId(session.user.id);
    
    // Si no existe, crear una suscripción gratuita
    if (!subscription) {
      // Crear un ID de cliente temporal basado en el ID del usuario
      const stripeCustomerId = `temp_${session.user.id}`;
      
      subscription = await SubscriptionService.createFreeSubscription(
        session.user.id,
        stripeCustomerId
      );
    }
    
    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error al obtener la suscripción:', error);
    return NextResponse.json(
      { error: 'Error al obtener la suscripción' },
      { status: 500 }
    );
  }
}

// POST: Crear una sesión de checkout para suscribirse
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Verificar que el usuario esté autenticado
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Obtener el priceId del cuerpo de la solicitud
    const body = await request.json();
    const { priceId } = body;
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }
    
    // Crear una sesión de checkout
    const checkoutUrl = await SubscriptionService.createCheckoutSession(
      userId,
      priceId
    );
    
    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Cancelar la suscripción del usuario
export async function DELETE() {
  try {
    const session = await auth();
    
    // Verificar que el usuario esté autenticado
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Cancelar la suscripción
    const success = await SubscriptionService.cancelSubscription(userId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 