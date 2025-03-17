'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UsageLimitBannerProps {
  diagramsUsed: number;
  diagramsLimit: number;
}

export default function UsageLimitBanner({
  diagramsUsed,
  diagramsLimit
}: UsageLimitBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [hasSeenBanner, setHasSeenBanner] = useState(false);

  // Calcular el porcentaje de uso
  const usagePercentage = Math.min(
    Math.round((diagramsUsed / diagramsLimit) * 100),
    100
  );

  // Verificar si el usuario ya ha visto el banner
  useEffect(() => {
    const bannerSeen = localStorage.getItem('usageLimitBannerSeen');
    if (bannerSeen) {
      setHasSeenBanner(true);
      setIsVisible(false);
    }
  }, []);

  // Ocultar el banner y guardar en localStorage
  const hideBanner = () => {
    setIsVisible(false);
    localStorage.setItem('usageLimitBannerSeen', 'true');
    setHasSeenBanner(true);
  };

  // No mostrar el banner si el uso es menor al 80% o el usuario ya lo ha visto
  if (usagePercentage < 80 || !isVisible || hasSeenBanner) {
    return null;
  }

  // Determinar el color del banner según el porcentaje de uso
  const getBannerColor = () => {
    if (usagePercentage >= 95) return 'bg-error text-error-content';
    if (usagePercentage >= 90) return 'bg-warning text-warning-content';
    return 'bg-info text-info-content';
  };

  // Determinar el mensaje según el porcentaje de uso
  const getMessage = () => {
    if (usagePercentage >= 95) {
      return `¡Has alcanzado el ${usagePercentage}% de tu límite de diagramas! Actualiza tu plan para continuar creando diagramas.`;
    }
    if (usagePercentage >= 90) {
      return `Estás cerca de alcanzar tu límite de diagramas (${usagePercentage}%). Considera actualizar tu plan pronto.`;
    }
    return `Has utilizado el ${usagePercentage}% de tu límite de diagramas. Considera actualizar tu plan para evitar interrupciones.`;
  };

  return (
    <div className={`py-2 px-4 relative ${getBannerColor()}`}>
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex-1 text-center sm:text-left mb-2 sm:mb-0">
          <p className="text-sm sm:text-base">
            <span className="font-bold">¡Atención!</span> {getMessage()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link 
            href="/subscription" 
            className="btn btn-sm btn-outline"
          >
            Actualizar plan
          </Link>
          <button 
            onClick={hideBanner} 
            className="btn btn-sm btn-ghost btn-circle"
            aria-label="Cerrar"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 