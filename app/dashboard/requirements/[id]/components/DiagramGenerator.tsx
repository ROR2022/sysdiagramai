'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface DiagramGeneratorProps {
  requirementId: string;
  status: string;
  hasDiagrams: boolean;
}

interface GenerationStatusResponse {
  requirementId: string;
  status: string;
  startTime?: string;
  endTime?: string;
  progress?: number;
  error?: string;
  recentLogs?: Array<{
    timestamp: string;
    message: string;
    level: "info" | "warn" | "error";
  }>;
}

export default function DiagramGenerator({ 
  requirementId, 
  status, 
  hasDiagrams 
}: DiagramGeneratorProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(status === 'generating');
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [lastLog, setLastLog] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  // Determinar si el botón debe estar deshabilitado
  const isButtonDisabled = isGenerating || status === 'generating';

  // Función para consultar el estado de generación
  const checkGenerationStatus = async () => {
    try {
      console.log(`Consultando estado para el requisito: ${requirementId}`);
      const response = await fetch(`/api/diagrams/status?requirementId=${requirementId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // No hay información de estado, pero podría estar generándose
          // Si el estado del sistema es "generating", continuamos el polling
          console.log('No se encontró información de estado, pero el requisito está en generación');
          if (status === 'generating') {
            setIsGenerating(true);
            setLastLog('Iniciando proceso de generación...');
            return;
          } else {
            // Si no está en generación, detener el polling
            setIsGenerating(false);
            clearPollingInterval();
            return;
          }
        }
        const error = await response.json();
        throw new Error(error.error || 'Error al consultar estado de generación');
      }
      
      const statusData: GenerationStatusResponse = await response.json();
      console.log('Estado de generación recibido:', statusData);
      
      // Actualizar información mostrada al usuario
      if (statusData.progress !== undefined) {
        setProgress(statusData.progress);
      }
      
      if (statusData.error) {
        setError(statusData.error);
        toast.error('Error en la generación: ' + statusData.error);
        setIsGenerating(false);
        clearPollingInterval();
      }
      
      // Mostrar el log más reciente
      if (statusData.recentLogs && statusData.recentLogs.length > 0) {
        const latestLog = statusData.recentLogs[statusData.recentLogs.length - 1];
        setLastLog(latestLog.message);
        
        // Si el nivel es error, mostrarlo como notificación
        if (latestLog.level === 'error') {
          toast.error(latestLog.message);
        }
      }
      
      // Actualizar estado de generación
      if (statusData.status === 'completed') {
        setIsGenerating(false);
        toast.success('¡Diagramas generados correctamente!');
        clearPollingInterval();
        router.refresh();
      } else if (statusData.status === 'failed' || statusData.status === 'timeout') {
        setIsGenerating(false);
        toast.error('Error en la generación de diagramas');
        clearPollingInterval();
      } else if (statusData.status === 'in_progress') {
        setIsGenerating(true);
      }
      
    } catch (error) {
      console.error('Error al consultar estado:', error);
      // No mostramos error al usuario aquí, solo lo registramos
    }
  };
  
  // Limpiar el intervalo de polling
  const clearPollingInterval = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  // Efecto para iniciar el polling cuando se está generando
  useEffect(() => {
    if (isGenerating && !pollingInterval) {
      // Verificar inmediatamente
      checkGenerationStatus();
      
      // Iniciar polling cada 5 segundos
      const interval = setInterval(checkGenerationStatus, 5000);
      setPollingInterval(interval);
    }
    
    // Limpiar intervalo al desmontar el componente
    return () => clearPollingInterval();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenerating, requirementId]);

  // Función para generar diagramas
  const generateDiagrams = async () => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      setError(null);
      setProgress(0);
      setLastLog('Iniciando generación de diagramas...');
      toast.loading('Iniciando generación de diagramas...', { id: 'generating-diagrams' });
      
      // Inicializar el estado de generación antes de comenzar
      try {
        await fetch('/api/diagrams/status/init', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ requirementId }),
        });
        console.log('Estado de generación inicializado');
      } catch (initError) {
        console.error('Error al inicializar estado:', initError);
        // Continuamos con el proceso aunque haya un error aquí
      }
      
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
      
      const data = await response.json();
      console.log("data generacion de diagramas iniciada...", data);
      toast.success('Generación iniciada correctamente', { id: 'generating-diagrams' });
      
      // Iniciar el polling para revisar el estado
      if (!pollingInterval) {
        checkGenerationStatus();
        const interval = setInterval(checkGenerationStatus, 5000);
        setPollingInterval(interval);
      }
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al generar diagramas';
      setError(errorMessage);
      toast.error(errorMessage, { id: 'generating-diagrams' });
      console.error('Error al generar diagramas:', error);
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
        <div className="mt-6">
          {/* Indicador de progreso */}
          <div className="w-full bg-base-300 rounded-full h-2.5 mb-4">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Mensaje de estado */}
          <div className="bg-info/10 text-info p-4 rounded-box flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium">
                La generación de diagramas está en progreso...
              </p>
              <p className="text-xs mt-1 opacity-90">
                {lastLog || "Procesando requisitos y generando diagramas..."}
              </p>
              <p className="text-xs mt-2">
                Este proceso puede tardar hasta un minuto. La página se actualizará automáticamente cuando los diagramas estén listos.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && !isGenerating && (
        <div className="mt-6 bg-error/10 text-error p-4 rounded-box flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium">
              Error en la generación de diagramas
            </p>
            <p className="text-xs mt-1">
              {error}
            </p>
            <button 
              className="btn btn-xs btn-error mt-2"
              onClick={generateDiagrams}
            >
              Reintentar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
