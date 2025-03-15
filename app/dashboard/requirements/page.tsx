import Link from 'next/link';
import { getRequirementsByUserId } from '@/libs/data/requirements';
import { auth } from '@/auth';
import { formatDate } from '@/libs/utils/date';
import { ISystemRequirement } from '@/libs/models/systemRequirement';

// Interfaz para el requisito con _id como string explícito
interface RequirementWithStringId extends Omit<ISystemRequirement, '_id'> {
  _id: string;
}

export default async function RequirementsPage() {
  const session = await auth();
  
  console.log('Sesión de usuario:', {
    isAuthenticated: !!session,
    userId: session?.user?.id,
    email: session?.user?.email
  });
  
  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-base-200 p-8 rounded-box shadow-lg">
          <h1 className="text-2xl font-bold mb-4">No autorizado</h1>
          <p>Debes iniciar sesión para ver esta página.</p>
        </div>
      </div>
    );
  }

  // Manejar posibles errores al obtener los requisitos
  let requirements: ISystemRequirement[] = [];
  let error = null;

  try {
    console.log(`Obteniendo requisitos para el usuario con ID: ${session.user.id}`);
    requirements = await getRequirementsByUserId(session.user.id as string);
    console.log(`Requisitos obtenidos: ${requirements.length}`);
  } catch (err) {
    console.error('Error al cargar requisitos:', err);
    error = err;
  }

  // Si hay un error, mostrar un mensaje amigable
  if (error) {
    return (
      <div className="container text-base-content mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mis Requisitos de Sistema</h1>
          <Link href="/dashboard/create" className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nuevo Requisito
          </Link>
        </div>
        
        <div className="bg-error/10 p-8 rounded-box text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-error mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Error al cargar los requisitos</h2>
          <p className="mb-4">Ha ocurrido un problema al intentar cargar tus requisitos. Por favor, intenta de nuevo más tarde.</p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard/requirements" className="btn btn-primary">
              Intentar de nuevo
            </Link>
            <Link href="/dashboard" className="btn btn-outline">
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container text-base-content mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Requisitos de Sistema</h1>
        <Link href="/dashboard/create" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nuevo Requisito
        </Link>
      </div>

      {requirements.length === 0 ? (
        <div className="bg-base-200 p-8 rounded-box text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-base-content opacity-50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">No tienes requisitos todavía</h2>
          <p className="mb-4">Crea tu primer requisito para generar diagramas de arquitectura.</p>
          <Link href="/dashboard/create" className="btn btn-primary">
            Crear Requisito
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requirements.map((req) => {
            // Asegurar que estamos trabajando con un objeto correctamente tipado
            const requirement = req as RequirementWithStringId;
            return (
              <Link 
                href={`/dashboard/requirements/${requirement._id}`} 
                key={requirement._id}
                className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="card-body p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="card-title">{requirement.name}</h2>
                      <p className="text-sm opacity-70 mb-2">
                        {formatDate(requirement.updated || new Date())}
                      </p>
                      <p className="text-sm line-clamp-2">{requirement.description}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="badge" 
                        style={{ 
                          backgroundColor: getStatusColor(requirement.status || 'draft'),
                          color: 'white' 
                        }}
                      >
                        {getStatusText(requirement.status || 'draft')}
                      </div>
                      {requirement.diagramUrls && requirement.diagramUrls.length > 0 && (
                        <div className="text-xs mt-2">
                          {requirement.diagramUrls.length} {requirement.diagramUrls.length === 1 ? 'diagrama' : 'diagramas'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
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
