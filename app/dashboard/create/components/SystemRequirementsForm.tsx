'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef, Suspense } from 'react';
import { FormData, SystemRequirementsFormProps } from './types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { ISystemRequirement } from '@/libs/models/systemRequirement';

// Importar componentes de sección
import BasicInfoSection from './BasicInfoSection';
import FunctionalRequirementsSection from './FunctionalRequirementsSection';
import NonFunctionalRequirementsSection from './NonFunctionalRequirementsSection';
import TechPreferencesSection from './TechPreferencesSection';
import AdditionalContextSection from './AdditionalContextSection';
import ReviewSection from './ReviewSection';

const GetSearchParams = ({setRequirementId}: {setRequirementId: (id: string) => void}) => {
  const searchParams = useSearchParams();
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      console.log(`Detectado requirementId de searchParams: ${id}`);
      setRequirementId(id);
    }
  }, [searchParams, setRequirementId]);
  return null;
}

export default function SystemRequirementsForm({ initialData, onSubmit }: SystemRequirementsFormProps = {}) {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Estado para track el paso actual
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Estado para el requirementId
  const [requirementId, setRequirementId] = useState<string | undefined>(
    // El initialData podría venir de la API y tener un _id
    (initialData as ISystemRequirement)?._id
  );
  
  // Estado para rastrear si acaba de crearse un nuevo requisito
  const [newRequirementCreated, setNewRequirementCreated] = useState(false);

  // Efecto para detectar y actualizar requirementId de initialData cuando cambia
  useEffect(() => {
    const id = (initialData as ISystemRequirement)?._id;
    if (id) {
      console.log(`Detectado requirementId de initialData: ${id}`);
      setRequirementId(id);
    }
  }, [initialData]);

  // Referencias para control de autoguardado inteligente
  const lastSavedDataRef = useRef<string>('');
  const lastChangeTimeRef = useRef<number>(Date.now());
  const userActiveRef = useRef<boolean>(true);
  const initialFormDataRef = useRef<string>('');
  const initialLoadCompleteRef = useRef<boolean>(false);
  const operationInProgressRef = useRef<boolean>(false);

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
        ...(initialData.basicInfo || {}),
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
      const updatedFormData = {
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
      
      setFormData(updatedFormData);
      
      // Guardar el estado inicial para comparaciones futuras
      initialFormDataRef.current = JSON.stringify(updatedFormData);
      console.log('Estado inicial del formulario guardado para comparaciones');
      
      // Si tenemos datos iniciales y un ID, marcar la carga inicial como completa
      if (requirementId && requirementId.trim() !== '') {
        console.log(`Carga inicial completada con ID: ${requirementId}`);
        initialLoadCompleteRef.current = true;
      }
    }
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [initialData, requirementId]);

  // Efecto para marcar la carga inicial como completa cuando tenemos requirementId
  useEffect(() => {
    if (requirementId && requirementId.trim() !== '') {
      console.log(`ID de requisito establecido: ${requirementId}`);
      // Dar tiempo para que se carguen los datos iniciales antes de permitir autoguardado
      const timer = setTimeout(() => {
        initialLoadCompleteRef.current = true;
        console.log('Carga inicial marcada como completa, autoguardado habilitado');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [requirementId]);

  // Nuevo efecto para avanzar al siguiente paso cuando se crea un nuevo requisito
  useEffect(() => {
    if (newRequirementCreated && requirementId && requirementId.trim() !== '') {
      console.log(`Nuevo requisito creado con ID: ${requirementId}, avanzando al siguiente paso...`);
      
      // Avanzar al siguiente paso
      setCurrentStep(prevStep => prevStep + 1);
      
      // Resetear el flag
      setNewRequirementCreated(false);
      
      // Mostrar confirmación solo después de que el estado se haya actualizado
      toast.success("Requisito creado correctamente");
      //console.log("Requisito creado correctamente...", currentStep);
    }
  }, [newRequirementCreated, requirementId]);

  // Efecto para registrar cambios en currentStep
  useEffect(() => {
    console.log(`[DEBUG] currentStep actualizado a: ${currentStep}`);
    if(currentStep === 1 && newRequirementCreated) {
      console.log("Requisito creado correctamente...", currentStep);
      setCurrentStep(2);
    }
  }, [currentStep, newRequirementCreated]);

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

  // Función para convertir formData (estructura anidada) al formato plano para el servidor
  const convertToServerFormat = useCallback((formData: FormData) => {
    return {
      userId: session?.user?.id,
      name: formData.basicInfo.projectName,
      description: formData.basicInfo.description,
      applicationType: formData.basicInfo.applicationType,
      functionalRequirements: formData.functionalRequirements,
      nonFunctionalRequirements: formData.nonFunctionalRequirements,
      techPreferences: formData.techPreferences,
      additionalContext: formData.additionalContext,
      status: "draft" as const
    };
  }, [session?.user?.id]);

  // Función para verificar si el formulario ha cambiado realmente
  const hasFormChanged = useCallback(() => {
    const currentFormData = JSON.stringify(formData);
    
    // Si no hay datos guardados previamente, comparar con el estado inicial
    if (!lastSavedDataRef.current) {
      // Si tampoco hay estado inicial, considerar que ha cambiado
      if (!initialFormDataRef.current) return true;
      
      // Comparar con el estado inicial
      const hasChanged = currentFormData !== initialFormDataRef.current;
      if (!hasChanged) {
        console.log('No hay cambios respecto al estado inicial');
      }
      return hasChanged;
    }
    
    // Comparar con los últimos datos guardados
    const hasChanged = currentFormData !== lastSavedDataRef.current;
    if (!hasChanged) {
      console.log('No hay cambios respecto a la última versión guardada');
    }
    return hasChanged;
  }, [formData]);

  // Función para guardar automáticamente
  const autoSave = useCallback(async () => {
    // No guardar si la carga inicial no ha completado
    if (!initialLoadCompleteRef.current) {
      console.log("Autoguardado omitido: carga inicial no completada");
      return Promise.resolve(null);
    }
    
    // No guardar si hay una operación en progreso
    if (operationInProgressRef.current) {
      console.log("Autoguardado omitido: operación en progreso");
      return Promise.resolve(null);
    }
    
    // No guardar si no hay cambios o si está en proceso de guardado
    if (!hasFormChanged() || isSaving) {
      console.log("Autoguardado omitido: No hay cambios o ya está guardando");
      return Promise.resolve(null);
    }

    console.log("Iniciando autoguardado...", requirementId ? "ACTUALIZANDO" : "CREANDO");
    console.log("requirementId actual:", requirementId);
    
    // Marcar operación en progreso
    operationInProgressRef.current = true;
    setIsSaving(true);

    // Convertir a formato plano para el servidor
    const serverData = convertToServerFormat(formData);
    console.log('Datos para autoguardado:', serverData);

    try {
      const endpoint = requirementId && requirementId.trim() !== '' 
        ? `/api/requirements/${requirementId}` 
        : '/api/requirements';
      
      const method = requirementId && requirementId.trim() !== '' ? 'PUT' : 'POST';

      console.log(`Enviando solicitud ${method} a ${endpoint}`);
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverData),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      // Si es una creación nueva, actualizar la URL con el ID
      if ((!requirementId || requirementId.trim() === '') && data._id) {
        console.log(`Actualizando URL con ID: ${data._id}`);
        setRequirementId(data._id);
        // Usar history.replaceState en lugar de router.replace para evitar recarga
        window.history.replaceState({}, '', `/dashboard/create?id=${data._id}`);
        console.log(`URL actualizada sin recarga usando history API: /dashboard/create?id=${data._id}`);
      }

      // Actualizar la referencia de datos guardados
      lastSavedDataRef.current = JSON.stringify(formData);
      lastChangeTimeRef.current = Date.now();
      setLastSaved(new Date());

      // Mostrar feedback al usuario
      toast.success("Cambios guardados correctamente");

      // Desmarcar operación en progreso
      operationInProgressRef.current = false;
      setIsSaving(false);
      
      // Devolver los datos para que puedan ser usados por otras funciones
      return data;
    } catch (error) {
      console.error('Error durante el autoguardado:', error);
      toast.error('Error al guardar los cambios');
      operationInProgressRef.current = false;
      setIsSaving(false);
      return null;
    }
  }, [formData, requirementId, hasFormChanged, isSaving, convertToServerFormat]);

  // Resetear el timer de inactividad cuando el usuario interactúa
  const resetInactivityTimer = useCallback(() => {
    lastChangeTimeRef.current = Date.now();
    userActiveRef.current = true;
  }, []);

  // Efecto para detectar actividad del usuario
  useEffect(() => {
    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    // Añadir event listeners para detectar actividad
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    return () => {
      // Limpiar event listeners
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, [resetInactivityTimer]);

  // Efecto para autoguardar cuando cambia el formulario con frecuencia variable
  useEffect(() => {
    // Actualizar tiempo de último cambio
    lastChangeTimeRef.current = Date.now();
    
    // Determinar el tiempo de espera basado en la actividad del usuario
    const autoSaveDelay = userActiveRef.current ? 5000 : 15000; // 5 segundos si está activo, 15 si no
    
    const timer = setTimeout(() => {
      autoSave();
    }, autoSaveDelay);
    
    return () => clearTimeout(timer);
  }, [autoSave, formData]);

  // Marcar cambios iniciales cuando se carga la página
  useEffect(() => {
    if (initialData) {
      lastSavedDataRef.current = JSON.stringify(formData);
    }
  }, [initialData, formData]);

  // Handlers para actualizar cada sección
  const updateBasicInfo = (data: FormData['basicInfo']) => {
    resetInactivityTimer();
    setFormData(prev => ({
      ...prev,
      basicInfo: data
    }));
  };

  const updateFunctionalRequirements = (data: FormData['functionalRequirements']) => {
    resetInactivityTimer();
    setFormData(prev => ({
      ...prev,
      functionalRequirements: data
    }));
  };

  const updateNonFunctionalRequirements = (data: FormData['nonFunctionalRequirements']) => {
    resetInactivityTimer();
    setFormData(prev => ({
      ...prev,
      nonFunctionalRequirements: data
    }));
  };

  const updateTechPreferences = (data: FormData['techPreferences']) => {
    resetInactivityTimer();
    setFormData(prev => ({
      ...prev,
      techPreferences: data
    }));
  };

  const updateAdditionalContext = (data: FormData['additionalContext']) => {
    resetInactivityTimer();
    setFormData(prev => ({
      ...prev,
      additionalContext: data
    }));
  };

  // Función para avanzar al siguiente paso
  const nextStep = async () => {
    // Si estamos en el paso 1, aseguremos que los datos estén guardados antes de avanzar
    console.log("..... comienza el nextStep ....");
    console.log("currentStep:", currentStep);
    if (currentStep === 1) {
      console.log("Guardando datos antes de avanzar...");
      setIsSaving(true);
      
      try {
        const serverData = convertToServerFormat(formData);
        
        
        // Determinar si es una creación o actualización
        const isNewRequirement = !requirementId || requirementId.trim() === '';
        console.log("isNewRequirement:", isNewRequirement, requirementId);
        
        console.log(`Operación: ${isNewRequirement ? 'CREAR NUEVO' : 'ACTUALIZAR EXISTENTE'} requisito`);
        console.log(`requirementId actual: ${requirementId || 'ninguno'}`);
        
        // Determinar endpoint y método según si tenemos ID o no
        const endpoint = isNewRequirement 
          ? '/api/requirements' 
          : `/api/requirements/${requirementId}`;
        
        const method = isNewRequirement ? 'POST' : 'PUT';
        
        console.log(`Enviando solicitud ${method} a ${endpoint}`);
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(serverData),
        });
        
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        
        const responseData = await response.json();
        console.log(`Respuesta del servidor (${method}):`, responseData);
        
        // Actualizar referencias de datos guardados
        lastSavedDataRef.current = JSON.stringify(formData);
        setLastSaved(new Date());
        
        // Si es nuevo, necesitamos el ID para continuar
        if (isNewRequirement) {
          if (!responseData || !responseData._id) {
            throw new Error("No se recibió un ID válido del servidor");
          }
          
          // Actualizar estado con el nuevo ID
          const newId = responseData._id;
          console.log(`Nuevo ID obtenido: ${newId}, actualizando estado...`);
          
          // Actualizar estado local
          setRequirementId(newId);
          
          // Actualizar la URL sin recargar
          window.history.replaceState({}, '', `/dashboard/create?id=${newId}`);
          
          // Marcar que se ha creado un nuevo requisito (esto activará el useEffect)
          setNewRequirementCreated(true);
          
          // Ya no avanzamos el paso aquí, lo hará el useEffect cuando detecte el cambio
          console.log(`Esperando a que el efecto detecte el nuevo requisito y avance al siguiente paso...`);
        } else {
          // Para requisitos existentes, simplemente avanzamos al siguiente paso
          console.log(`Avanzando paso ${currentStep} → ${currentStep + 1}`);
          setCurrentStep(prevStep => prevStep + 1);
          
          // Mostrar confirmación
          toast.success("Cambios guardados correctamente");
        }
        
      } catch (error) {
        console.error("Error al guardar datos:", error);
        toast.error("Error al guardar. Por favor intenta nuevamente.");
      } finally {
        setIsSaving(false);
      }
    } else {
      // Para otros pasos, simplemente avanzar
      console.log(`Avanzando paso ${currentStep} → ${currentStep + 1}`);
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
        const endpoint = requirementId && requirementId.trim() !== '' 
          ? `/api/requirements/${requirementId}` 
          : '/api/requirements';
        
        const method = requirementId && requirementId.trim() !== '' ? 'PUT' : 'POST';
        
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
      // Actualizar referencia de últimos datos guardados
      lastSavedDataRef.current = JSON.stringify(formData);
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

  // Si se completó con éxito, mostrar mensaje y redireccionar
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <div className="bg-success/20 p-4 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2">¡Requisitos Guardados!</h3>
        <p className="mb-6 max-w-md">
          Tus requisitos han sido guardados exitosamente. Ahora puedes generar diagramas o seguir editando.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard/requirements')}
            className="btn btn-primary"
          >
            Ver Mis Requisitos
          </button>
          <button
            onClick={() => {
              setSuccess(false);
              setCurrentStep(1);
            }}
            className="btn btn-outline"
          >
            Seguir Editando
          </button>
        </div>
      </div>
    );
  }

  // Renderizar el formulario
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <GetSearchParams setRequirementId={setRequirementId} />
      </Suspense>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Indicador de pasos */}
      <div className="w-full">
        <ul className="steps steps-horizontal w-full">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <li 
              key={step}
              className={`step cursor-pointer ${step <= currentStep ? 'step-primary' : ''}`}
              onClick={() => goToStep(step)}
            >
              {getStepTitle(step)}
            </li>
          ))}
        </ul>
      </div>

      {/* Contenido del paso actual */}
      <div className="min-h-[400px] py-4">
        {renderStep()}
      </div>

      {/* Indicador de autoguardado */}
      <div className="flex items-center justify-end text-sm text-base-content/60">
        {isSaving ? (
          <span className="flex items-center">
            <span className="loading loading-spinner loading-xs mr-2"></span>
            Guardando...
          </span>
        ) : lastSaved ? (
          <span>
            Último guardado: {lastSaved.toLocaleTimeString()}
          </span>
        ) : null}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between">
        <button 
          type="button" 
          onClick={prevStep}
          className="btn"
          disabled={currentStep === 1}
        >
          Anterior
        </button>
        
        <button 
          type={currentStep === 6 || showConfirmation ? "submit" : "button"} 
          onClick={currentStep < 6 ? nextStep : undefined}
          className={`btn ${currentStep === 6 || showConfirmation ? 'btn-primary' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Guardando...
            </>
          ) :(currentStep===1 && !requirementId) ? (
            'Crear Requisito'
          ) : currentStep < 6 ? (
            'Siguiente'
          ) : showConfirmation ? (
            'Confirmar y Guardar'
          ) : (
            'Revisar y Guardar'
          )}
        </button>
      </div>

      {/* Footer con ayuda */}
      <div className="text-center text-sm text-base-content/70 pt-6 border-t">
        ¿Necesitas ayuda? Ponte en contacto con nosotros en <a href="mailto:kodeandoando2023@gmail.com" className="link link-primary">kodeandoando2023@gmail.com</a>
      </div>
    </form>
    </div>
  );
}