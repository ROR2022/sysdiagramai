'use client';

import Link from 'next/link';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function BlogPagination({ 
  currentPage, 
  totalPages, 
  baseUrl 
}: BlogPaginationProps) {
  // No mostrar paginación si solo hay una página
  if (totalPages <= 1) return null;
  
  // Crear array de páginas a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Si hay menos páginas que el máximo a mostrar, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar siempre la primera página
      pages.push(1);
      
      // Calcular el rango de páginas a mostrar
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Ajustar para mostrar siempre 3 páginas en el medio
      if (startPage === 2) endPage = Math.min(totalPages - 1, 4);
      if (endPage === totalPages - 1) startPage = Math.max(2, totalPages - 3);
      
      // Añadir elipsis después de la primera página si es necesario
      if (startPage > 2) {
        pages.push(-1); // -1 representa elipsis
      }
      
      // Añadir páginas del medio
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Añadir elipsis antes de la última página si es necesario
      if (endPage < totalPages - 1) {
        pages.push(-2); // -2 representa elipsis
      }
      
      // Mostrar siempre la última página
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  // Generar URL para una página específica
  const getPageUrl = (page: number) => {
    if (page === 1) return baseUrl;
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${page}`;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex justify-center mt-8">
      <div className="join">
        {/* Botón anterior */}
        {currentPage > 1 && (
          <Link 
            href={getPageUrl(currentPage - 1)}
            className="join-item btn"
            aria-label="Página anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        )}
        
        {/* Botones de páginas */}
        {pageNumbers.map((page, index) => {
          // Elipsis
          if (page < 0) {
            return (
              <button 
                key={`ellipsis-${index}`} 
                className="join-item btn btn-disabled"
                disabled
              >
                ...
              </button>
            );
          }
          
          // Botón normal de página
          return (
            <Link
              key={page}
              href={getPageUrl(page)}
              className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
            >
              {page}
            </Link>
          );
        })}
        
        {/* Botón siguiente */}
        {currentPage < totalPages && (
          <Link 
            href={getPageUrl(currentPage + 1)}
            className="join-item btn"
            aria-label="Página siguiente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
