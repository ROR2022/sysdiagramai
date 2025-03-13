import { ISystemRequirement } from '@/libs/models/systemRequirement';
import { formatDate } from '@/libs/utils/date';

interface RequirementDetailsProps {
  requirement: ISystemRequirement;
}

export default function RequirementDetails({ requirement }: RequirementDetailsProps) {
  return (
    <div className="bg-base-200 text-base-content p-6 rounded-box shadow">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold"> {requirement.name}</h1>
          <p className="text-sm opacity-70">
            Creado: {formatDate(requirement.created)} · 
            Actualizado: {formatDate(requirement.updated)}
          </p>
        </div>
        <div className="badge badge-lg" 
          style={{ 
            backgroundColor: getStatusColor(requirement.status),
            color: 'white' 
          }}
        >
          {getStatusText(requirement.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Información Básica</h2>
          <div className="bg-base-100 p-4 rounded-box">
            <p className="mb-2"><span className="font-medium">Tipo de Aplicación:</span> {requirement.applicationType}</p>
            <div className="mb-4">
              <p className="font-medium mb-1">Descripción:</p>
              <p className="text-sm">{requirement.description}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Requisitos Funcionales</h2>
          <div className="bg-base-100 p-4 rounded-box h-full">
            <ul className="list-disc pl-5 space-y-1">
              {requirement.functionalRequirements.map((req, index) => (
                <li key={index} className="text-sm">{req}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Requisitos No Funcionales</h2>
          <div className="bg-base-100 p-4 rounded-box">
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm"><span className="font-medium">Escalabilidad:</span> {requirement.nonFunctionalRequirements.scalability}</p>
              <p className="text-sm"><span className="font-medium">Disponibilidad:</span> {requirement.nonFunctionalRequirements.availability}</p>
              <p className="text-sm"><span className="font-medium">Seguridad:</span> {requirement.nonFunctionalRequirements.security}</p>
              <p className="text-sm"><span className="font-medium">Rendimiento:</span> {requirement.nonFunctionalRequirements.performance}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Preferencias Técnicas</h2>
          <div className="bg-base-100 p-4 rounded-box">
            <p className="text-sm mb-1"><span className="font-medium">Lenguaje Backend:</span> {requirement.techPreferences.backendLanguage}</p>
            <p className="text-sm mb-1"><span className="font-medium">Arquitectura:</span> {requirement.techPreferences.architecture}</p>
            
            <div className="mb-2">
              <p className="font-medium text-sm">Frameworks:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {requirement.techPreferences.frameworks.map((framework, index) => (
                  <span key={index} className="badge badge-sm badge-primary">{framework}</span>
                ))}
              </div>
            </div>
            
            <div>
              <p className="font-medium text-sm">Bases de Datos:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {requirement.techPreferences.databases.map((db, index) => (
                  <span key={index} className="badge badge-sm badge-secondary">{db}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {requirement.additionalContext && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Contexto Adicional</h2>
          <div className="bg-base-100 p-4 rounded-box">
            <p className="text-sm">{requirement.additionalContext}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Función para obtener el color del estado
function getStatusColor(status: string): string {
  switch (status) {
    case 'draft':
      return '#6B7280'; // gray-500
    case 'generating':
      return '#3B82F6'; // blue-500
    case 'completed':
      return '#10B981'; // green-500
    case 'failed':
      return '#EF4444'; // red-500
    default:
      return '#6B7280'; // gray-500
  }
}

// Función para obtener el texto del estado
function getStatusText(status: string): string {
  switch (status) {
    case 'draft':
      return 'Borrador';
    case 'generating':
      return 'Generando';
    case 'completed':
      return 'Completado';
    case 'failed':
      return 'Error';
    default:
      return 'Desconocido';
  }
}
