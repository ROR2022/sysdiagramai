'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FormData, SystemRequirementsFormProps } from './types';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

// Importar componentes de sección
import BasicInfoSection from './BasicInfoSection';
import FunctionalRequirementsSection from './FunctionalRequirementsSection';
import NonFunctionalRequirementsSection from './NonFunctionalRequirementsSection';
import TechPreferencesSection from './TechPreferencesSection';
import AdditionalContextSection from './AdditionalContextSection';
import ReviewSection from './ReviewSection';

export default function SystemRequirementsForm({ initialData, onSubmit, requirementId }: SystemRequirementsFormProps = {}) {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Estado para track el paso actual
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Estado para datos del formulario con valores por defecto
  const defaultFormData = useMemo<FormData>(() => ({
    basicInfo: {
      projectName: '',
      description: '',
      applicationType: 'web'
    },
    functionalRequirements: [''],
    nonFunctionalRequirements: {
      scalability: 'medium',
      availability: 'standard',
      security: 'medium',
      performance: 'standard'
    },
    techPreferences: {
      backendLanguage: 'node',
      frameworks: [],
      databases: [],
      architecture: 'monolith'
    },
    additionalContext: ''
  }), []);

  // Inicializar formData con valores por defecto o initialData
  const [formData, setFormData] = useState<FormData>(() => {
    if (!initialData) return defaultFormData;
    
    return {
      basicInfo: {
        ...defaultFormData.basicInfo,
        ...(initialData.basicInfo || {})
      },
      functionalRequirements: initialData.functionalRequirements || defaultFormData.functionalRequirements,
      nonFunctionalRequirements: {
        ...defaultFormData.nonFunctionalRequirements,
        ...(initialData.nonFunctionalRequirements || {})
      },
      techPreferences: {
        ...defaultFormData.techPreferences,
        ...(initialData.techPreferences || {})
      },
      additionalContext: initialData.additionalContext || defaultFormData.additionalContext
    };
  });

  // Efecto para actualizar el estado cuando initialData cambia (por ejemplo, después de una recarga)
  useEffect(() => {
    if (initialData) {
      console.log('Actualizando formData con initialData:', initialData);
      setFormData({
        basicInfo: {
          ...defaultFormData.basicInfo,
          ...(initialData.basicInfo || {})
        },
        functionalRequirements: initialData.functionalRequirements || defaultFormData.functionalRequirements,
        nonFunctionalRequirements: {
          ...defaultFormData.nonFunctionalRequirements,
          ...(initialData.nonFunctionalRequirements || {})
        },
        techPreferences: {
          ...defaultFormData.techPreferences,
          ...(initialData.techPreferences || {})
        },
        additionalContext: initialData.additionalContext || defaultFormData.additionalContext
      });
    }
  }, [initialData]);

  // Función auxiliar para obtener el título del paso
  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1: return "Información Básica";
      case 2: return "Requisitos Funcionales";
      case 3: return "Requisitos No Funcionales";
      case 4: return "Preferencias Tecnológicas";
      case 5: return "Contexto Adicional";
      case 6: return "Revisión";
      default: return "Información Básica";
    }
  };

  // Función para guardar automáticamente, usando useCallback para evitar re-creaciones
  const autoSave = useCallback(async () => {
    // No guardar si no hay un proyecto iniciado o si no hay sesión
    if (!session?.user?.id || !formData.basicInfo.projectName) {
      console.log('No se puede autoguardar:', {
        userId: session?.user?.id,
        hasProjectName: !!formData.basicInfo.projectName
      });
      return;
    }
    
    console.log('Iniciando autoguardado con usuario:', {
      userId: session.user.id,
      email: session.user.email
    });
    
    try {
      setIsSaving(true);
      
      const endpoint = requirementId 
        ? `/api/requirements/${requirementId}` 
        : '/api/requirements';
      
      const method = requirementId ? 'PUT' : 'POST';
      
      console.log(`Enviando solicitud ${method} a ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Error al guardar el formulario');
      }
      
      const savedData = await response.json();
      console.log('Datos guardados:', savedData);
      
      // Si es una creación nueva, actualizar la URL con el ID
      if (!requirementId && savedData._id) {
        console.log(`Actualizando URL con ID: ${savedData._id}`);
        router.replace(`/dashboard/create?id=${savedData._id}`);
      }
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error al autoguardar:', error);
      // No mostrar toast para no molestar al usuario con errores de autoguardado
    } finally {
      setIsSaving(false);
    }
  }, [formData, requirementId, session, router]);

  // Efecto para autoguardar cuando cambia el formulario
  useEffect(() => {
    const timer = setTimeout(() => {
      autoSave();
    }, 5000); // Guardar automáticamente 5 segundos después de cambios
    
    return () => clearTimeout(timer);
  }, [autoSave]);

  // Handlers para actualizar cada sección
  const updateBasicInfo = (data: FormData['basicInfo']) => {
    setFormData(prev => ({
      ...prev,
      basicInfo: data
    }));
  };

  const updateFunctionalRequirements = (data: FormData['functionalRequirements']) => {
    setFormData(prev => ({
      ...prev,
      functionalRequirements: data
    }));
  };

  const updateNonFunctionalRequirements = (data: FormData['nonFunctionalRequirements']) => {
    setFormData(prev => ({
      ...prev,
      nonFunctionalRequirements: data
    }));
  };

  const updateTechPreferences = (data: FormData['techPreferences']) => {
    setFormData(prev => ({
      ...prev,
      techPreferences: data
    }));
  };

  const updateAdditionalContext = (data: FormData['additionalContext']) => {
    setFormData(prev => ({
      ...prev,
      additionalContext: data
    }));
  };

  // Navegación entre pasos
  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
    }
    if (showConfirmation) {
      setShowConfirmation(false);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 6) {
      setCurrentStep(step);
      setShowConfirmation(false);
    }
  };

  // Manejo de envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si no está confirmado, mostrar paso de revisión
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    try {
      setIsSubmitting(true);

      // Si hay una función onSubmit en las props, la ejecutamos
      if (onSubmit) {
        onSubmit(formData);
      } else {
        // Guardar los datos en la base de datos
        const endpoint = requirementId 
          ? `/api/requirements/${requirementId}` 
          : '/api/requirements';
        
        const method = requirementId ? 'PUT' : 'POST';
        
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          throw new Error('Error al guardar el formulario');
        }
        
        // Esperar un momento para simular procesamiento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirigir a la página de resultados cuando esté implementada
        // router.push(`/dashboard/requirements/${data._id}/results`);
      }
      
      setSuccess(true);
      toast.success('¡Requisitos guardados con éxito!');
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      toast.error('Error al guardar los requisitos. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar el paso actual
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoSection data={formData.basicInfo} updateData={updateBasicInfo} />;
      case 2:
        return <FunctionalRequirementsSection data={formData.functionalRequirements} updateData={updateFunctionalRequirements} />;
      case 3:
        return <NonFunctionalRequirementsSection data={formData.nonFunctionalRequirements} updateData={updateNonFunctionalRequirements} />;
      case 4:
        return <TechPreferencesSection data={formData.techPreferences} updateData={updateTechPreferences} />;
      case 5:
        return <AdditionalContextSection data={formData.additionalContext} updateData={updateAdditionalContext} />;
      case 6:
        return <ReviewSection data={formData} onEdit={goToStep} />;
      default:
        return <BasicInfoSection data={formData.basicInfo} updateData={updateBasicInfo} />;
    }
  };

  // Si se completó el envío con éxito
  if (success) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl mb-4">¡Requisitos Enviados con Éxito!</h2>
          <div className="text-success text-5xl mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="mb-4">Tus requisitos han sido procesados y nuestro sistema está generando el diagrama de arquitectura para tu proyecto.</p>
          <p className="mb-6">Recibirás una notificación cuando el diagrama esté listo para ser visualizado.</p>
          <div className="card-actions">
            <button 
              className="btn btn-primary"
              onClick={() => router.push('/dashboard')}
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-2">
          {showConfirmation 
            ? "Revisar y Confirmar" 
            : `Paso ${currentStep}: ${getStepTitle(currentStep)}`
          }
        </h2>
        
        {!showConfirmation && (
          <div className="w-full mb-6">
            <ul className="steps steps-horizontal w-full">
              <li className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}>Información</li>
              <li className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}>Funcional</li>
              <li className={`step ${currentStep >= 3 ? 'step-primary' : ''}`}>No Funcional</li>
              <li className={`step ${currentStep >= 4 ? 'step-primary' : ''}`}>Tecnología</li>
              <li className={`step ${currentStep >= 5 ? 'step-primary' : ''}`}>Contexto</li>
              <li className={`step ${currentStep >= 6 ? 'step-primary' : ''}`}>Revisar</li>
            </ul>
          </div>
        )}
        
        {/* Indicador de guardado automático */}
        {session?.user && (
          <div className="text-xs text-gray-500 mb-2 flex items-center">
            {isSaving ? (
              <>
                <span className="loading loading-spinner loading-xs mr-1"></span>
                Guardando...
              </>
            ) : lastSaved ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Guardado {lastSaved.toLocaleTimeString()}
              </>
            ) : (
              <span>No guardado</span>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {renderStep()}
          
          <div className="flex justify-between mt-6">
            {currentStep > 1 || showConfirmation ? (
              <button 
                type="button" 
                onClick={prevStep}
                className="btn btn-outline"
              >
                {showConfirmation ? "Editar" : "Anterior"}
              </button>
            ) : (
              <div></div> // Placeholder para mantener la alineación
            )}
            
            <button 
              type={currentStep === 6 || showConfirmation ? "submit" : "button"} 
              onClick={currentStep < 6 ? nextStep : undefined}
              className={`btn ${currentStep === 6 || showConfirmation ? 'btn-primary' : 'btn-primary'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Enviando...
                </>
              ) : showConfirmation ? (
                "Confirmar y Enviar"
              ) : currentStep === 6 ? (
                "Revisar"
              ) : (
                "Siguiente"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
