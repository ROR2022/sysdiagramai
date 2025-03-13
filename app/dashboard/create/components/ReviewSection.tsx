'use client';

import React from 'react';
import { ReviewSectionProps } from './types';

export default function ReviewSection({ data, onEdit }: ReviewSectionProps) {
  const { 
    basicInfo, 
    functionalRequirements, 
    nonFunctionalRequirements, 
    techPreferences, 
    additionalContext 
  } = data;

  // Traducir valores de escalabilidad a texto legible
  const translateScalability = (value: string): string => {
    const scalabilityMap: Record<string, string> = {
      'low': 'Baja - Sistema con pocos usuarios/transacciones',
      'medium': 'Media - Crecimiento moderado esperado',
      'high': 'Alta - Gran volumen de usuarios/datos',
      'very-high': 'Muy alta - Escalabilidad crítica (millones de usuarios)'
    };
    return scalabilityMap[value] || value;
  };

  // Traducir valores de disponibilidad a texto legible
  const translateAvailability = (value: string): string => {
    const availabilityMap: Record<string, string> = {
      'standard': 'Estándar (99% uptime)',
      'medium': 'Alta (99.9% uptime)',
      'high': 'Muy alta (99.99% uptime)',
      'critical': 'Crítica (99.999% uptime)'
    };
    return availabilityMap[value] || value;
  };

  // Traducir valores de seguridad a texto legible
  const translateSecurity = (value: string): string => {
    const securityMap: Record<string, string> = {
      'basic': 'Básica - Autenticación simple',
      'medium': 'Media - Autenticación robusta + cifrado',
      'high': 'Alta - Protección avanzada (datos sensibles)',
      'very-high': 'Muy Alta - Máxima seguridad (ej. datos financieros o médicos)'
    };
    return securityMap[value] || value;
  };

  // Traducir valores de rendimiento a texto legible
  const translatePerformance = (value: string): string => {
    const performanceMap: Record<string, string> = {
      'standard': 'Estándar - Tiempos de respuesta normales',
      'medium': 'Medio - Respuesta rápida importante',
      'high': 'Alto - Bajo tiempo de respuesta crítico',
      'real-time': 'Tiempo real - Respuesta inmediata requerida'
    };
    return performanceMap[value] || value;
  };

  // Traducir tipo de aplicación a texto legible
  const translateApplicationType = (value: string): string => {
    const typeMap: Record<string, string> = {
      'web': 'Aplicación Web',
      'mobile': 'Aplicación Móvil',
      'desktop': 'Aplicación de Escritorio',
      'distributed': 'Sistema Distribuido',
      'microservices': 'Microservicios',
      'other': 'Otro'
    };
    return typeMap[value] || value;
  };

  // Traducir backend language
  const translateBackendLanguage = (value: string): string => {
    const languageMap: Record<string, string> = {
      'node': 'Node.js / JavaScript',
      'python': 'Python',
      'java': 'Java',
      'csharp': 'C# / .NET',
      'php': 'PHP',
      'go': 'Go',
      'ruby': 'Ruby',
      'rust': 'Rust',
      'any': 'Sin preferencia'
    };
    return languageMap[value] || value;
  };

  // Traducir arquitectura
  const translateArchitecture = (value: string): string => {
    const architectureMap: Record<string, string> = {
      'monolith': 'Monolítica',
      'microservices': 'Microservicios',
      'serverless': 'Serverless',
      'hybrid': 'Híbrida',
      'any': 'Sin preferencia'
    };
    return architectureMap[value] || value;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Revisa tus Requisitos</h3>
      <p className="text-sm text-base-content/70 mb-4">
        Por favor revisa la información que has proporcionado. Si necesitas hacer cambios, puedes volver a cualquier sección.
      </p>

      {/* Sección 1: Información Básica */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h4 className="card-title text-base">Información Básica</h4>
            <button 
              type="button" 
              onClick={() => onEdit(1)}
              className="btn btn-sm btn-outline"
            >
              Editar
            </button>
          </div>
          <div className="divider my-1"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Nombre del Proyecto:</span>
              <p>{basicInfo.projectName || 'No especificado'}</p>
            </div>
            <div>
              <span className="font-medium">Tipo de Aplicación:</span>
              <p>{translateApplicationType(basicInfo.applicationType)}</p>
            </div>
          </div>
          <div className="mt-2">
            <span className="font-medium">Descripción:</span>
            <p className="mt-1">{basicInfo.description || 'No hay descripción'}</p>
          </div>
        </div>
      </div>

      {/* Sección 2: Requisitos Funcionales */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h4 className="card-title text-base">Requisitos Funcionales</h4>
            <button 
              type="button" 
              onClick={() => onEdit(2)}
              className="btn btn-sm btn-outline"
            >
              Editar
            </button>
          </div>
          <div className="divider my-1"></div>
          <ul className="list-disc list-inside">
            {functionalRequirements.length > 0 ? (
              functionalRequirements.map((req, index) => (
                <li key={index} className={req.trim() ? '' : 'text-base-content/50 italic'}>
                  {req.trim() || 'No especificado'}
                </li>
              ))
            ) : (
              <li className="text-base-content/50 italic">No se han especificado requisitos funcionales</li>
            )}
          </ul>
        </div>
      </div>

      {/* Sección 3: Requisitos No Funcionales */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h4 className="card-title text-base">Requisitos No Funcionales</h4>
            <button 
              type="button" 
              onClick={() => onEdit(3)}
              className="btn btn-sm btn-outline"
            >
              Editar
            </button>
          </div>
          <div className="divider my-1"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Escalabilidad:</span>
              <p>{translateScalability(nonFunctionalRequirements.scalability)}</p>
            </div>
            <div>
              <span className="font-medium">Disponibilidad:</span>
              <p>{translateAvailability(nonFunctionalRequirements.availability)}</p>
            </div>
            <div>
              <span className="font-medium">Seguridad:</span>
              <p>{translateSecurity(nonFunctionalRequirements.security)}</p>
            </div>
            <div>
              <span className="font-medium">Rendimiento:</span>
              <p>{translatePerformance(nonFunctionalRequirements.performance)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección 4: Preferencias Tecnológicas */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h4 className="card-title text-base">Preferencias Tecnológicas</h4>
            <button 
              type="button" 
              onClick={() => onEdit(4)}
              className="btn btn-sm btn-outline"
            >
              Editar
            </button>
          </div>
          <div className="divider my-1"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Backend Principal:</span>
              <p>{translateBackendLanguage(techPreferences.backendLanguage)}</p>
            </div>
            <div>
              <span className="font-medium">Arquitectura:</span>
              <p>{translateArchitecture(techPreferences.architecture)}</p>
            </div>
          </div>
          <div className="mt-3">
            <span className="font-medium">Frameworks/Librerías:</span>
            {techPreferences.frameworks && techPreferences.frameworks.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {techPreferences.frameworks.map((framework, index) => (
                  <span key={index} className="badge badge-primary">{framework}</span>
                ))}
              </div>
            ) : (
              <p className="text-base-content/50 italic mt-1">No se han seleccionado frameworks</p>
            )}
          </div>
          <div className="mt-3">
            <span className="font-medium">Bases de Datos:</span>
            {techPreferences.databases && techPreferences.databases.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {techPreferences.databases.map((db, index) => (
                  <span key={index} className="badge badge-primary">{db}</span>
                ))}
              </div>
            ) : (
              <p className="text-base-content/50 italic mt-1">No se han seleccionado bases de datos</p>
            )}
          </div>
        </div>
      </div>

      {/* Sección 5: Contexto Adicional */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h4 className="card-title text-base">Contexto Adicional</h4>
            <button 
              type="button" 
              onClick={() => onEdit(5)}
              className="btn btn-sm btn-outline"
            >
              Editar
            </button>
          </div>
          <div className="divider my-1"></div>
          <div>
            {additionalContext ? (
              <p className="whitespace-pre-line">{additionalContext}</p>
            ) : (
              <p className="text-base-content/50 italic">No se ha proporcionado contexto adicional</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-base-300 rounded-lg">
        <p className="text-sm">
          <span className="font-semibold">Nota:</span> Al confirmar, nuestro sistema utilizará la información proporcionada para generar un diagrama de sistema adaptado a tus requisitos. Este proceso puede tardar unos minutos.
        </p>
      </div>
    </div>
  );
}
