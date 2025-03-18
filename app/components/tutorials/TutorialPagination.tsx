'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function TutorialPagination({ 
  currentPage, 
  totalPages, 
  baseUrl 
}: PaginationProps) {
  // No mostrar paginación si solo hay una página
  if (totalPages <= 1) return null;
  
  // Calcular rango de páginas a mostrar (máximo 5)
  let startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  
  // Ajustar el inicio si estamos cerca del final
  if (endPage === totalPages) {
    startPage = Math.max(1, endPage - 4);
  }
  
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  
  const getPageUrl = (page: number) => {
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${page}`;
  };
  
  return (
    <div className="flex justify-center my-8">
      <div className="join">
        {/* Botón anterior */}
        {currentPage > 1 && (
          <Link href={getPageUrl(currentPage - 1)} className="join-item btn btn-outline">
            «
          </Link>
        )}
        
        {/* Páginas numeradas */}
        {pages.map(page => (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`join-item btn ${
              currentPage === page ? 'btn-active' : 'btn-outline'
            }`}
          >
            {page}
          </Link>
        ))}
        
        {/* Botón siguiente */}
        {currentPage < totalPages && (
          <Link href={getPageUrl(currentPage + 1)} className="join-item btn btn-outline">
            »
          </Link>
        )}
      </div>
    </div>
  );
}
