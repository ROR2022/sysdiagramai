import { ISubscription } from "../models/subscription";
import Stripe from "stripe";
//import clientPromise from "../mongo";
import {
  createSubscription,
  getSubscriptionByUserId,
  updateSubscriptionByUserId,
  getSubscriptionByStripeCustomerId,
} from "@/app/api/utils/subscription";
import { getUserById } from "@/app/api/utils/users";
import {
  createCustomerByUserId,
  createCustomerByUserIdAndEmail,
  createCheckoutSession,
  createBillingPortalSession,
  cancelSubscriptionAtPeriodEnd,
  getStripeSubscriptionById,
} from "@/app/api/utils/stripe";

// Servicio para manejar las operaciones con las suscripciones
export const SubscriptionService = {
  /**
   * Obtiene la suscripción de un usuario
   * @param userId ID del usuario
   * @returns La suscripción si existe
   */
  async getByUserId(userId: string): Promise<ISubscription | null> {
    const subscription = await getSubscriptionByUserId(userId);
    return subscription as ISubscription | null;
  },

  /**
   * Crea una suscripción gratuita para un usuario
   * @param userId ID del usuario
   * @param stripeCustomerId ID del cliente en Stripe (opcional)
   * @returns La suscripción creada
   */
  async createFreeSubscription(
    userId: string,
    stripeCustomerId?: string
  ): Promise<ISubscription> {
    // Si no se proporciona un ID de cliente, crear uno nuevo en Stripe
    if (!stripeCustomerId || stripeCustomerId.startsWith("temp_")) {
      try {
        // Intentar crear un cliente en Stripe directamente
        // esta funcion es exportada desde el archivo stripe.ts
        const customer = await createCustomerByUserId(userId);

        stripeCustomerId = customer.id;
        console.log(
          `Created Stripe customer for user ${userId}: ${stripeCustomerId}`
        );
      } catch (error) {
        console.error("Error creating Stripe customer:", error);
        // Si falla, usar un ID temporal
        stripeCustomerId = `temp_${userId}`;
      }
    }

    const subscription: ISubscription = {
      userId,
      stripeCustomerId,
      plan: "free",
      status: "active",
      diagramsUsed: 0,
      diagramsLimit: 3,
    };

    // Convertir a formato compatible con MongoDB
    const subscriptionDoc = {
      ...subscription,
      created: new Date(),
      updated: new Date(),
    };

    return await createSubscription(subscriptionDoc as ISubscription);
  },

  /**
   * Actualiza una suscripción existente
   * @param userId ID del usuario
   * @param data Datos a actualizar
   * @returns La suscripción actualizada
   */
  async updateSubscription(
    userId: string,
    data: Partial<ISubscription>
  ): Promise<ISubscription | null> {
    const dataToUpdate = { ...data, updated: new Date() } as ISubscription;

    const result = await updateSubscriptionByUserId(userId, dataToUpdate);

    return result as unknown as ISubscription | null;
  },

  /**
   * Incrementa el contador de diagramas usados
   * @param userId ID del usuario
   * @returns La suscripción actualizada
   */
  async incrementDiagramsUsed(userId: string): Promise<ISubscription | null> {
    /* const result = await db.collection("subscriptions").findOneAndUpdate(
      { userId },
      { $inc: { diagramsUsed: 1 }, $set: { updated: new Date() } },
      { returnDocument: "after" }
    ); */

    const subscription = (await getSubscriptionByUserId(
      userId
    )) as ISubscription;
    if (!subscription) return null;

    const updatedSubscription = {
      ...subscription,
      diagramsUsed: subscription.diagramsUsed + 1,
      updated: new Date(),
    } as unknown as ISubscription;

    return await updateSubscriptionByUserId(userId, updatedSubscription);
  },

  /**
   * Verifica si un usuario puede crear más diagramas
   * @param userId ID del usuario
   * @returns true si puede crear más diagramas, false si no
   */
  async canCreateDiagram(userId: string): Promise<boolean> {
    const subscription = await this.getByUserId(userId);

    if (!subscription) return false;

    return subscription.diagramsUsed < subscription.diagramsLimit;
  },

  /**
   * Crea una sesión de checkout para suscribirse a un plan
   * @param userId ID del usuario
   * @param priceId ID del precio en Stripe
   * @returns URL de la sesión de checkout
   */
  async createCheckoutSession(
    userId: string,
    priceId: string
  ): Promise<string> {
    const subscription = await this.getByUserId(userId);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    let customerId = subscription.stripeCustomerId;
    let user = null;

    // Verificar si el ID de cliente es válido (no debe ser un email o ID temporal)
    if (
      !customerId ||
      customerId.includes("@") ||
      customerId.startsWith("temp_")
    ) {
      try {
        // Obtener el usuario para conseguir su email
        user = await getUserById(userId);

        if (!user || !user.email) {
          throw new Error("User email not found");
        }

        // Crear un nuevo cliente en Stripe
        const customer = await createCustomerByUserIdAndEmail(
          userId,
          user.email
        );

        customerId = customer.id;

        // Actualizar la suscripción con el nuevo ID de cliente
        await this.updateSubscription(userId, {
          stripeCustomerId: customerId,
        });

        console.log(
          `Created new Stripe customer for user ${userId}: ${customerId}`
        );
      } catch (error) {
        console.error("Error creating Stripe customer:", error);
        throw new Error("Failed to create Stripe customer");
      }
    }

    // Crear la sesión de checkout con el ID de cliente válido
    // esta funcion es exportada desde el archivo stripe.ts
    //crear un punto de revision para el email
    //crear un regex para validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user?.email || !emailRegex.test(user?.email)) {
      console.log("subscriptionService: not found or not valid email-user:..", user?.email);
      //throw new Error("User email not found or not valid");
      //recuperar el email del usuario
      console.log("subscriptionService: recuperando email del usuario:..", userId);
       user = await getUserById(userId);
      if (!user?.email) {
        console.log("subscriptionService: no se encontro email del usuario:..", userId);
        throw new Error("User email not found");
      }
    }

    

    //si llegamos a este punto, el email es valido
    console.log("subscriptionService: valid email-user:..", user?.email);

    const session = await createCheckoutSession({
      priceId,
      userId,
      email: user?.email || "",
    });
    /* const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?canceled=true`,
      metadata: {
        userId,
      },
    }); */

    return session.url as string;
  },

  /**
   * Crea una sesión del portal de facturación
   * @param userId ID del usuario
   * @returns URL de la sesión del portal
   */
  async createBillingPortalSession(userId: string): Promise<string> {
    const subscription = await this.getByUserId(userId);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const session = await createBillingPortalSession(
      subscription.stripeCustomerId
    );

    return session.url;
  },

  /**
   * Cancela la suscripción de un usuario
   * @param userId ID del usuario
   * @returns true si se canceló correctamente, false si no
   */
  async cancelSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getByUserId(userId);

    if (!subscription || !subscription.stripeSubscriptionId) {
      return false;
    }

    try {
      await cancelSubscriptionAtPeriodEnd(subscription.stripeSubscriptionId);

      await this.updateSubscription(userId, {
        status: "canceled",
      });

      return true;
    } catch (error) {
      console.error("Error canceling subscription:", error);
      return false;
    }
  },

  /**
   * Actualiza la suscripción desde un evento de Stripe
   * @param event Evento de Stripe
   * @returns La suscripción actualizada
   */
  async handleStripeEvent(event: Stripe.Event): Promise<ISubscription | null> {
    let subscription: ISubscription | null = null;
    let userId: string | undefined;

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        userId = session.metadata?.userId;

        if (!userId) {
          console.error("No userId found in session metadata");
          return null;
        }

        const stripeSubscription = await getStripeSubscriptionById(
          session.subscription as string
        );

        const plan = this.getPlanFromProductId(
          stripeSubscription.items.data[0].price.product as string
        );
        const limit = this.getLimitFromPlan(plan);

        subscription = await this.updateSubscription(userId, {
          stripeSubscriptionId: stripeSubscription.id,
          plan,
          status: stripeSubscription.status as
            | "active"
            | "trialing"
            | "canceled"
            | "past_due"
            | "incomplete",
          currentPeriodEnd: new Date(
            stripeSubscription.current_period_end * 1000
          ),
          diagramsLimit: limit,
        });

        break;
      }

      case "customer.subscription.updated": {
        const stripeSubscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId = stripeSubscription.customer as string;

        const existingSubscription = await getSubscriptionByStripeCustomerId(
          stripeCustomerId
        );

        if (!existingSubscription) {
          console.error(
            "No subscription found for customer:",
            stripeCustomerId
          );
          return null;
        }

        userId = existingSubscription.userId;

        const plan = this.getPlanFromProductId(
          stripeSubscription.items.data[0].price.product as string
        );
        const limit = this.getLimitFromPlan(plan);

        subscription = await this.updateSubscription(userId as string, {
          plan,
          status: stripeSubscription.status as
            | "active"
            | "trialing"
            | "canceled"
            | "past_due"
            | "incomplete",
          currentPeriodEnd: new Date(
            stripeSubscription.current_period_end * 1000
          ),
          diagramsLimit: limit,
        });

        break;
      }

      case "customer.subscription.deleted": {
        const stripeSubscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId = stripeSubscription.customer as string;

        const existingSubscription = await getSubscriptionByStripeCustomerId(
          stripeCustomerId
        );

        if (!existingSubscription) {
          console.error(
            "No subscription found for customer:",
            stripeCustomerId
          );
          return null;
        }

        userId = existingSubscription.userId;

        subscription = await this.updateSubscription(userId as string, {
          plan: "free",
          status: "canceled",
          stripeSubscriptionId: undefined,
          diagramsLimit: 5,
        });

        break;
      }
    }

    return subscription;
  },

  /**
   * Obtiene el plan a partir del ID del producto en Stripe
   * @param productId ID del producto en Stripe
   * @returns El plan correspondiente
   */
  getPlanFromProductId(productId: string): "free" | "pro" | "team" {
    const productMap: Record<string, "free" | "pro" | "team"> = {
      [process.env.STRIPE_PRODUCT_FREE as string]: "free",
      [process.env.STRIPE_PRODUCT_PRO as string]: "pro",
      [process.env.STRIPE_PRODUCT_TEAM as string]: "team",
    };

    return productMap[productId] || "free";
  },

  /**
   * Obtiene el límite de diagramas a partir del plan
   * @param plan Plan de suscripción
   * @returns El límite de diagramas
   */
  getLimitFromPlan(plan: "free" | "pro" | "team"): number {
    const limitMap: Record<string, number> = {
      free: 3,
      pro: 50,
      team: 1000, // Prácticamente ilimitado
    };

    return limitMap[plan];
  },
};
