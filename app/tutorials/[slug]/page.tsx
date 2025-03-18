'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import TutorialLayout from '../../components/tutorials/TutorialLayout';
import BlogImage from '../../components/blog/BlogImage';

// Tipos para los datos de tutorial
interface Tutorial {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: {
    id: string;
    name: string;
  };
  difficulty: string;
  duration: number;
  updatedDate: string;
  content: string;
}

// Datos de ejemplo para tutoriales
const SAMPLE_TUTORIALS = [
  {
    slug: 'primeros-pasos-sysdiagramai',
    title: 'Primeros pasos con SysDiagramAI',
    excerpt: 'Aprende a configurar y comenzar a utilizar SysDiagramAI para crear tus primeros diagramas de sistema de manera rápida y sencilla.',
    coverImage: '/images/tutorials/getting-started.jpg',
    category: { id: 'basics', name: 'Fundamentos' },
    difficulty: 'Principiante',
    duration: 15,
    updatedDate: '10 Mar 2025',
    content: `
      <h2>Bienvenido a SysDiagramAI</h2>
      <p>En este tutorial, aprenderás todo lo que necesitas para comenzar a utilizar nuestra plataforma y crear tus primeros diagramas de sistemas.</p>
      
      <h3>Paso 1: Registrarse en la plataforma</h3>
      <p>Lo primero que necesitas es crear una cuenta en SysDiagramAI:</p>
      <ol>
        <li>Visita la página principal y haz clic en "Registrarse"</li>
        <li>Completa el formulario con tus datos</li>
        <li>Verifica tu correo electrónico</li>
      </ol>
      
      <h3>Paso 2: Crear tu primer proyecto</h3>
      <p>Una vez dentro de la plataforma, puedes crear tu primer proyecto:</p>
      <ol>
        <li>Haz clic en "Nuevo Proyecto" en el dashboard</li>
        <li>Dale un nombre descriptivo</li>
        <li>Selecciona la plantilla "En blanco" o alguna de nuestras plantillas predefinidas</li>
      </ol>
      
      <h3>Paso 3: Utilizar el editor</h3>
      <p>Nuestro editor es intuitivo y fácil de usar:</p>
      <ul>
        <li>El panel izquierdo contiene los elementos que puedes arrastrar al lienzo</li>
        <li>El lienzo central es donde diseñas tu diagrama</li>
        <li>El panel derecho muestra las propiedades del elemento seleccionado</li>
      </ul>
      
      <h3>Paso 4: Guardar y compartir</h3>
      <p>Una vez terminado tu diagrama:</p>
      <ol>
        <li>Guarda tu trabajo con el botón "Guardar" o usando Ctrl+S</li>
        <li>Para compartir, utiliza el botón "Compartir" y genera un enlace</li>
        <li>También puedes exportar como imagen o PDF desde el menú "Exportar"</li>
      </ol>
      
      <h2>Recursos adicionales</h2>
      <p>Para profundizar más en las funcionalidades de SysDiagramAI, te recomendamos:</p>
      <ul>
        <li>Revisar nuestros tutoriales avanzados</li>
        <li>Unirte a nuestra comunidad en Discord</li>
        <li>Consultar la documentación completa</li>
      </ul>
    `
  },
  {
    slug: 'diagramas-microservicios',
    title: 'Cómo diseñar diagramas de arquitecturas de microservicios',
    excerpt: 'Guía paso a paso para crear diagramas efectivos de arquitecturas basadas en microservicios utilizando las herramientas especializadas de SysDiagramAI.',
    coverImage: '/images/tutorials/microservices.jpg',
    category: { id: 'intermediate', name: 'Nivel Intermedio' },
    difficulty: 'Intermedio',
    duration: 25,
    updatedDate: '5 Mar 2025',
    content: `
      <h2>Diseñando arquitecturas de microservicios</h2>
      <p>Las arquitecturas de microservicios requieren una representación visual clara debido a su naturaleza distribuida. En este tutorial, aprenderás las técnicas específicas para diagramar estos sistemas.</p>
      
      <h3>¿Por qué son diferentes los diagramas de microservicios?</h3>
      <p>Los diagramas de microservicios deben capturar:</p>
      <ul>
        <li>Servicios independientes y sus responsabilidades</li>
        <li>Comunicación entre servicios</li>
        <li>Bases de datos y almacenamiento por servicio</li>
        <li>Patrones de integración</li>
      </ul>
      
      <h3>Utilizando las plantillas especializadas</h3>
      <p>SysDiagramAI ofrece plantillas específicas para microservicios:</p>
      <ol>
        <li>Selecciona la plantilla "Arquitectura de Microservicios" al crear un nuevo proyecto</li>
        <li>Observa los componentes predefinidos orientados a este tipo de arquitectura</li>
        <li>Personaliza los servicios según tus necesidades</li>
      </ol>
      
      <h3>Representando la comunicación entre servicios</h3>
      <p>La comunicación es un aspecto crítico:</p>
      <ol>
        <li>Utiliza diferentes tipos de flechas para distintos protocolos (REST, gRPC, mensajería)</li>
        <li>Añade anotaciones para indicar contratos o payloads importantes</li>
        <li>Representa colas y buses de eventos con los símbolos apropiados</li>
      </ol>
      
      <h3>Documentando patrones de resiliencia</h3>
      <p>No olvides incluir patrones de resiliencia:</p>
      <ul>
        <li>Circuit breakers</li>
        <li>Retries</li>
        <li>Bulkheads</li>
        <li>Timeout policies</li>
      </ul>
      
      <h2>Prácticas recomendadas</h2>
      <p>Finaliza tu diagrama aplicando estas prácticas:</p>
      <ul>
        <li>Agrupa servicios relacionados</li>
        <li>Utiliza colores consistentes por dominio</li>
        <li>Incluye una leyenda para explicar símbolos especiales</li>
        <li>Añade notas sobre detalles de implementación relevantes</li>
      </ul>
    `
  },
  // Otros tutoriales de ejemplo...
];

