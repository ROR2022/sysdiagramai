'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface DiagramGeneratorProps {
  requirementId: string;
  status: string;
  hasDiagrams: boolean;
}

export default function DiagramGenerator({ 
  requirementId, 
  status, 
  hasDiagrams 
}: DiagramGeneratorProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(status === 'generating');
  
  // Determinar si el botón debe estar deshabilitado
  const isButtonDisabled = isGenerating || status === 'generating';

  // Función para generar diagramas
  const generateDiagrams = async () => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      toast.loading('Generando diagramas...', { id: 'generating-diagrams' });
      
      const response = await fetch('/api/diagrams/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requirementId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al generar diagramas');
      }
      
      await response.json(); // Consumir el cuerpo de la respuesta sin asignarlo a una variable
      toast.success('Diagramas generados exitosamente', { id: 'generating-diagrams' });
      
      // Actualizar la página para mostrar los diagramas generados
      router.refresh();
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al generar diagramas';
      toast.error(errorMessage, { id: 'generating-diagrams' });
      console.error('Error al generar diagramas:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-base-200 text-base-content p-6 rounded-box shadow">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Diagramas del Sistema</h2>
          <p className="text-sm opacity-70">
            {hasDiagrams 
              ? 'Esta es una visualización de la arquitectura basada en los requisitos.'
              : 'Genera diagramas de arquitectura basados en los requisitos especificados.'}
          </p>
        </div>
        
        <div className="flex gap-2">
          {hasDiagrams && (
            <button 
              className="btn btn-outline"
              onClick={() => router.refresh()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Actualizar
            </button>
          )}

          <button 
            className={`btn ${isButtonDisabled ? 'btn-disabled' : 'btn-primary'} gap-2`}
            onClick={generateDiagrams}
            disabled={isButtonDisabled}
          >
            {isGenerating ? (
              <>
                <span className="loading loading-spinner"></span>
                Generando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {hasDiagrams ? 'Regenerar Diagramas' : 'Generar Diagramas'}
              </>
            )}
          </button>
        </div>
      </div>
      
      {isGenerating && (
        <div className="mt-6 bg-info/10 text-info p-4 rounded-box flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm">
            La generación de diagramas puede tomar hasta 30 segundos. Por favor, espera mientras procesamos tu solicitud.
          </p>
        </div>
      )}
    </div>
  );
}
