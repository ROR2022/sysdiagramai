'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TutorialLayoutProps {
  children: ReactNode;
  activeCategory?: string;
}

export default function TutorialLayout({ children, activeCategory }: TutorialLayoutProps) {
  const pathname = usePathname();
  
  // Categorías de ejemplo para los tutoriales
  const categories = [
    { id: 'basics', name: 'Fundamentos' },
    { id: 'intermediate', name: 'Nivel Intermedio' },
    { id: 'advanced', name: 'Avanzado' },
    { id: 'best-practices', name: 'Mejores Prácticas' },
  ];
  
  // Determinar si estamos en la página principal de tutoriales
  const isMainTutorialsPage = pathname === '/tutorials';
  
  return (
    <div className="bg-base-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-base-content">Tutoriales</h1>
              <p className="text-base-content/70 mt-1">
                Aprende a utilizar SysDiagramAI desde cero hasta nivel experto
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3">
              <Link
                href="/tutorials"
                className="btn btn-sm btn-outline"
              >
                Todos los tutoriales
              </Link>
              <Link href="/" className="btn btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Página principal
              </Link>
            </div>
          </div>
          
          {/* Categorías de tutorial */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/tutorials/category/${category.id}`}
                className={`badge badge-lg py-3 ${
                  activeCategory === category.id || 
                  pathname.includes(`/tutorials/category/${category.id}`) || 
                  (isMainTutorialsPage && category.id === 'basics' && !activeCategory)
                    ? 'badge-primary text-primary-content'
                    : 'badge-outline'
                } cursor-pointer hover:badge-primary hover:text-primary-content transition-colors`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </header>
        
        <main>{children}</main>
      </div>
    </div>
  );
}
