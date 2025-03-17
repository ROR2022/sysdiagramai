'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import SubscriptionPlans from './SubscriptionPlans';
import CurrentSubscription from './CurrentSubscription';
import PlanComparison from './PlanComparison';
import Link from 'next/link';
// Interfaz para la suscripción
interface Subscription {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  plan: 'free' | 'pro' | 'team';
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'incomplete';
  currentPeriodEnd?: string;
  diagramsUsed: number;
  diagramsLimit: number;
}

// Interfaz para los planes de suscripción
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  intervalCount: number;
  features: string[];
  highlighted: boolean;
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Obtener la suscripción del usuario
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscription');
        
        if (!response.ok) {
          throw new Error('Failed to fetch subscription');
        }
        
        const data = await response.json();
        console.log('data current subscription:..',data);
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        toast.error('No se pudo cargar la información de tu suscripción');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscription();
  }, []);

  // Obtener los planes de suscripción
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/subscription/plans');
        
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        
        const data = await response.json();
        console.log('data plans:..',data);
        setPlans(data);
      } catch (error) {
        console.error('Error fetching plans:', error);
        toast.error('No se pudieron cargar los planes de suscripción');
      }
    };
    
    fetchPlans();
  }, []);

  // Función para suscribirse a un plan
  const handleSubscribe = async (priceId: string) => {
    setSubscribing(true);
    
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }
      
      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('No se pudo iniciar el proceso de suscripción');
    } finally {
      setSubscribing(false);
    }
  };

  // Función para cancelar la suscripción
  const handleCancel = async () => {
    if (!confirm('¿Estás seguro de que quieres cancelar tu suscripción?')) {
      return;
    }
    
    setCanceling(true);
    
    try {
      const response = await fetch('/api/subscription', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }
      
      toast.success('Tu suscripción ha sido cancelada');
      
      // Actualizar la suscripción
      const updatedSubscription = await fetch('/api/subscription').then(res => res.json());
      setSubscription(updatedSubscription);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('No se pudo cancelar la suscripción');
    } finally {
      setCanceling(false);
    }
  };

  // Función para acceder al portal de facturación
  const handleBillingPortal = async () => {
    try {
      const response = await fetch('/api/subscription/portal');
      
      if (!response.ok) {
        throw new Error('Failed to create billing portal session');
      }
      
      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      toast.error('No se pudo acceder al portal de facturación');
    }
  };

  return (
    <div className="container text-base-content bg-base-100 mx-auto px-4 py-8">
      <Link href="/dashboard" className="text-base-content bg-base-300 p-2 rounded-lg flex items-center gap-2 mb-4 w-96">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      <span>Volver al dashboard</span>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Suscripción</h1>
      
      {/* Guía de suscripción */}
      <div className="bg-base-200 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-2">Cómo funciona</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Revisa tu <strong>suscripción actual</strong> y los límites de uso.</li>
          <li>Explora los <strong>planes disponibles</strong> y sus características.</li>
          <li>Selecciona <strong>&quot;Suscribirse&quot;</strong> en el plan que desees adquirir.</li>
          <li>Completa el pago seguro a través de <strong>Stripe</strong>.</li>
          <li>¡Listo! Tu cuenta será actualizada automáticamente.</li>
        </ol>
      </div>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : (
        <>
          {subscription && (
            <CurrentSubscription
              subscription={subscription}
              onCancel={handleCancel}
              onBillingPortal={handleBillingPortal}
              canceling={canceling}
            />
          )}
          
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Planes disponibles</h2>
              <button 
                onClick={() => setShowComparison(!showComparison)}
                className="btn btn-sm btn-outline"
              >
                {showComparison ? 'Ocultar comparación' : 'Comparar planes'}
              </button>
            </div>
            
            {showComparison && (
              <div className="mb-8">
                <PlanComparison />
              </div>
            )}
            
            <div id='subscription-plans'>
            <SubscriptionPlans
              plans={plans}
              currentPlan={subscription?.plan}
              onSubscribe={handleSubscribe}
              subscribing={subscribing}
            />
            </div>
          </div>
          
          <div className="mt-16 bg-base-200 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Preguntas frecuentes</h2>
            <div className="space-y-4">
              <div className="collapse collapse-arrow bg-base-100">
                <input type="checkbox" /> 
                <div className="collapse-title font-medium">
                  ¿Cómo funciona el proceso de pago?
                </div>
                <div className="collapse-content"> 
                  <p>Utilizamos Stripe como procesador de pagos seguro. Cuando seleccionas un plan, serás redirigido a una página de pago segura donde podrás ingresar tus datos de tarjeta. No almacenamos tu información de pago en nuestros servidores.</p>
                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-100">
                <input type="checkbox" /> 
                <div className="collapse-title font-medium">
                  ¿Puedo cancelar mi suscripción en cualquier momento?
                </div>
                <div className="collapse-content"> 
                  <p>Sí, puedes cancelar tu suscripción en cualquier momento. Tu plan seguirá activo hasta el final del período de facturación actual. Después de eso, tu cuenta volverá automáticamente al plan gratuito.</p>
                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-100">
                <input type="checkbox" /> 
                <div className="collapse-title font-medium">
                  ¿Qué sucede si excedo el límite de diagramas?
                </div>
                <div className="collapse-content"> 
                  <p>Si alcanzas el límite de diagramas de tu plan, no podrás crear nuevos diagramas hasta que actualices tu plan o hasta que comience el siguiente período de facturación. Los diagramas existentes seguirán siendo accesibles.</p>
                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-100">
                <input type="checkbox" /> 
                <div className="collapse-title font-medium">
                  ¿Ofrecen reembolsos?
                </div>
                <div className="collapse-content"> 
                  <p>Evaluamos las solicitudes de reembolso caso por caso. Si tienes algún problema con tu suscripción, contáctanos a través de nuestro formulario de soporte y haremos todo lo posible para ayudarte.</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 