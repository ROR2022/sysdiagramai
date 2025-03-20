'use client';

import Link from 'next/link';
import { useSubscription } from '@/app/context/SubscriptionContext';

export default function SubscriptionNav() {
  const { subscription, loading } = useSubscription();

  // Renderizar un skeleton mientras carga
  if (loading) {
    return (
      <div className="flex flex-col w-full gap-2 animate-pulse">
        <div className="h-4 bg-base-300 rounded-full w-24"></div>
        <div className="h-2 bg-base-300 rounded-full w-full"></div>
        <div className="w-full bg-base-300 rounded-full h-2"></div>
      </div>
    );
  }

  // Si no hay suscripción, no renderizar nada
  if (!subscription) {
    return null;
  }

  const usagePercentage = Math.min(
    Math.round((subscription.diagramsUsed / subscription.diagramsLimit) * 100),
    100
  );

  return (
    <div className="w-full text-base-content">
      <Link href="/subscription" className="link link-hover text-xs font-medium mb-1 block">
        {subscription.plan === 'free' ? 'Plan Gratuito' : `Plan ${subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}`}
      </Link>

      <div className="flex justify-between items-center text-xs mb-1">
        <span>Diagramas</span>
        <span className="font-medium">
          {subscription.diagramsUsed} / {subscription.diagramsLimit}
        </span>
      </div>

      <div className="w-full bg-base-300 rounded-full h-1.5 mb-1">
        <div
          className={`h-1.5 rounded-full ${
            usagePercentage < 70
              ? 'bg-success'
              : usagePercentage < 90
              ? 'bg-warning'
              : 'bg-error'
          }`}
          style={{ width: `${usagePercentage}%` }}
        ></div>
      </div>

      <div className="text-xs opacity-70">
        {subscription.diagramsLimit - subscription.diagramsUsed} disponibles
      </div>
    </div>
  );
} 