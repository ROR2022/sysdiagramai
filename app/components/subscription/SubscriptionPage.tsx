'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import SubscriptionPlans from './SubscriptionPlans';
import CurrentSubscription from './CurrentSubscription';
import PlanComparison from './PlanComparison';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSubscription } from '@/app/context/SubscriptionContext';

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
  const searchParams = useSearchParams();
  const { subscription, loading, fetchSubscription } = useSubscription();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscribing, setSubscribing] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [syncingSubscription, setSyncingSubscription] = useState(false);
  
  // Referencias para el estado de la verificación
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Detectar parámetros de URL que indican redirección desde Stripe
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  const sessionId = searchParams.get('session_id');

  // Estado para controlar la visibilidad del banner de estado
  const [showStatusBanner, setShowStatusBanner] = useState(success === 'true' || sessionId !== null);
  
  // Función para actualizar la suscripción después de cancelación
  const refreshSubscription = useCallback(async () => {
    try {
      setSyncingSubscription(true);
      await fetchSubscription(true);
      toast.success('Suscripción actualizada correctamente');
    } catch (error) {
      console.error('[Subscription] Error refreshing subscription:', error);
      toast.error('Error al actualizar la suscripción');
    } finally {
      setSyncingSubscription(false);
    }
  }, [fetchSubscription]);

  // Obtener los planes de suscripción
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/subscription/plans');
        
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        
        const data = await response.json();
        console.log('[Subscription] Subscription plans:', data);
        setPlans(data);
      } catch (error) {
        console.error('[Subscription] Error fetching plans:', error);
        toast.error('No se pudieron cargar los planes de suscripción');
      }
    };
    
    fetchPlans();
  }, []);
  
  // Efecto para verificar redirección desde Stripe
  useEffect(() => {
    // Detener cualquier polling existente al montar el componente
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    if (success === 'true' || sessionId) {
      console.log('[Subscription] Detectada redirección desde Stripe');
      
      // Establecer el estado para mostrar el banner
      setShowStatusBanner(true);
      
      // Verificar la suscripción con reintentos
      const verifySubscriptionWithRetries = async () => {
        console.log('[Subscription] Iniciando verificación con reintentos');
        toast.loading('Verificando estado de la suscripción...', { id: 'subscription-verification' });
        
        // Número máximo de intentos
        const MAX_RETRIES = 10; 
        // Intervalo entre intentos (en ms)
        const RETRY_INTERVAL = 3000;
        
        let retryCount = 0;
        
        // Función para verificar la suscripción
        const verifySubscription = async () => {
          try {
            const updatedSubscription = await fetchSubscription(true);
            console.log('[Subscription] Verificando suscripción:', updatedSubscription);
            
            // Verificar si la suscripción se ha actualizado correctamente
            if (updatedSubscription && 
                ((updatedSubscription.plan !== 'free' && updatedSubscription.status === 'active') || 
                 (updatedSubscription.status === 'active' && sessionId))) {
              toast.dismiss('subscription-verification');
              toast.success('Suscripción verificada correctamente', {
                duration: 3000
              });
              
              return true;
            }
            
            // Si la suscripción está en estado 'processing', seguimos esperando
            if (updatedSubscription && updatedSubscription.status === 'processing') {
              console.log('[Subscription] Suscripción en estado processing, esperando actualización...');
              return false;
            }
            
            // Si llegamos aquí, la suscripción no se ha actualizado correctamente
            console.log('[Subscription] La suscripción no se ha actualizado correctamente:', updatedSubscription);
            return false;
          } catch (error) {
            console.error('[Subscription] Error verificando suscripción:', error);
            return false;
          }
        };
        
        // Verificar inmediatamente
        const initialVerification = await verifySubscription();
        
        // Si la verificación inicial falla, configurar un intervalo para reintentar
        if (!initialVerification && retryCount < MAX_RETRIES) {
          pollingIntervalRef.current = setInterval(async () => {
            retryCount++;
            console.log(`[Subscription] Reintento ${retryCount}/${MAX_RETRIES}`);
            
            const success = await verifySubscription();
            
            // Si se verifica correctamente o se alcanza el número máximo de intentos, limpiar el intervalo
            if (success || retryCount >= MAX_RETRIES) {
              if (!success && retryCount >= MAX_RETRIES) {
                toast.dismiss('subscription-verification');
                toast.error('No se pudo verificar la suscripción después de varios intentos. Por favor, intenta sincronizar manualmente.');
                
                // Intentar una última sincronización manual
                try {
                  console.log('[Subscription] Intentando sincronización manual final...');
                  await fetchSubscription(true);
                } catch (error) {
                  console.error('[Subscription] Error en sincronización manual final:', error);
                }
              }
              
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
              }
            }
          }, RETRY_INTERVAL);
        }
      };
      
      // Iniciar la verificación con reintentos
      verifySubscriptionWithRetries();
      
      // Limpiar los parámetros de URL para evitar verificaciones repetidas
      // si el usuario recarga la página
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('success');
        url.searchParams.delete('canceled');
        url.searchParams.delete('session_id');
        window.history.replaceState({}, document.title, url.toString());
        
        // Mantener el banner visible aunque se hayan limpiado los parámetros
        // (no actualizamos showStatusBanner aquí para mantenerlo visible)
      }
    } else if (canceled === 'true') {
      toast.error('Proceso de suscripción cancelado', {
        duration: 3000
      });
      
      // También limpiar los parámetros de URL en caso de cancelación
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('success');
        url.searchParams.delete('canceled');
        url.searchParams.delete('session_id');
        window.history.replaceState({}, document.title, url.toString());
      }
    }
    
    // Limpiar el intervalo al desmontar el componente
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [success, canceled, sessionId, fetchSubscription]);

  // Función para suscribirse a un plan
  const handleSubscribe = async (priceId: string) => {
    setSubscribing(true);
    
    try {
      toast.loading('Preparando proceso de suscripción...', { id: 'subscription-process' });
      
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
        toast.dismiss('subscription-process');
        toast.success('Redirigiendo a la página de pago...', { duration: 2000 });
        
        // Breve retraso para mostrar el toast antes de redirigir
        setTimeout(() => {
          window.location.href = url;
        }, 1000);
      }
    } catch (error) {
      console.error('[Subscription] Error creating checkout session:', error);
      toast.dismiss('subscription-process');
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
      toast.loading('Procesando cancelación...', { id: 'cancel-subscription' });
      
      const response = await fetch('/api/subscription', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }
      
      toast.dismiss('cancel-subscription');
      toast.success('Tu suscripción ha sido cancelada');
      
      // Actualizar la suscripción
      await refreshSubscription();
    } catch (error) {
      console.error('[Subscription] Error canceling subscription:', error);
      toast.dismiss('cancel-subscription');
      toast.error('No se pudo cancelar la suscripción');
    } finally {
      setCanceling(false);
    }
  };

  // Función para acceder al portal de facturación
  const handleBillingPortal = async () => {
    try {
      toast.loading('Accediendo al portal de facturación...', { id: 'billing-portal' });
      
      const response = await fetch('/api/subscription/portal');
      
      if (!response.ok) {
        throw new Error('Failed to create billing portal session');
      }
      
      const { url } = await response.json();
      
      if (url) {
        toast.dismiss('billing-portal');
        window.location.href = url;
      }
    } catch (error) {
      console.error('[Subscription] Error creating billing portal session:', error);
      toast.dismiss('billing-portal');
      toast.error('No se pudo acceder al portal de facturación');
    }
  };
  
  // Función para forzar manualmente la sincronización de suscripción
  const handleForceSync = async () => {
    toast.loading('Sincronizando suscripción...', { id: 'force-sync' });
    const updated = await fetchSubscription(true);
    toast.dismiss('force-sync');
    
    if (updated) {
      toast.success('Suscripción sincronizada correctamente');
    } else {
      toast.error('No se pudo sincronizar la suscripción');
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
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Suscripción</h1>
        
        <button 
          onClick={handleForceSync}
          disabled={syncingSubscription}
          className="btn btn-sm btn-outline"
        >
          {syncingSubscription ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Sincronizando...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sincronizar
            </>
          )}
        </button>
      </div>
      
      {/* Banner de estado de suscripción */}
      {showStatusBanner && (
        <div className="alert alert-info mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">Procesando tu suscripción</h3>
            <div className="text-sm">
              Tu pago se está procesando. Este proceso puede tardar unos momentos. Si no ves actualizado tu plan, haz clic en &quot;Sincronizar&quot;.
            </div>
          </div>
        </div>
      )}
      
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
        </>
      )}
    </div>
  );
}