import { NextResponse } from 'next/server';
import { stripe } from '@/app/api/utils/stripe';
import { SubscriptionService } from '@/libs/services/subscriptionService';
import Stripe from 'stripe';

// Configurar para que este endpoint se ejecute en el entorno de Node.js
export const runtime = 'nodejs';

// Función para verificar la firma del webhook
const verifyStripeSignature = async (request: Request): Promise<Stripe.Event | null> => {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') as string;
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }
    
    return stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return null;
  }
};

export async function POST(request: Request) {
  try {
    // Verificar la firma del webhook
    const event = await verifyStripeSignature(request);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }
    
    // Procesar el evento con el servicio de suscripción
    await SubscriptionService.handleStripeEvent(event);
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 