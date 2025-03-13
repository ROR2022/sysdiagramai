'use client';

import React from 'react';
import { AdditionalContextSectionProps } from './types';

export default function AdditionalContextSection({ data, updateData }: AdditionalContextSectionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateData(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Contexto Adicional</h3>
        <p className="text-sm text-base-content/70">
          Proporciona cualquier información adicional que consideres relevante para entender tu sistema.
        </p>
      </div>
      
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Información adicional o contexto</span>
        </label>
        <textarea 
          className="textarea textarea-bordered h-40" 
          placeholder="Describe cualquier detalle adicional sobre tu proyecto, como integración con sistemas existentes, requisitos especiales, o contexto que nos ayude a entender mejor tus necesidades..."
          value={data}
          onChange={handleChange}
        ></textarea>
        <label className="label">
          <span className="label-text-alt">Opcional: Puedes dejar esto en blanco si no hay contexto adicional</span>
        </label>
      </div>

      <div className="bg-base-200 p-4 rounded-lg">
        <h4 className="font-medium text-sm mb-2">Ejemplos de información útil:</h4>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>¿Hay sistemas existentes con los que deba integrar?</li>
          <li>¿Hay restricciones específicas de implementación?</li>
          <li>¿Existen estándares de la industria que deba cumplir?</li>
          <li>¿Hay preferencia por servicios en la nube específicos?</li>
        </ul>
      </div>
    </div>
  );
}
