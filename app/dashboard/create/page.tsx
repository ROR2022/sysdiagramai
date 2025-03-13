'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SystemRequirementsForm from './components/SystemRequirementsForm';
import { toast } from 'react-hot-toast';
import { FormData } from './components/types';

export default function CreateDiagramPage() {
  const [initialData, setInitialData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const requirementId = searchParams.get('id');
  
  // Cargar datos existentes si hay un ID en la URL
  useEffect(() => {
    if (requirementId) {
      const fetchRequirement = async () => {
        setIsLoading(true);
        setLoadError(null);
        try {
          console.log(`Fetching requirement with ID: ${requirementId}`);
          const response = await fetch(`/api/requirements/${requirementId}`);
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'No se pudo cargar el requisito');
          }
          
          const data = await response.json();
          console.log('Loaded requirement data:', data);
          setInitialData(data);
        } catch (error) {
          console.error('Error al cargar el requisito:', error);
          setLoadError(error instanceof Error ? error.message : 'Error desconocido');
          toast.error('Error al cargar el requisito existente');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchRequirement();
    }
  }, [requirementId]);

  return (
    <div className="w-full text-base-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{requirementId ? 'Editar Diagrama' : 'Crear Nuevo Diagrama'}</h1>
          <p className="text-base-content/70">
            Describe los requisitos de tu sistema para generar un diagrama de arquitectura
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-outline btn-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver al Dashboard
        </Link>
      </div>

      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="mb-6">
            <h2 className="card-title text-xl mb-2">Requisitos del Sistema</h2>
            <p className="text-base-content/70">
              Proporciona información detallada sobre el sistema que deseas diseñar.
              Cuanta más información proporciones, mejores resultados obtendrás.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <span className="loading loading-spinner loading-lg"></span>
              <span className="ml-2">Cargando datos del requisito...</span>
            </div>
          ) : loadError ? (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <h3 className="font-bold">Error al cargar los datos</h3>
                <div className="text-sm">{loadError}</div>
                <button 
                  className="btn btn-sm btn-outline mt-2"
                  onClick={() => window.location.reload()}
                >
                  Intentar de nuevo
                </button>
              </div>
            </div>
          ) : (
            <SystemRequirementsForm 
              initialData={initialData || undefined}
              requirementId={requirementId || undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
