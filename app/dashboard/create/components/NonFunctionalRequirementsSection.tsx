'use client';

import React from 'react';
import { NonFunctionalRequirementsSectionProps } from './types';

export default function NonFunctionalRequirementsSection({ 
  data, 
  updateData 
}: NonFunctionalRequirementsSectionProps) {
  
  const handleChange = (key: string, value: string) => {
    console.log(`Actualizando requisito no funcional ${key}:`, value); // Debug
    updateData({
      ...data,
      [key]: value
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Requisitos No Funcionales</h3>
      <p className="text-sm text-base-content/70 mb-4">
        Especifica los requisitos relacionados con el rendimiento, calidad, seguridad y otros aspectos 
        no directamente funcionales pero cruciales para el éxito del sistema.
      </p>

      {/* Escalabilidad */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">Escalabilidad</span>
        </label>
        <select 
          className="select select-bordered w-full"
          value={data.scalability}
          onChange={(e) => handleChange('scalability', e.target.value)}
        >
          <option value="low">Baja - Sistema con pocos usuarios/transacciones</option>
          <option value="medium">Media - Crecimiento moderado esperado</option>
          <option value="high">Alta - Gran volumen de usuarios/datos</option>
          <option value="very-high">Muy alta - Escalabilidad crítica (millones de usuarios)</option>
        </select>
        <label className="label">
          <span className="label-text-alt">Capacidad del sistema para manejar crecimiento en usuarios o datos</span>
        </label>
      </div>

      {/* Disponibilidad */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">Disponibilidad</span>
        </label>
        <select 
          className="select select-bordered w-full"
          value={data.availability}
          onChange={(e) => handleChange('availability', e.target.value)}
        >
          <option value="standard">Estándar (99% uptime)</option>
          <option value="medium">Alta (99.9% uptime)</option>
          <option value="high">Muy alta (99.99% uptime)</option>
          <option value="critical">Crítica (99.999% uptime)</option>
        </select>
        <label className="label">
          <span className="label-text-alt">Tiempo que el sistema debe estar operativo y accesible</span>
        </label>
      </div>

      {/* Seguridad */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">Seguridad</span>
        </label>
        <select 
          className="select select-bordered w-full"
          value={data.security}
          onChange={(e) => handleChange('security', e.target.value)}
        >
          <option value="basic">Básica - Autenticación simple</option>
          <option value="medium">Media - Autenticación robusta + cifrado</option>
          <option value="high">Alta - Protección avanzada (datos sensibles)</option>
          <option value="very-high">Muy Alta - Máxima seguridad (ej. datos financieros o médicos)</option>
        </select>
        <label className="label">
          <span className="label-text-alt">Nivel de protección requerido contra amenazas y vulnerabilidades</span>
        </label>
      </div>

      {/* Rendimiento */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">Rendimiento</span>
        </label>
        <select 
          className="select select-bordered w-full"
          value={data.performance}
          onChange={(e) => handleChange('performance', e.target.value)}
        >
          <option value="standard">Estándar - Tiempos de respuesta normales</option>
          <option value="medium">Medio - Respuesta rápida importante</option>
          <option value="high">Alto - Bajo tiempo de respuesta crítico</option>
          <option value="real-time">Tiempo real - Respuesta inmediata requerida</option>
        </select>
        <label className="label">
          <span className="label-text-alt">Velocidad y eficiencia con la que el sistema debe operar</span>
        </label>
      </div>
    </div>
  );
}
