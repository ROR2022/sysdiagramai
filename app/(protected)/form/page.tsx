'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function RequirementsForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    systemType: 'web',
    expectedUsers: '1000',
    functionalRequirements: '',
    nonFunctionalRequirements: '',
  });
  
  const systemTypes = [
    { value: 'web', label: 'Aplicación Web' },
    { value: 'mobile', label: 'Aplicación Móvil' },
    { value: 'desktop', label: 'Aplicación de Escritorio' },
    { value: 'api', label: 'API/Microservicios' },
    { value: 'database', label: 'Sistema de Base de Datos' },
  ];
  
  const userScales = [
    { value: '100', label: 'Pocos usuarios (< 100)' },
    { value: '1000', label: 'Escala media (100 - 1,000)' },
    { value: '10000', label: 'Gran escala (1,000 - 10,000)' },
    { value: '100000', label: 'Escala masiva (10,000+)' },
  ];
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Aquí enviarías los datos a tu API
      const response = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Error al generar el diagrama');
      }
      
      const data = await response.json();
      
      // Redirigir a la página de resultados con el ID del diseño generado
      router.push(`/results?id=${data.designId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Ha ocurrido un error al procesar tu solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Definir Requerimientos del Sistema</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Proyecto
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej. Sistema de Reservas Online"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="systemType" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Sistema
              </label>
              <select
                id="systemType"
                name="systemType"
                value={formData.systemType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {systemTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="expectedUsers" className="block text-sm font-medium text-gray-700 mb-1">
                Usuarios Esperados
              </label>
              <select
                id="expectedUsers"
                name="expectedUsers"
                value={formData.expectedUsers}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {userScales.map(scale => (
                  <option key={scale.value} value={scale.value}>
                    {scale.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="functionalRequirements" className="block text-sm font-medium text-gray-700 mb-1">
              Requerimientos Funcionales
            </label>
            <textarea
              id="functionalRequirements"
              name="functionalRequirements"
              value={formData.functionalRequirements}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe lo que el sistema debe hacer. Por ejemplo: registrar usuarios, procesar pagos, generar informes, etc."
            />
          </div>
          
          <div>
            <label htmlFor="nonFunctionalRequirements" className="block text-sm font-medium text-gray-700 mb-1">
              Requerimientos No Funcionales (opcional)
            </label>
            <textarea
              id="nonFunctionalRequirements"
              name="nonFunctionalRequirements"
              value={formData.nonFunctionalRequirements}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe aspectos como rendimiento, seguridad, disponibilidad, escalabilidad, etc."
            />
          </div>
          
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Generando...' : 'Generar Diagrama'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 