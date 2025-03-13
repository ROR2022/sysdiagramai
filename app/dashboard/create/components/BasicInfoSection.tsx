'use client';

import React, { useEffect } from 'react';
import { BasicInfoSectionProps } from './types';

export default function BasicInfoSection({ 
  data, 
  updateData 
}: BasicInfoSectionProps) {
  
  // Añadir un registro de depuración para verificar los datos recibidos
  useEffect(() => {
    console.log('BasicInfoSection recibió datos:', data);
  }, [data]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    updateData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  // Asegurarse de que data existe antes de renderizar
  if (!data) {
    console.error('BasicInfoSection: data es undefined');
    return (
      <div className="alert alert-warning">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <span>Error: No se pudieron cargar los datos del proyecto.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Información Básica</h3>
      <p className="text-sm text-base-content/70 mb-4">
        Comencemos con la información básica sobre tu proyecto.
      </p>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Nombre del Proyecto</span>
        </label>
        <input 
          type="text" 
          name="projectName"
          value={data.projectName || ''}
          onChange={handleChange}
          placeholder="Ej. Sistema de Gestión de Inventario" 
          className="input input-bordered w-full" 
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Tipo de Aplicación</span>
        </label>
        <select 
          className="select select-bordered w-full"
          name="applicationType"
          value={data.applicationType || 'web'}
          onChange={handleChange}
        >
          <option value="web">Aplicación Web</option>
          <option value="mobile">Aplicación Móvil</option>
          <option value="desktop">Aplicación de Escritorio</option>
          <option value="distributed">Sistema Distribuido</option>
          <option value="microservices">Microservicios</option>
          <option value="other">Otro</option>
        </select>
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Descripción del Proyecto</span>
        </label>
        <textarea 
          className="textarea textarea-bordered h-24"
          name="description"
          value={data.description || ''}
          onChange={handleChange}
          placeholder="Describe brevemente el propósito y objetivos de tu sistema..."
        ></textarea>
      </div>
    </div>
  );
}
