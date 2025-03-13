'use client';

import React from 'react';
import { FunctionalRequirementsSectionProps } from './types';

export default function FunctionalRequirementsSection({ 
  data, 
  updateData 
}: FunctionalRequirementsSectionProps) {
  
  const handleChange = (index: number, value: string) => {
    console.log(`Actualizando requisito funcional ${index}:`, value); // Debug
    const updatedRequirements = [...data];
    updatedRequirements[index] = value;
    updateData(updatedRequirements);
  };

  const addRequirement = () => {
    updateData([...data, '']);
  };

  const removeRequirement = (index: number) => {
    const updatedRequirements = data.filter((_, i) => i !== index);
    if (updatedRequirements.length === 0) {
      updateData(['']);
    } else {
      updateData(updatedRequirements);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Requisitos Funcionales</h3>
      <p className="text-sm text-base-content/70 mb-4">
        Lista las funcionalidades clave que debe tener tu sistema. Estas son las características y capacidades 
        principales que los usuarios esperan poder utilizar.
      </p>

      {data.map((requirement, index) => (
        <div key={index} className="flex gap-2 items-start mb-2">
          <div className="form-control flex-1">
            <input
              type="text"
              value={requirement}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder="Ej: Autenticación de usuarios, Gestión de pagos, etc."
              className="input input-bordered w-full"
            />
          </div>
          <button 
            type="button" 
            onClick={() => removeRequirement(index)}
            className="btn btn-square btn-sm btn-ghost text-error"
            disabled={data.length === 1 && !data[0]}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      <button 
        type="button" 
        onClick={addRequirement}
        className="btn btn-outline btn-sm btn-block"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Añadir Requisito Funcional
      </button>

      <div className="p-4 bg-base-200 rounded-lg mt-4">
        <p className="text-sm italic">
          <span className="font-semibold">Ejemplos de requisitos funcionales:</span>
          <br />
          • Sistema de autenticación y gestión de usuarios
          <br />
          • Pasarela de pagos integrada con múltiples métodos
          <br />
          • Panel de administración para gestionar productos
          <br />
          • Sistema de búsqueda avanzada con filtros
          <br />
          • Generación de informes y estadísticas
        </p>
      </div>
    </div>
  );
}
