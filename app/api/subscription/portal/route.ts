import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { SubscriptionService } from '@/libs/services/subscriptionService';

// Configurar para que este endpoint se ejecute en el entorno de Node.js
export const runtime = 'nodejs';

// GET: Obtener la URL del portal de facturación
export async function GET() {
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
    
    try {
      // Crear una sesión del portal de facturación
      const portalUrl = await SubscriptionService.createBillingPortalSession(userId);
      
      return NextResponse.json({ url: portalUrl });
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      return NextResponse.json(
        { error: 'Failed to create billing portal session' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error accessing billing portal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 