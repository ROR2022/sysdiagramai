import { NextResponse } from "next/server";
import Stripe from "stripe";
import { SubscriptionService } from "@/libs/services/subscriptionService";

// Inicializar Stripe sin especificar la versión de la API
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * Verifica la firma del webhook de Stripe
 * @param request Solicitud recibida
 * @returns Evento de Stripe verificado o null si la verificación falla
 */
async function verifyStripeSignature(
  request: Request
): Promise<Stripe.Event | null> {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature") as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Stripe Webhook] Missing STRIPE_WEBHOOK_SECRET");
      return null;
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    return event;
  } catch (error) {
    console.error("[Stripe Webhook] Error verifying signature:", error);
    return null;
  }
}

/**
 * Manejador de webhooks de Stripe
 * @param request Solicitud recibida
 * @returns Respuesta HTTP
 */
export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    console.log("[Stripe Webhook] Received webhook request");
    
    // Verificar la firma del webhook
    const event = await verifyStripeSignature(request);
    if (!event) {
      console.error('[Stripe Webhook] Invalid signature or webhook verification failed');
      return new NextResponse(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 400 }
      );
    }

    console.log(`[Stripe Webhook] Event received: ${event.type}`);
    console.log(`[Stripe Webhook] Event ID: ${event.id}`);
    
    // Registrar detalles adicionales según el tipo de evento
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[Stripe Webhook] Checkout completed for session: ${session.id}`);
        console.log(`[Stripe Webhook] Customer: ${session.customer}`);
        console.log(`[Stripe Webhook] Metadata:`, session.metadata);
        break;
      }
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[Stripe Webhook] Subscription created: ${subscription.id}`);
        console.log(`[Stripe Webhook] Customer: ${subscription.customer}`);
        console.log(`[Stripe Webhook] Status: ${subscription.status}`);
        console.log(`[Stripe Webhook] Metadata:`, subscription.metadata);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[Stripe Webhook] Subscription updated: ${subscription.id}`);
        console.log(`[Stripe Webhook] Customer: ${subscription.customer}`);
        console.log(`[Stripe Webhook] Status: ${subscription.status}`);
        console.log(`[Stripe Webhook] Current period end: ${new Date(subscription.current_period_end * 1000).toISOString()}`);
        console.log(`[Stripe Webhook] Metadata:`, subscription.metadata);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[Stripe Webhook] Subscription deleted: ${subscription.id}`);
        console.log(`[Stripe Webhook] Customer: ${subscription.customer}`);
        console.log(`[Stripe Webhook] Metadata:`, subscription.metadata);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Stripe Webhook] Invoice payment succeeded: ${invoice.id}`);
        console.log(`[Stripe Webhook] Customer: ${invoice.customer}`);
        console.log(`[Stripe Webhook] Subscription: ${invoice.subscription}`);
        console.log(`[Stripe Webhook] Amount paid: ${invoice.amount_paid}`);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Stripe Webhook] Invoice payment failed: ${invoice.id}`);
        console.log(`[Stripe Webhook] Customer: ${invoice.customer}`);
        console.log(`[Stripe Webhook] Subscription: ${invoice.subscription}`);
        console.log(`[Stripe Webhook] Attempt count: ${invoice.attempt_count}`);
        break;
      }
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    // Procesar el evento con el servicio de suscripción
    try {
      console.log('[Stripe Webhook] Processing event with subscription service');
      const updatedSubscription = await SubscriptionService.handleStripeEvent(event);
      
      if (updatedSubscription) {
        console.log(`[Stripe Webhook] Subscription updated successfully for user: ${updatedSubscription.userId}`);
        console.log(`[Stripe Webhook] New plan: ${updatedSubscription.plan}, Status: ${updatedSubscription.status}`);
      } else {
        console.warn('[Stripe Webhook] No subscription was updated');
      }
      
      const processingTime = Date.now() - startTime;
      console.log(`[Stripe Webhook] Event ${event.id} processed successfully in ${processingTime}ms`);
      
      return new NextResponse(JSON.stringify({ 
        received: true,
        processingTime: `${processingTime}ms`
      }), {
        status: 200,
      });
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`[Stripe Webhook] Error processing event ${event.id} after ${processingTime}ms:`, error);
      
      // Devolver 200 para que Stripe no reintente el webhook
      // pero registrar el error para su investigación
      return new NextResponse(
        JSON.stringify({ 
          received: true,
          processingTime: `${processingTime}ms`,
          error: error instanceof Error ? error.message : 'Unknown error processing event'
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`[Stripe Webhook] Unhandled error after ${processingTime}ms:`, error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal server error",
        processingTime: `${processingTime}ms`
      }),
      { status: 500 }
    );
  }
}