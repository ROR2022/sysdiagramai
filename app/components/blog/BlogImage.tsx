'use client';

import { useState, CSSProperties, useEffect } from 'react';
import Image from 'next/image';

interface BlogImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function BlogImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  priority = false,
  sizes
}: BlogImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // URL de la imagen de fallback - Aseguramos la ruta absoluta
  const fallbackImageUrl = '/images/blog/fallback-image.svg';
  
  // Registramos cuando se establece un error para depurar
  useEffect(() => {
    if (error) {
      console.log('Error cargando imagen:', src);
      console.log('Intentando usar fallback:', fallbackImageUrl);
    }
  }, [error, src]);
  
  // Forzar error en imágenes específicas para testeo
  useEffect(() => {
    // Si la URL contiene "non-existent", simulamos un error para testear
    if (src.includes('non-existent')) {
      setError(true);
      setIsLoading(false);
    }
  }, [src]);
  
  // Clases para manejar el skeleton loader
  const skeletonClass = isLoading ? 'animate-pulse bg-base-300' : '';
  const combinedClassName = `${className} ${skeletonClass} transition-opacity`;
  
  // Establecer dimensiones para el contenedor
  const containerStyle: CSSProperties = { 
    position: 'relative', 
    width: fill ? '100%' : (width || 300),
    height: fill ? '100%' : (height || 200),
    overflow: 'hidden',
    borderRadius: error ? '0.375rem' : undefined
  };

  // Componente que muestra una indicación visual de error
  const ErrorIndicator = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-base-200/80 rounded-md z-10">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="48" 
        height="48" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-base-content/50 mb-2"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      <span className="text-sm font-medium text-base-content/70">Imagen no disponible</span>
    </div>
  );

  return (
    <div style={containerStyle} className="relative blog-image-container">
      {/* Para debugging: Mostramos src y estado */}
      {error && (
        <div className="hidden">
          Fuente original: {src}<br/>
          Fallback: {fallbackImageUrl}<br/>
          Estado: {error ? 'Error' : 'OK'}
        </div>
      )}
      
      {/* Imagen principal */}
      {!error && (
        <Image
          src={src}
          alt={alt}
          width={width || 300}
          height={height || 200}
          className={combinedClassName}
          priority={priority}
          sizes={sizes}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            console.log('⚠️ Error cargando imagen:', src);
            setIsLoading(false);
            setError(true);
          }}
        />
      )}
      
      {/* Imagen de fallback cuando hay error */}
      {error && (
        <>
          <Image
            src={fallbackImageUrl}
            alt={alt || "Imagen no disponible"}
            width={width || 300}
            height={height || 200}
            className={`${combinedClassName} opacity-50`}
            priority={true}
          />
          <ErrorIndicator />
        </>
      )}
    </div>
  );
}
