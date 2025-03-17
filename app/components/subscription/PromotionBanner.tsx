'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PromotionBannerProps {
  plan?: string;
}

export default function PromotionBanner({ plan = 'free' }: PromotionBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [hasSeenBanner, setHasSeenBanner] = useState(false);

  // Verificar si el usuario ya ha visto el banner
  useEffect(() => {
    const bannerSeen = localStorage.getItem('promotionBannerSeen');
    if (bannerSeen) {
      setHasSeenBanner(true);
      setIsVisible(false);
    }
  }, []);

  // Ocultar el banner y guardar en localStorage
  const hideBanner = () => {
    setIsVisible(false);
    localStorage.setItem('promotionBannerSeen', 'true');
    setHasSeenBanner(true);
  };

  // No mostrar el banner si el usuario no tiene plan gratuito o ya lo ha visto
  if (plan !== 'free' || !isVisible || hasSeenBanner) {
    return null;
  }

  return (
    <div className="bg-primary text-primary-content py-2 px-4 relative">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex-1 text-center sm:text-left mb-2 sm:mb-0">
          <p className="text-sm sm:text-base">
            <span className="font-bold">¡Potencia tu experiencia!</span> Actualiza a un plan premium y obtén acceso a más diagramas y funcionalidades.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link 
            href="/subscription/#subscription-plans" 
            className="btn btn-sm btn-outline btn-accent"
          >
            Ver planes
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