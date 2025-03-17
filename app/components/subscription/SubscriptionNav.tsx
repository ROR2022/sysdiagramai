'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SubscriptionNavProps {
  currentPlan?: string;
  diagramsUsed?: number;
  diagramsLimit?: number;
}

export default function SubscriptionNav({ 
  currentPlan = 'free', 
  diagramsUsed = 0, 
  diagramsLimit = 5 
}: SubscriptionNavProps) {
  const pathname = usePathname();
  const isActive = pathname === '/subscription';
  
  // Calcular el porcentaje de uso
  const usagePercentage = Math.min(
    Math.round((diagramsUsed / diagramsLimit) * 100),
    100
  );
  
  // Determinar el color de la barra de progreso
  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return 'bg-success';
    if (percentage < 90) return 'bg-warning';
    return 'bg-error';
  };
  
  // Formatear el nombre del plan
  const formatPlan = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'Gratuito';
      case 'pro':
        return 'Pro';
      case 'team':
        return 'Equipo';
      default:
        return plan.charAt(0).toUpperCase() + plan.slice(1);
    }
  };

  return (
    <Link 
      href="/subscription" 
      className={`flex text-base-content items-center p-2 rounded-lg transition-colors ${
        isActive ? 'bg-primary/10' : 'hover:bg-base-200'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">
            Plan {formatPlan(currentPlan)}
          </span>
          <span className="text-xs text-base-content/70">
            {diagramsUsed}/{diagramsLimit}
          </span>
        </div>
        <div className="w-full bg-base-300 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${getProgressColor(usagePercentage)}`}
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
      </div>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 ml-2 text-base-content/50" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    </Link>
  );
} 