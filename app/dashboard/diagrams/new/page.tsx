'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewDiagramPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    requirementId: '',
    description: ''
  });
  const [requirements, setRequirements] = useState([]);
  const [error, setError] = useState('');

  // Simulación de carga de requisitos - En producción, usaríamos un efecto para cargarlos de la API
  useState(() => {
    // Esta función debería ser reemplazada por una llamada real a la API
    const fetchRequirements = async () => {
      try {
        setIsLoading(true);
        // Aquí hacer fetch real de requisitos
        // const response = await fetch('/api/system-requirements');
        // const data = await response.json();
        const mockRequirements = [
          { id: '1', name: 'Sistema de autenticación' },
          { id: '2', name: 'Módulo de dashboard' },
          { id: '3', name: 'API de diagramas' }
        ];
        setRequirements(mockRequirements);
        setIsLoading(false);
      } catch (err) {
        console.error('Error al cargar requisitos:', err);
        setError('No se pudieron cargar los requisitos. Por favor, inténtalo más tarde.');
        setIsLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Aquí se implementaría la llamada real a la API para crear el diagrama
      // const response = await fetch('/api/diagrams', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // if (!response.ok) throw new Error('Error al crear el diagrama');
      
      // Simulación de envío exitoso
      setTimeout(() => {
        // Redireccionar al usuario a la lista de diagramas
        router.push('/dashboard/diagrams');
      }, 1000);
    } catch (err) {
      console.error('Error en el envío del formulario:', err);
      setError('Ocurrió un error al crear el diagrama. Por favor, inténtalo de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Crear Nuevo Diagrama</h1>
        <Link href="/dashboard/diagrams" className="btn btn-ghost">
          Cancelar
        </Link>
      </div>

      <div className="bg-base-100 rounded-xl shadow p-6">
        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Título del Diagrama</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej. Arquitectura de Sistema"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Requisito del Sistema</span>
            </label>
            <select
              name="requirementId"
              value={formData.requirementId}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
              disabled={isLoading || requirements.length === 0}
            >
              <option value="" disabled>Selecciona un requisito</option>
              {requirements.map(req => (
                <option key={req.id} value={req.id}>
                  {req.name}
                </option>
              ))}
            </select>
            <div className="label">
              <span className="label-text-alt">
                El diagrama estará asociado a este requisito del sistema
              </span>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Descripción (opcional)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el propósito de este diagrama..."
              className="textarea textarea-bordered h-24"
            />
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !formData.title || !formData.requirementId}
            >
              {isLoading ? 'Creando...' : 'Crear Diagrama'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 text-center text-sm text-base-content/70">
        ¿Necesitas ayuda? Ponte en contacto con nosotros en <a href="mailto:kodeandoando2023@gmail.com" className="link link-primary">kodeandoando2023@gmail.com</a>
      </div>
    </div>
  );
}
