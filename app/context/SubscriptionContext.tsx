'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definir la interfaz para el tipo de suscripción
export interface Subscription {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  plan: 'free' | 'pro' | 'team';
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'incomplete' | 'processing';
  currentPeriodEnd?: string;
  diagramsUsed: number;
  diagramsLimit: number;
  lastPaymentAttempt?: string;
}

// Definir la interfaz para el contexto
interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  fetchSubscription: (force?: boolean) => Promise<Subscription | null>;
  isAuthenticated: boolean;
}

// Crear el contexto
const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

// Intervalo mínimo entre solicitudes
const FETCH_INTERVAL = 60000; // 1 minuto

// Verificar si hay alguna cookie que sugiera que el usuario podría estar autenticado
const mightBeAuthenticated = (): boolean => {
  // Buscar cookies relacionadas con la autenticación
  // En next-auth, la cookie suele llamarse 'next-auth.session-token'
  return document.cookie.includes('next-auth') || 
         document.cookie.includes('__Secure-next-auth') ||
         document.cookie.includes('__Host-next-auth');
};

// Proveedor del contexto
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para obtener los datos de suscripción
  const fetchSubscription = async (force = false): Promise<Subscription | null> => {
    try {
      // Verificar si hay indicios de que el usuario podría estar autenticado
      if (!force && !mightBeAuthenticated()) {
        console.log('[SubscriptionContext] No hay indicios de autenticación, omitiendo fetch');
        setIsAuthenticated(false);
        setLoading(false);
        return null;
      }

      // Verificar si debemos hacer fetch basado en el intervalo y si es forzado
      const now = Date.now();
      if (!force && now - lastFetchTime < FETCH_INTERVAL) {
        console.log('[SubscriptionContext] Omitiendo fetch, usando datos en caché');
        return subscription;
      }

      console.log('[SubscriptionContext] Fetching subscription data...');
      setLastFetchTime(now);
      
      // Intentamos obtener la suscripción
      const response = await fetch('/api/subscription');
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('[SubscriptionContext] Usuario no autenticado (401)');
          setIsAuthenticated(false);
          setSubscription(null);
          setLoading(false);
          return null;
        }
        console.log(`[SubscriptionContext] Error al obtener suscripción: ${response.status} ${response.statusText}`);
        setLoading(false);
        return subscription;
      }
      
      // Si llegamos aquí, el usuario está autenticado
      setIsAuthenticated(true);
      
      const data = await response.json();
      console.log('[SubscriptionContext] Subscription data received:', data);
      
      setSubscription(data);
      setLoading(false);
      return data;
    } catch {
      // No mostramos error en la consola para evitar ruido
      console.log('[SubscriptionContext] No se pudo obtener la suscripción, usando datos en caché si están disponibles');
      setLoading(false);
      return subscription;
    }
  };

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      if (isMounted) {
        await fetchSubscription(false); // No forzamos la carga inicial
      }
    };
    
    loadInitialData();
    
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SubscriptionContext.Provider 
      value={{ 
        subscription, 
        loading, 
        fetchSubscription,
        isAuthenticated
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

// Hook para usar el contexto
export function useSubscription(): SubscriptionContextType {
  const context = useContext(SubscriptionContext);
  
  if (!context) {
    throw new Error('useSubscription debe usarse dentro de un SubscriptionProvider');
  }
  
  return context;
}