export default function TutorialPage() {
  const directParams = useParams();
  const slug = directParams.slug || "";
  const router = useRouter();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [noTutorial, setNoTutorial] = useState(false);

  const goToTutorials = useCallback(() => {
    setTimeout(() => {
      setNoTutorial(false);
      router.push("/tutorials");
    }, 5000);
  }, [router]);

  useEffect(() => {
    // En una implementación real, esto sería una llamada a una API o base de datos
    console.log("Buscando Tutorial Slug:", slug);
    const foundTutorial = SAMPLE_TUTORIALS.find(t => t.slug === slug);
    
    if (foundTutorial) {
      console.log("Tutorial encontrado:", foundTutorial);
      setTutorial(foundTutorial);
      setLoading(false);
    } else {
      console.log("No se encontró el tutorial...");
      // Si no se encuentra el tutorial, redirigir a la página principal de tutoriales
      setLoading(false);
      setNoTutorial(true);
      goToTutorials();
    }
  }, [slug, goToTutorials]);

  if (loading) {
    return (
      <div className="bg-base-100 text-base-content">
        <TutorialLayout>
          <div className="flex justify-center items-center py-16">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </TutorialLayout>
      </div>
    );
  }

  return (
    <div className="bg-base-100 text-base-content">
      {noTutorial && (
        <div className="bg-base-100">
          <TutorialLayout>
            <div className="flex justify-center items-center py-16">
              <div className="flex flex-col justify-center items-center py-16 px-4">
                <div className="bg-error/10 border border-error/30 rounded-lg p-6 max-w-md w-full text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-error mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <h2 className="text-xl font-bold text-error mb-2">
                    Tutorial no encontrado
                  </h2>
                  <p className="text-base-content/80 mb-4">
                    Lo sentimos, el tutorial que estás buscando no existe o ha
                    sido trasladado a otra ubicación.
                  </p>
                  <p className="text-sm text-base-content/60">
                    Serás redirigido automáticamente a la página de tutoriales en 5
                    segundos...
                  </p>
                  <button
                    onClick={() => router.push("/tutorials")}
                    className="btn btn-error btn-sm mt-4"
                  >
                    Ir a tutoriales ahora
                  </button>
                </div>
              </div>
            </div>
          </TutorialLayout>
        </div>
      )}
      {slug && tutorial && (
        <TutorialLayout activeCategory={tutorial.category.id}>
          <article className="prose prose-lg max-w-none">
            {/* Encabezado del tutorial */}
            <header className="mb-8 not-prose">
              <div className="flex flex-wrap gap-2 mb-4">
                <Link 
                  href={`/tutorials/category/${tutorial.category.id}`}
                  className="badge badge-outline py-3"
                >
                  {tutorial.category.name}
                </Link>
                <div className={`badge ${
                  tutorial.difficulty.toLowerCase() === 'principiante' ? 'badge-success' :
                  tutorial.difficulty.toLowerCase() === 'intermedio' ? 'badge-warning' :
                  'badge-error'
                } py-3`}>
                  {tutorial.difficulty}
                </div>
                <div className="badge badge-neutral py-3">
                  {tutorial.duration} min
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mt-3 mb-4">{tutorial.title}</h1>
              
              <div className="flex items-center text-sm text-base-content/70 mb-6">
                <span>Actualizado: {tutorial.updatedDate}</span>
              </div>
              
              <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
                <BlogImage
                  src={tutorial.coverImage}
                  alt={tutorial.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            </header>
            
            {/* Contenido del tutorial */}
            <div dangerouslySetInnerHTML={{ __html: tutorial.content }} />
            
            {/* Navegación del tutorial */}
            <div className="my-12 not-prose">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Link href="/tutorials" className="btn btn-outline">
                  « Volver a tutoriales
                </Link>
                
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Descargar PDF
                  </button>
                </div>
              </div>
            </div>
            
            {/* Enlaces a tutoriales relacionados */}
            <div className="mt-12 not-prose">
              <h3 className="text-xl font-semibold mb-6">
                Tutoriales relacionados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SAMPLE_TUTORIALS.filter(
                  t =>
                    t.slug !== tutorial.slug && t.category.id === tutorial.category.id
                )
                  .slice(0, 2)
                  .map(relatedTutorial => (
                    <div key={relatedTutorial.slug} className="card bg-base-200">
                      <div className="card-body p-4">
                        <h4 className="card-title text-base">
                          <Link
                            href={`/tutorials/${relatedTutorial.slug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {relatedTutorial.title}
                          </Link>
                        </h4>
                        <p className="text-sm line-clamp-2">
                          {relatedTutorial.excerpt}
                        </p>
                        <Link
                          href={`/tutorials/${relatedTutorial.slug}`}
                          className="text-sm font-medium text-primary mt-2"
                        >
                          Ver tutorial →
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </article>
        </TutorialLayout>
      )}
    </div>
  );
}
