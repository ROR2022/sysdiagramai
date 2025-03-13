'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DiagramContent } from '@/libs/models/systemRequirement';

interface DiagramViewerProps {
  diagramUrls: string[];
  diagrams?: DiagramContent[];
  requirementId?: string;
}

export default function DiagramViewer({ diagramUrls, diagrams, requirementId }: DiagramViewerProps) {
  const [activeDiagramIndex, setActiveDiagramIndex] = useState(0);
  const [diagramContent, setDiagramContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [fullDiagrams, setFullDiagrams] = useState<DiagramContent[] | null>(null);

  // Cargar los diagramas completos desde la API si no se proporcionaron como prop
  useEffect(() => {
    async function fetchDiagramsFromAPI() {
      if (diagrams) {
        // Si ya tenemos los diagramas como prop, usarlos directamente
        setFullDiagrams(diagrams);
        return;
      }
      
      if (!requirementId) return;
      
      try {
        const response = await fetch(`/api/diagrams/${requirementId}`);
        if (!response.ok) {
          throw new Error('Error al cargar los diagramas');
        }
        
        const data = await response.json();
        if (data.diagrams && Array.isArray(data.diagrams)) {
          setFullDiagrams(data.diagrams);
        }
      } catch (error) {
        console.error('Error al cargar los diagramas desde la API:', error);
      }
    }
    
    fetchDiagramsFromAPI();
  }, [diagrams, requirementId]);

  // Cargar el contenido del diagrama activo
  useEffect(() => {
    async function loadDiagramContent() {
      if (diagramUrls.length === 0) return;
      
      try {
        setIsLoading(true);
        
        // Si tenemos los diagramas completos, usar el contenido directamente
        if (fullDiagrams && fullDiagrams.length > activeDiagramIndex) {
          const diagram = fullDiagrams[activeDiagramIndex];
          // Construir un contenido Markdown completo con título, descripción, diagrama y explicación
          const content = `# ${diagram.title}

${diagram.description}

${diagram.diagramText}

## Explicación
${diagram.explanation}`;
          
          setDiagramContent(content);
          setIsLoading(false);
          return;
        }
        
        // Si no tenemos los diagramas completos, cargar desde la URL
        const url = diagramUrls[activeDiagramIndex];
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Error al cargar el diagrama');
        }
        
        const content = await response.text();
        setDiagramContent(content);
      } catch (error) {
        console.error('Error al cargar el diagrama:', error);
        setDiagramContent('Error al cargar el diagrama. Por favor, intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDiagramContent();
  }, [diagramUrls, activeDiagramIndex, fullDiagrams]);

  // Cambiar al diagrama anterior
  const goToPreviousDiagram = () => {
    if (activeDiagramIndex > 0) {
      setActiveDiagramIndex(activeDiagramIndex - 1);
    }
  };

  // Cambiar al diagrama siguiente
  const goToNextDiagram = () => {
    if (activeDiagramIndex < diagramUrls.length - 1) {
      setActiveDiagramIndex(activeDiagramIndex + 1);
    }
  };

  // Si no hay diagramas, no renderizar nada
  if (diagramUrls.length === 0) return null;

  // Obtener el título del diagrama actual
  const getCurrentDiagramTitle = () => {
    if (fullDiagrams && fullDiagrams.length > activeDiagramIndex) {
      return fullDiagrams[activeDiagramIndex].title;
    }
    return `Diagrama ${activeDiagramIndex + 1}`;
  };

  return (
    <div className="bg-base-200 text-base-content p-6 rounded-box shadow">
      {/* Navegación entre diagramas */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {getCurrentDiagramTitle()} ({activeDiagramIndex + 1} de {diagramUrls.length})
        </h2>
        
        <div className="flex gap-2">
          <button 
            className="btn btn-sm btn-outline"
            onClick={goToPreviousDiagram}
            disabled={activeDiagramIndex === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button 
            className="btn btn-sm btn-outline"
            onClick={goToNextDiagram}
            disabled={activeDiagramIndex === diagramUrls.length - 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Contenido del diagrama */}
      <div className="bg-base-100 p-6 rounded-box">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <article className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {diagramContent}
            </ReactMarkdown>
          </article>
        )}
      </div>
      
      {/* Botones de acción */}
      <div className="flex justify-end mt-4 gap-2">
        <button 
          className="btn btn-sm btn-outline"
          onClick={() => {
            // Crear un blob con el contenido y descargarlo
            const blob = new Blob([diagramContent], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `diagrama_${activeDiagramIndex + 1}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        >
          Descargar Markdown
        </button>
      </div>
    </div>
  );
}
