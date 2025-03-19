import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia', // Usar la versión más reciente de la API
  typescript: true,
});

/**
 * Obtiene los planes de suscripción disponibles
 * @returns Lista de planes de suscripción
 */
export async function getSubscriptionPlans() {
  try {
    // Obtener los productos activos
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    const { data: productsData } = products;
    //console.log('1.- data products from stripe:..', productsData);
    

    // Filtrar y transformar los productos
    const plans = productsData
      .map(product => {
        const price = product.default_price as Stripe.Price;
        //console.log('marketing_features:..', product.marketing_features);
        
        return {
          id: price.id,
          name: String(product.name).toLowerCase(),
          description: product.description || '',
          price: price.unit_amount || 0,
          currency: price.currency,
          interval: price.recurring?.interval || 'month',
          intervalCount: price.recurring?.interval_count || 1,
          features: product.marketing_features?.map((feature) => feature.name) || [],
          highlighted: product.metadata.highlighted === 'true',
        };
      })
      .sort((a, b) => a.price - b.price); // Ordenar por precio

    //console.log(' 2.- data plans from stripe:..', plans);
    return plans;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return [];
  }
}

// Función para crear o recuperar un cliente de Stripe
/* async function getOrCreateCustomer(email: string, userId: string) {
  const existingCustomers = await stripe.customers.list({ email });
  
  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  return stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });
} */

// Función para crear una sesión de checkout
export async function createCheckoutSession({
  priceId,
  userId,
  email,
}: {
  priceId: string;
  userId: string;
  email: string;
}) {
  // Obtener o crear el cliente
  //const customer = await getOrCreateCustomer(email, userId);
  //validar si el email es valido
  if (!email) {
    console.log('email-user:..', email);
    throw new Error('Email is required');
  }
  //crear un regex para validar el email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('email-user:..', email);
    throw new Error('Invalid email');
  }

  //si llegamos a este punto, el email es valido
  console.log('email-user:..', email);
  
  
  /*
  

    stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: customer.id,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 7,
      metadata: {
        userId,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
    metadata: {
      userId,
    },
  });
  */

  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?canceled=true`,
    metadata: {
      userId,
    },
  });
}

// Función para cancelar una suscripción
export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId);
}

// funcion para cancelar una suscripcion al finalizar el periodo
export async function cancelSubscriptionAtPeriodEnd(subscriptionId: string) {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

// Función para obtener una suscripción
export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId);
}

// Función para obtener el portal de facturación
export async function createBillingPortalSession(customerId: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
  });
} 

// crear un cliente en Stripe directamente debe de ser envuelto en un try catch
export async function createCustomerByUserId(userId: string) {
  try {
    return await stripe.customers.create({ metadata: { userId } });
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
}

export async function createCustomerByUserIdAndEmail(userId: string, email: string) {
  try {
    return await stripe.customers.create({ metadata: { userId }, email });
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
}

// funcion para recuperar una suscripcion por el id de la suscripcion
export async function getStripeSubscriptionById(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId) as unknown as Stripe.Subscription;
}

