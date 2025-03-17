import { NextResponse } from 'next/server';
import { getSubscriptionPlans } from '@/app/api/utils/stripe';

// Configurar para que este endpoint se ejecute en el entorno de Node.js
export const runtime = 'nodejs';

// GET: Obtener los planes de suscripción disponibles
export async function GET() {
  try {
    // Obtener los planes de suscripción (ya vienen formateados)
    const plans = await getSubscriptionPlans();
    
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 