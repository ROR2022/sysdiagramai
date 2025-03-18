'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TutorialLayout from '../components/tutorials/TutorialLayout';
import TutorialCard from '../components/tutorials/TutorialCard';
import TutorialPagination from '../components/tutorials/TutorialPagination';

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
  {
    slug: 'integracion-continua-diagramas',
    title: 'Integración continua para diagramas de arquitectura',
    excerpt: 'Aprende a incorporar tus diagramas de SysDiagramAI en flujos de CI/CD para mantener la documentación siempre actualizada.',
    coverImage: '/images/tutorials/ci-cd-diagrams.jpg',
    category: { id: 'advanced', name: 'Avanzado' },
    difficulty: 'Avanzado',
    duration: 35,
    updatedDate: '28 Feb 2025',
    content: `
      <h2>Diagramas como código: la nueva frontera</h2>
      <p>Mantener los diagramas actualizados con el código es un desafío común. En este tutorial, aprenderás a utilizar nuestro enfoque "Diagrams as Code" para automatizar este proceso.</p>
      
      <h3>Configurando la API de SysDiagramAI</h3>
      <p>Primero, necesitas configurar acceso programático:</p>
      <ol>
        <li>Genera una API Key desde tu perfil de usuario</li>
        <li>Instala nuestra CLI con npm o pip según tu entorno</li>
        <li>Configura la autenticación en tu sistema de CI/CD</li>
      </ol>
      
      <h3>Definiendo diagramas en formato YAML o JSON</h3>
      <p>Nuestro formato declarativo es potente:</p>
      <pre><code>
      # diagram.yaml
      name: Sistema de Pagos
      version: 1.2.0
      components:
        - name: API Gateway
          type: gateway
          position: {x: 100, y: 100}
        - name: Servicio Autenticación
          type: service
          position: {x: 250, y: 200}
      connections:
        - from: API Gateway
          to: Servicio Autenticación
          type: http
          label: /auth
      </code></pre>
      
      <h3>Integrando con GitHub Actions</h3>
      <p>Ejemplo de workflow para GitHub Actions:</p>
      <pre><code>
      # .github/workflows/update-diagrams.yml
      name: Update System Diagrams
      on:
        push:
          branches: [main]
          paths:
            - 'docs/diagrams/**'
      
      jobs:
        update:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v3
            - name: Update Diagrams
              uses: sysdiagramai/github-action@v1
              with:
                api-key: "${'$'}{{ secrets.SYSDIAGRAM_API_KEY }}"
                diagram-path: 'docs/diagrams/'
      </code></pre>
      
      <h3>Actualizando diagramas automáticamente</h3>
      <p>Estrategias avanzadas:</p>
      <ul>
        <li>Parsear código para detectar cambios en la arquitectura</li>
        <li>Utilizar anotaciones en el código para describir relaciones</li>
        <li>Verificar inconsistencias entre el código y los diagramas</li>
      </ul>
      
      <h2>Casos de uso avanzados</h2>
      <p>Algunas aplicaciones sofisticadas:</p>
      <ul>
        <li>Generar automáticamente diagramas de arquitectura desde repositorios de código</li>
        <li>Crear dashboards que muestren el estado de los servicios en tiempo real</li>
        <li>Integrar con herramientas de monitorización para visualizar problemas</li>
      </ul>
    `
  },
  {
    slug: 'mejores-practicas-diagramas',
    title: 'Mejores prácticas para diagramas de arquitectura efectivos',
    excerpt: 'Consejos y técnicas para crear diagramas de sistemas que sean claros, informativos y útiles para todos los miembros del equipo.',
    coverImage: '/images/tutorials/best-practices.jpg',
    category: { id: 'best-practices', name: 'Mejores Prácticas' },
    difficulty: 'Intermedio',
    duration: 20,
    updatedDate: '15 Feb 2025',
    content: `
      <h2>El arte de los diagramas efectivos</h2>
      <p>Un buen diagrama de arquitectura debe comunicar ideas complejas de forma clara. En este tutorial, exploraremos las mejores prácticas para lograrlo.</p>
      
      <h3>Principio 1: Audiencia y propósito</h3>
      <p>Antes de comenzar, define:</p>
      <ul>
        <li>¿Quién va a utilizar este diagrama?</li>
        <li>¿Qué necesitan entender exactamente?</li>
        <li>¿Qué nivel de detalle es apropiado?</li>
      </ul>
      
      <h3>Principio 2: Niveles de abstracción</h3>
      <p>Utiliza diferentes niveles según necesidad:</p>
      <ol>
        <li>Nivel 1: Visión general del sistema (C4 Context)</li>
        <li>Nivel 2: Contenedores y comunicaciones (C4 Container)</li>
        <li>Nivel 3: Componentes internos (C4 Component)</li>
        <li>Nivel 4: Código y detalles técnicos (C4 Code)</li>
      </ol>
      
      <h3>Principio 3: Consistencia visual</h3>
      <p>Mantén un lenguaje visual coherente:</p>
      <ul>
        <li>Utiliza los mismos símbolos para el mismo tipo de componentes</li>
        <li>Establece una paleta de colores con significado</li>
        <li>Mantén el estilo de conexiones consistente</li>
        <li>Usa plantillas para mantener la coherencia entre diagramas</li>
      </ul>
      
      <h3>Principio 4: Claridad sobre completitud</h3>
      <p>Técnicas para mejorar la claridad:</p>
      <ul>
        <li>Omite detalles no relevantes para el objetivo del diagrama</li>
        <li>Agrupa elementos relacionados</li>
        <li>Utiliza etiquetas claras y concisas</li>
        <li>Añade leyendas explicativas</li>
      </ul>
      
      <h2>Errores comunes a evitar</h2>
      <p>Algunos errores que suelen reducir la efectividad:</p>
      <ul>
        <li>Diagramas sobrecargados con demasiada información</li>
        <li>Falta de jerarquía visual</li>
        <li>Inconsistencia en la simbología</li>
        <li>No actualizar los diagramas cuando el sistema cambia</li>
        <li>Crear un único diagrama para todas las audiencias</li>
      </ul>
    `
  },
  {
    slug: 'diagramacion-sistemas-distribuidos',
    title: 'Diagramación de sistemas distribuidos y alta disponibilidad',
    excerpt: 'Técnicas específicas para representar arquitecturas distribuidas, replicación, zonas de disponibilidad y mecanismos de tolerancia a fallos.',
    coverImage: '/images/tutorials/distributed-systems.jpg',
    category: { id: 'advanced', name: 'Avanzado' },
    difficulty: 'Avanzado',
    duration: 30,
    updatedDate: '5 Feb 2025',
    content: `
      <h2>Representando la complejidad distribuida</h2>
      <p>Los sistemas distribuidos presentan desafíos únicos para la diagramación debido a su naturaleza y patrones específicos.</p>
      
      <h3>Visualizando distribución geográfica</h3>
      <p>Técnicas para representar múltiples ubicaciones:</p>
      <ul>
        <li>Utiliza contenedores específicos para regiones/zonas</li>
        <li>Codifica por colores las diferentes ubicaciones</li>
        <li>Representa latencias y anchos de banda entre ubicaciones</li>
      </ul>
      
      <h3>Patrones de replicación y consenso</h3>
      <p>Visualización de estrategias comunes:</p>
      <ol>
        <li>Replicación activa-pasiva</li>
        <li>Replicación activa-activa</li>
        <li>Consenso distribuido (Raft, Paxos)</li>
        <li>Sincronización eventual vs. fuerte</li>
      </ol>
      
      <h3>Representando particionamiento y sharding</h3>
      <p>Estrategias para visualizar datos distribuidos:</p>
      <ul>
        <li>Indicar estrategias de particionamiento</li>
        <li>Mostrar la distribución de shards</li>
        <li>Representar operaciones cross-shard</li>
      </ul>
      
      <h3>Visualizando tolerancia a fallos</h3>
      <p>Patrones críticos a representar:</p>
      <ul>
        <li>Circuit breakers y sus estados</li>
        <li>Estrategias de fallback</li>
        <li>Detección de fallos</li>
        <li>Auto-recuperación y auto-scaling</li>
      </ul>
      
      <h2>Utilizando las plantillas especializadas</h2>
      <p>SysDiagramAI ofrece plantillas específicas para estos escenarios:</p>
      <ul>
        <li>"High Availability Blueprint": Para sistemas de alta disponibilidad</li>
        <li>"Multi-Region Architecture": Para sistemas multi-región</li>
        <li>"Disaster Recovery Plan": Para visualizar estrategias DR</li>
      </ul>
      
      <p>Recuerda que la claridad debe primar sobre la exhaustividad, incluso en estos sistemas complejos.</p>
    `
  },
  {
    slug: 'diagramas-arquitectura-seguridad',
    title: 'Diagramas de arquitectura de seguridad',
    excerpt: 'Cómo representar aspectos de seguridad en tus diagramas de sistema, incluyendo zonas de confianza, controles y flujo de datos sensibles.',
    coverImage: '/images/tutorials/security-diagrams.jpg',
    category: { id: 'intermediate', name: 'Nivel Intermedio' },
    difficulty: 'Intermedio',
    duration: 25,
    updatedDate: '20 Jan 2025',
    content: `
      <h2>Seguridad visible en la arquitectura</h2>
      <p>Los diagramas de arquitectura son herramientas poderosas para analizar y comunicar aspectos de seguridad. Veamos cómo representarlos efectivamente.</p>
      
      <h3>Modelado de amenazas visual</h3>
      <p>Fundamentos para representar amenazas:</p>
      <ul>
        <li>Identificar límites de confianza (trust boundaries)</li>
        <li>Marcar puntos de entrada al sistema</li>
        <li>Identificar datos sensibles y su flujo</li>
        <li>Resaltar componentes críticos</li>
      </ul>
      
      <h3>Representando controles de seguridad</h3>
      <p>Simbologías efectivas para diversos controles:</p>
      <ol>
        <li>Firewalls y WAFs</li>
        <li>Sistemas de autenticación y autorización</li>
        <li>Cifrado en tránsito y en reposo</li>
        <li>Sistemas de detección/prevención de intrusiones</li>
      </ol>
      
      <h3>Zonas de seguridad y segmentación</h3>
      <p>Visualización de estrategias de segmentación:</p>
      <ul>
        <li>Zonas DMZ y perímetros</li>
        <li>Microsegmentación</li>
        <li>Zero Trust Architecture</li>
        <li>Filtrado de tráfico entre zonas</li>
      </ul>
      
      <h3>Análisis de rutas de ataque</h3>
      <p>Técnicas para visualizar vectores de ataque:</p>
      <ul>
        <li>Marcar rutas de ataque potenciales</li>
        <li>Indicar controles compensatorios</li>
        <li>Señalar puntos de detección</li>
        <li>Resaltar superficies de ataque</li>
      </ul>
      
      <h2>Plantillas de seguridad en SysDiagramAI</h2>
      <p>Utilizando nuestras plantillas especializadas:</p>
      <ul>
        <li>"Threat Model Diagram": Para modelado de amenazas</li>
        <li>"Security Zones Template": Para representar segmentación</li>
        <li>"Data Flow Security": Para análisis de flujos sensibles</li>
      </ul>
      
      <p>Recuerda que estos diagramas pueden contener información sensible, utiliza las opciones de control de acceso para limitarlos a personal autorizado.</p>
    `
  }
];

