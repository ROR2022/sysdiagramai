'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TutorialLayout from '../../../components/tutorials/TutorialLayout';
import TutorialCard from '../../../components/tutorials/TutorialCard';
import TutorialPagination from '../../../components/tutorials/TutorialPagination';

// Datos de ejemplo para los tutoriales
const SAMPLE_TUTORIALS = [
  {
    slug: 'primeros-pasos-sysdiagramai',
    title: 'Primeros pasos con SysDiagramAI',
    excerpt: 'Aprende a configurar y comenzar a utilizar SysDiagramAI para crear tus primeros diagramas de sistema de manera rápida y sencilla.',
    coverImage: '/images/tutorials/getting-started.jpg',
    category: { id: 'basics', name: 'Fundamentos' },
    difficulty: 'Principiante',
    duration: 15,
    updatedDate: '10 Mar 2025'
  },
  {
    slug: 'diagramas-microservicios',
    title: 'Cómo diseñar diagramas de arquitecturas de microservicios',
    excerpt: 'Guía paso a paso para crear diagramas efectivos de arquitecturas basadas en microservicios utilizando las herramientas especializadas de SysDiagramAI.',
    coverImage: '/images/tutorials/microservices.jpg',
    category: { id: 'intermediate', name: 'Nivel Intermedio' },
    difficulty: 'Intermedio',
    duration: 25,
    updatedDate: '5 Mar 2025'
  },
  {
    slug: 'integracion-continua-diagramas',
    title: 'Integración continua para diagramas de arquitectura',
    excerpt: 'Aprende a incorporar tus diagramas de SysDiagramAI en flujos de CI/CD para mantener la documentación siempre actualizada.',
    coverImage: '/images/tutorials/ci-cd-diagrams.jpg',
    category: { id: 'advanced', name: 'Avanzado' },
    difficulty: 'Avanzado',
    duration: 35,
    updatedDate: '28 Feb 2025'
  },
  {
    slug: 'mejores-practicas-diagramas',
    title: 'Mejores prácticas para diagramas de arquitectura efectivos',
    excerpt: 'Consejos y técnicas para crear diagramas de sistemas que sean claros, informativos y útiles para todos los miembros del equipo.',
    coverImage: '/images/tutorials/best-practices.jpg',
    category: { id: 'best-practices', name: 'Mejores Prácticas' },
    difficulty: 'Intermedio',
    duration: 20,
    updatedDate: '15 Feb 2025'
  },
  {
    slug: 'diagramacion-sistemas-distribuidos',
    title: 'Diagramación de sistemas distribuidos y alta disponibilidad',
    excerpt: 'Técnicas específicas para representar arquitecturas distribuidas, replicación, zonas de disponibilidad y mecanismos de tolerancia a fallos.',
    coverImage: '/images/tutorials/distributed-systems.jpg',
    category: { id: 'advanced', name: 'Avanzado' },
    difficulty: 'Avanzado',
    duration: 30,
    updatedDate: '5 Feb 2025'
  },
  {
    slug: 'diagramas-arquitectura-seguridad',
    title: 'Diagramas de arquitectura de seguridad',
    excerpt: 'Cómo representar aspectos de seguridad en tus diagramas de sistema, incluyendo zonas de confianza, controles y flujo de datos sensibles.',
    coverImage: '/images/tutorials/security-diagrams.jpg',
    category: { id: 'intermediate', name: 'Nivel Intermedio' },
    difficulty: 'Intermedio',
    duration: 25,
    updatedDate: '20 Jan 2025'
  }
];

// Mapeo de categorías IDs a nombres
const CATEGORY_MAP: { [key: string]: string } = {
  'basics': 'Fundamentos',
  'intermediate': 'Nivel Intermedio',
  'advanced': 'Avanzado',
  'best-practices': 'Mejores Prácticas'
};

export default function TutorialCategoryPage() {
  const params = useParams();
  const categoryId = typeof params.category === 'string' ? params.category : params.category?.[0] || '';
  const [categoryName, setCategoryName] = useState('');
  const [filteredTutorials, setFilteredTutorials] = useState(SAMPLE_TUTORIALS);
  const [currentPage, setCurrentPage] = useState(1);
  const tutorialsPerPage = 4;
  
  useEffect(() => {
    // Actualizar nombre de categoría
    setCategoryName(CATEGORY_MAP[categoryId] || categoryId);
    
    // Filtrar tutoriales por categoría
    if (categoryId) {
      const filtered = SAMPLE_TUTORIALS.filter(
        tutorial => tutorial.category.id === categoryId
      );
      setFilteredTutorials(filtered);
    } else {
      setFilteredTutorials(SAMPLE_TUTORIALS);
    }
    
    // Reiniciar paginación
    setCurrentPage(1);
  }, [categoryId]);
  
  // Calcular tutoriales para la página actual
  const indexOfLastTutorial = currentPage * tutorialsPerPage;
  const indexOfFirstTutorial = indexOfLastTutorial - tutorialsPerPage;
  const currentTutorials = filteredTutorials.slice(indexOfFirstTutorial, indexOfLastTutorial);
  const totalPages = Math.ceil(filteredTutorials.length / tutorialsPerPage);
  
  // Construir URL base para paginación
  const baseUrl = `/tutorials/category/${categoryId}`;
  
  return (
    <div className='bg-base-100 text-base-content'>
      <TutorialLayout activeCategory={categoryId}>
        {categoryName && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold">
              Categoría: {categoryName}
            </h2>
            <p className="text-base-content/70 mt-1">
              {filteredTutorials.length} tutoriales disponibles
            </p>
          </div>
        )}
      
        {filteredTutorials.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">No se encontraron tutoriales en esta categoría</h3>
            <p>Intenta con otra categoría o explora todos nuestros tutoriales.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentTutorials.map((tutorial) => (
                <TutorialCard
                  key={tutorial.slug}
                  {...tutorial}
                />
              ))}
            </div>
            
            <TutorialPagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={baseUrl}
            />
          </>
        )}
      </TutorialLayout>
    </div>
  );
}
