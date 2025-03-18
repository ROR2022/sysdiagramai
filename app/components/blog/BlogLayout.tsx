'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Componentes locales para evitar problemas de importación
function BlogSearch({ onSearch, initialValue = '' }: { onSearch: (query: string) => void; initialValue?: string }) {
  const [query, setQuery] = useState(initialValue);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Buscar artículos..."
          className="input input-bordered w-full pr-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="submit" 
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          aria-label="Buscar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
    </div>
  );
}

function BlogCategory({ id, name, isActive = false, count }: { id: string; name: string; isActive?: boolean; count?: number }) {
  const href = id === 'all' ? '/blog' : `/blog/category/${id}`;
  
  return (
    <Link 
      href={href} 
      className={`flex justify-between items-center p-2 rounded transition-colors ${
        isActive 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'hover:bg-base-200'
      }`}
    >
      <span>{name}</span>
      {count !== undefined && (
        <span className="badge badge-sm">{count}</span>
      )}
    </Link>
  );
}

interface BlogLayoutProps {
  children: ReactNode;
  activeCategory?: string;
}

export default function BlogLayout({ children, activeCategory }: BlogLayoutProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implementar la funcionalidad de búsqueda
    router.push(`/blog?search=${encodeURIComponent(query)}`);
  };
  
  const categories = [
    { id: 'all', name: 'Todos los artículos' },
    { id: 'tutorials', name: 'Tutoriales' },
    { id: 'tips', name: 'Consejos y Trucos' },
    { id: 'news', name: 'Noticias' },
    { id: 'case-studies', name: 'Casos de Estudio' },
  ];
  
  return (
    <div className="container text-base-content bg-base-100 mx-auto px-4 py-8">
      {/* Botón para volver a la página principal */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="btn btn-ghost gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Blog de SysDiagramAI</h1>
        <p className="text-base-content/70">
          Artículos, tutoriales y novedades sobre diseño de sistemas y arquitectura de software
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Barra lateral */}
        <div className="w-full md:w-1/4">
          <div className="sticky top-24">
            <BlogSearch onSearch={handleSearch} initialValue={searchQuery} />
            
            <div className="mt-8">
              <h3 className="font-semibold mb-4">Categorías</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <BlogCategory
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    isActive={activeCategory === category.id || (!activeCategory && category.id === 'all')}
                  />
                ))}
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-base-200 rounded-lg">
              <h3 className="font-semibold mb-3">¿Necesitas ayuda?</h3>
              <p className="text-sm mb-3">Si tienes alguna pregunta o necesitas asistencia con SysDiagramAI, nuestro equipo está disponible para ayudarte.</p>
              <Link href="/support" className="btn btn-primary btn-sm w-full">Contactar Soporte</Link>
              <div className="text-center mt-2 text-xs">
                <a href="mailto:kodeandoando2023@gmail.com" className="link text-xs">kodeandoando2023@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="w-full md:w-3/4">
          {children}
        </div>
      </div>
    </div>
  );
}