export default function TutorialsPage() {
  const searchParams = useParams();
  const [filteredTutorials, setFilteredTutorials] = useState(SAMPLE_TUTORIALS);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const tutorialsPerPage = 4;
  
  useEffect(() => {
    // Lógica para filtrar tutoriales basado en parámetros de búsqueda
    if (searchParams.search) {
      if(typeof searchParams.search === 'string'){
        setSearch(searchParams.search);
      }else{
        setSearch(searchParams.search.join(''));
      }
    }
    
    if (searchParams.page) {
      if(typeof searchParams.page === 'string'){
        setPage(parseInt(searchParams.page));
      }else{
        setPage(parseInt(searchParams.page.join('')));
      }
    }
    
    let filtered = [...SAMPLE_TUTORIALS];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(tutorial => 
        tutorial.title.toLowerCase().includes(searchLower) || 
        tutorial.excerpt.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredTutorials(filtered);
    setCurrentPage(page);
  }, [searchParams, search, page]);
  
  // Calcular tutoriales para la página actual
  const indexOfLastTutorial = currentPage * tutorialsPerPage;
  const indexOfFirstTutorial = indexOfLastTutorial - tutorialsPerPage;
  const currentTutorials = filteredTutorials.slice(indexOfFirstTutorial, indexOfLastTutorial);
  const totalPages = Math.ceil(filteredTutorials.length / tutorialsPerPage);
  
  // Construir URL base para paginación
  const baseUrl = search 
    ? `/tutorials?search=${search}` 
    : '/tutorials';
  
  return (
    <div className='bg-base-100 text-base-content'>
      <TutorialLayout>
        {/* Buscador */}
        <div className="mb-8">
          <div className="join w-full max-w-md mx-auto">
            <input 
              type="text" 
              placeholder="Buscar tutoriales..." 
              className="input input-bordered join-item w-full" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button 
              className="btn join-item"
              onClick={() => {
                // En una implementación real, actualizaríamos la URL con el parámetro de búsqueda
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        {filteredTutorials.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">No se encontraron tutoriales</h3>
            <p>Intenta con otra búsqueda o explora nuestras categorías.</p>
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
