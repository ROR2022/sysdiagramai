'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface DocumentationLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function DocumentationLayout({ 
  children, 
  activeSection, 
  onSectionChange 
}: DocumentationLayoutProps) {
  const router = useRouter();
  
  // Función para cambiar de sección
  const navigateToSection = (section: string) => {
    onSectionChange(section);
    // Hacer scroll a la sección
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="text-base-content bg-base-100 min-h-screen">
      {/* Barra de navegación superior simple */}
      <header className="bg-base-200 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <span>SysDiagramAI</span>
          </Link>
          <button 
            onClick={() => router.push("/")} 
            className="btn btn-ghost btn-sm"
          >
            Volver
          </button>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        {/* Barra lateral de navegación */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-4 bg-base-200 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">Contenido</h3>
            <ul className="menu menu-vertical space-y-1">
              <li>
                <a 
                  className={activeSection === 'introduction' ? 'active' : ''} 
                  onClick={() => navigateToSection('introduction')}
                >
                  Introducción
                </a>
              </li>
              <li>
                <a 
                  className={activeSection === 'getting-started' ? 'active' : ''} 
                  onClick={() => navigateToSection('getting-started')}
                >
                  Primeros Pasos
                </a>
              </li>
              <li>
                <a 
                  className={activeSection === 'requirements-form' ? 'active' : ''} 
                  onClick={() => navigateToSection('requirements-form')}
                >
                  Formulario de Requerimientos
                </a>
              </li>
              <li>
                <a 
                  className={activeSection === 'results-interpretation' ? 'active' : ''} 
                  onClick={() => navigateToSection('results-interpretation')}
                >
                  Interpretación de Resultados
                </a>
              </li>
              <li>
                <a 
                  className={activeSection === 'design-framework' ? 'active' : ''} 
                  onClick={() => navigateToSection('design-framework')}
                >
                  Framework de Diseño
                </a>
              </li>
              <li>
                <a 
                  className={activeSection === 'tech-architecture' ? 'active' : ''} 
                  onClick={() => navigateToSection('tech-architecture')}
                >
                  Tecnologías y Arquitectura
                </a>
              </li>
              <li>
                <a 
                  className={activeSection === 'subscription' ? 'active' : ''} 
                  onClick={() => navigateToSection('subscription')}
                >
                  Modelo de Suscripción
                </a>
              </li>
              <li>
                <a 
                  className={activeSection === 'advanced-resources' ? 'active' : ''} 
                  onClick={() => navigateToSection('advanced-resources')}
                >
                  Recursos Avanzados
                </a>
              </li>
              <li>
                <a 
                  className={activeSection === 'support-community' ? 'active' : ''} 
                  onClick={() => navigateToSection('support-community')}
                >
                  Soporte y Comunidad
                </a>
              </li>
            </ul>
          </div>
        </aside>
        
        {/* Contenido principal */}
        <main className="flex-1 prose prose-sm md:prose-base lg:prose-lg max-w-none">
          {children}
        </main>
      </div>
      
      <footer className="bg-base-300 text-base-content py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">{new Date().getFullYear()} SysDiagramAI. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/legal/privacy" className="text-sm link link-hover">Política de Privacidad</Link>
            <Link href="/legal/terms" className="text-sm link link-hover">Términos y Condiciones</Link>
            <Link href="/legal/cookies" className="text-sm link link-hover">Política de Cookies</Link>
            <Link href="/support" className="text-sm link link-hover">Soporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
