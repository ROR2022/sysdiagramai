import { ISubscription } from "../models/subscription";
import Stripe from "stripe";
//import clientPromise from "../mongo";
import {
  createSubscription,
  getSubscriptionByUserId,
  updateSubscriptionByUserId,
  getSubscriptionByStripeCustomerId,
} from "@/app/api/utils/subscription";
import { getUserByEmail, getUserById } from "@/app/api/utils/users";
import {
  createCustomerByUserId,
  createCustomerByUserIdAndEmail,
  createCheckoutSession,
  createBillingPortalSession,
  cancelSubscriptionAtPeriodEnd,
  getStripeSubscriptionById,
  getStripeSubscriptionByEmail,
  getStripeSubscriptionByIdUser,
} from "@/app/api/utils/stripe";

// Importar el objeto stripe para la nueva estrategia de búsqueda
import { stripe } from "@/app/api/utils/stripe";

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
      console.log(
        "subscriptionService: not found or not valid email-user:..",
        user?.email
      );
      //throw new Error("User email not found or not valid");
      //recuperar el email del usuario
      console.log(
        "subscriptionService: recuperando email del usuario:..",
        userId
      );
      user = await getUserById(userId);
      if (!user?.email) {
        console.log(
          "subscriptionService: no se encontro email del usuario:..",
          userId
        );
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
    //let userId: string | undefined;

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("subscriptionService: session", session);

        // Extraer información del usuario y su email
        let userId = session.metadata?.userId || session.client_reference_id;
        const userEmail = session.customer_details?.email || session.customer_email;
        const stripeCustomerId = session.customer as string;
        
        // Validar que tenemos información para identificar al usuario
        if (!userId && !userEmail && !stripeCustomerId) {
          console.error("No se puede identificar al usuario en la sesión de checkout");
          return null;
        }
        
        // Si no tenemos userId pero tenemos email, intentar encontrar el usuario
        if (!userId && userEmail) {
          try {
            const user = await getUserByEmail(userEmail);
            if (user) {
              userId = user._id.toString();
              console.log(`Usuario encontrado por email: ${userEmail}, userId: ${userId}`);
            }
          } catch (error) {
            console.error(`Error buscando usuario por email ${userEmail}:`, error);
          }
        }
        
        // Si todavía no tenemos userId pero tenemos customerId, buscar por este
        if (!userId && stripeCustomerId) {
          try {
            const existingSubscription = await getSubscriptionByStripeCustomerId(stripeCustomerId);
            if (existingSubscription) {
              userId = existingSubscription.userId;
              console.log(`Usuario encontrado por stripeCustomerId: ${stripeCustomerId}, userId: ${userId}`);
            }
          } catch (error) {
            console.error(`Error buscando suscripción por stripeCustomerId ${stripeCustomerId}:`, error);
          }
        }
        
        // Verificar si finalmente tenemos un userId
        if (!userId) {
          console.error("No userId found in session metadata or through alternative methods");
          return null;
        }

        // Estrategia para obtener la suscripción de Stripe
        let stripeSubscription: Stripe.Subscription | null = null;
        
        // 1. Intentar obtener la suscripción con el id de la suscripción de la sesión
        if (session.subscription) {
          try {
            stripeSubscription = await getStripeSubscriptionById(session.subscription as string);
            console.log("Suscripción de Stripe encontrada por ID:", session.subscription);
          } catch (error) {
            console.log("Error obteniendo suscripción por ID:", error);
          }
        }
        
        // 2. Si no se encuentra, intentar con el email del usuario
        if (!stripeSubscription && userEmail) {
          try {
            stripeSubscription = await getStripeSubscriptionByEmail(userEmail);
            console.log("Suscripción de Stripe encontrada por email:", userEmail);
          } catch (error) {
            console.log("Error obteniendo suscripción por email:", error);
          }
        }
        
        // 3. Si todavía no se encuentra, intentar con el ID del usuario
        if (!stripeSubscription) {
          try {
            stripeSubscription = await getStripeSubscriptionByIdUser(userId);
            console.log("Suscripción de Stripe encontrada por userId:", userId);
          } catch (error) {
            console.log("Error obteniendo suscripción por userId:", error);
          }
        }
        
        // Verificar si finalmente tenemos una suscripción de Stripe
        if (!stripeSubscription) {
          console.error("No se pudo encontrar la suscripción de Stripe");
          return null;
        }

        // Procesar la información de la suscripción
        const plan = this.getPlanFromProductId(
          stripeSubscription.items.data[0].price.product as string
        );
        const limit = this.getLimitFromPlan(plan);

        // Actualizar la suscripción en nuestra base de datos
        subscription = await this.updateSubscription(userId, {
          stripeCustomerId,
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
        let subscriptionUserId = stripeSubscription.metadata?.userId;

        // Estrategia de búsqueda escalonada
        let existingSubscription = null;

        // 1. Intentar encontrar por stripeCustomerId (método original)
        try {
          existingSubscription = await getSubscriptionByStripeCustomerId(
            stripeCustomerId
          );
        } catch (error) {
          console.log(
            "Error buscando suscripción por stripeCustomerId:",
            error
          );
        }

        // 2. Si no se encuentra y tenemos userId en los metadatos, buscar por userId
        if (!existingSubscription && subscriptionUserId) {
          try {
            existingSubscription = await getSubscriptionByUserId(
              subscriptionUserId
            );
            console.log("Suscripción encontrada por userId de metadatos");
          } catch (error) {
            console.log("Error buscando suscripción por userId:", error);
          }
        }

        // 3. Si aún no se encuentra, intentar obtener el cliente de Stripe para conseguir más información
        if (!existingSubscription) {
          try {
            // Obtener el cliente de Stripe para obtener más información
            const customer = await stripe.customers.retrieve(stripeCustomerId);

            if ("email" in customer && customer.email) {
              // Para este caso, como no tenemos función getUserByEmail, obtenemos todos los usuarios
              // y filtramos por email manualmente, o usamos alguna otra consulta que ya exista
              // Esta parte requiere ajustes según tu base de datos
              console.log("Buscando usuario por email:", customer.email);

              // Alternativa: usar directamente el ID del cliente de Stripe para buscar la suscripción
              // esto asume que el campo stripeCustomerId existe en tu esquema de suscripción
              try {
                // Intentar una última búsqueda por customerId en la colección
                // Esta implementación depende de tu estructura de datos
                // aqui primero obtenemos el usuario en base al customer.email
                const user = await getUserByEmail(customer.email as string);
                console.log(
                  "Buscando suscripción alternativa para cliente:",
                  stripeCustomerId
                );
                if (user) {
                  subscriptionUserId = user._id.toString();
                  //ahora obtenemos la suscripcion en base al userId
                  existingSubscription = await getSubscriptionByUserId(
                    subscriptionUserId as string
                  );
                }
              } catch (findError) {
                console.log("Error en búsqueda alternativa:", findError);
              }
            }
          } catch (error) {
            console.log(
              "Error al intentar métodos alternativos de búsqueda:",
              error
            );
          }
        }

        if (!existingSubscription) {
          console.error(
            "No subscription found for customer:",
            stripeCustomerId
          );
          return null;
        }

        // Si no tenemos userId de los metadatos, usamos el de la suscripción existente
        if (!subscriptionUserId && existingSubscription.userId) {
          subscriptionUserId = existingSubscription.userId;
        }

        // Si después de todo no tenemos un userId, no podemos continuar
        if (!subscriptionUserId) {
          console.error("No userId found for subscription update");
          return null;
        }

        const plan = this.getPlanFromProductId(
          stripeSubscription.items.data[0].price.product as string
        );
        const limit = this.getLimitFromPlan(plan);

        subscription = await this.updateSubscription(
          subscriptionUserId as string,
          {
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
          }
        );

        break;
      }

      case "customer.subscription.deleted": {
        const stripeSubscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId = stripeSubscription.customer as string;
        let subscriptionUserId = stripeSubscription.metadata?.userId;

        // Estrategia de búsqueda escalonada
        let existingSubscription = null;
        
        // 1. Intentar encontrar por stripeCustomerId (método original)
        try {
          existingSubscription = await getSubscriptionByStripeCustomerId(stripeCustomerId);
        } catch (error) {
          console.log("Error buscando suscripción por stripeCustomerId:", error);
        }
        
        // 2. Si no se encuentra y tenemos userId en los metadatos, buscar por userId
        if (!existingSubscription && subscriptionUserId) {
          try {
            existingSubscription = await getSubscriptionByUserId(subscriptionUserId);
            console.log("Suscripción encontrada por userId de metadatos");
          } catch (error) {
            console.log("Error buscando suscripción por userId:", error);
          }
        }
        
        // 3. Si aún no se encuentra, intentar obtener el cliente de Stripe para conseguir más información
        if (!existingSubscription) {
          try {
            // Obtener el cliente de Stripe para obtener más información
            const customer = await stripe.customers.retrieve(stripeCustomerId);
            
            if ('email' in customer && customer.email) {
              try {
                // Buscar usuario por email y luego su suscripción
                const user = await getUserByEmail(customer.email as string);
                if (user) {
                  subscriptionUserId = user._id.toString();
                  existingSubscription = await getSubscriptionByUserId(subscriptionUserId);
                  console.log("Suscripción encontrada por email del cliente Stripe");
                }
              } catch (findError) {
                console.log("Error en búsqueda alternativa:", findError);
              }
            }
          } catch (error) {
            console.log("Error al intentar métodos alternativos de búsqueda:", error);
          }
        }

        if (!existingSubscription) {
          console.error("No subscription found for customer:", stripeCustomerId);
          return null;
        }

        // Si no tenemos userId de los metadatos, usamos el de la suscripción existente
        if (!subscriptionUserId && existingSubscription.userId) {
          subscriptionUserId = existingSubscription.userId;
        }

        // Si después de todo no tenemos un userId, no podemos continuar
        if (!subscriptionUserId) {
          console.error("No userId found for subscription deletion");
          return null;
        }

        subscription = await this.updateSubscription(subscriptionUserId, {
          plan: "free",
          status: "canceled",
          stripeSubscriptionId: undefined,
          diagramsLimit: 3,
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
