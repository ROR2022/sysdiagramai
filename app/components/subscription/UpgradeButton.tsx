'use client';

import Link from 'next/link';

interface UpgradeButtonProps {
  plan?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export default function UpgradeButton({
  plan = 'free',
  className = '',
  variant = 'default',
  size = 'sm'
}: UpgradeButtonProps) {
  // No mostrar el botón si el usuario no tiene plan gratuito
  if (plan !== 'free') {
    return null;
  }

  // Determinar las clases del botón según la variante
  const getButtonClasses = () => {
    let classes = 'btn ';
    
    // Tamaño
    if (size === 'xs') classes += 'btn-xs ';
    else if (size === 'sm') classes += 'btn-sm ';
    else if (size === 'lg') classes += 'btn-lg ';
    
    // Variante
    if (variant === 'outline') classes += 'btn-outline btn-primary ';
    else if (variant === 'ghost') classes += 'btn-ghost ';
    else classes += 'btn-primary ';
    
    // Clases adicionales
    classes += className;
    
    return classes;
  };

  return (
    <Link href="/subscription" className={getButtonClasses()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-1"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
          clipRule="evenodd"
        />
      </svg>
      Actualizar
    </Link>
  );
} 