import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SystemRequirementService } from "@/libs/services/systemRequirementService";
import { ISystemRequirement } from "@/libs/models/systemRequirement";

// Interfaz para objetos con método toString
interface ToStringable {
  toString: () => string;
}

// Función auxiliar para asegurar que los IDs sean strings
function ensureString(id: unknown): string {
  if (!id) return '';
  // Si es un objeto con toString (como ObjectId), convertirlo
  if (typeof id === 'object' && id !== null && 'toString' in id && 
      typeof (id as ToStringable).toString === 'function') {
    return (id as ToStringable).toString();
  }
  // Si ya es string o puede convertirse a string directamente
  return String(id);
}

interface Diagram {
  id: string;
  requirementId: string;
  title: string;
  date: string;
  status: string;
  requirementName: string;
}

export default async function DiagramsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  // Variables para almacenar datos y estados
  let diagrams: Diagram[] = [];
  let isLoading = true;
  let errorMessage: string | null = null;

  try {
    // Obtener todos los requisitos del sistema del usuario
    const userId = session.user.id as string;
    const requirements: ISystemRequirement[] = await SystemRequirementService.getAllByUser(userId);
    
    // Transformar los requisitos en diagramas
    diagrams = requirements
      .filter(req => req.diagrams && req.diagrams.length > 0)
      .flatMap(req => {
        return (req.diagrams || []).map((diagram, index) => ({
          id: `${ensureString(req._id)}_diagram_${index}`,
          requirementId: ensureString(req._id),
          title: diagram.title || req.name || 'Sin título',
          date: new Date(req.updated || req.created || new Date()).toISOString().split('T')[0],
          status: req.status || 'draft',
          requirementName: req.name || 'Requisito sin nombre'
        }));
      })
      // Ordenar por fecha más reciente
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    isLoading = false;
  } catch (error: unknown) {
    console.error("Error al cargar diagramas:", error);
    isLoading = false;
    errorMessage = "Ocurrió un error al cargar los diagramas. Por favor, inténtalo de nuevo más tarde.";
  }

  return (
    <div className="container mx-auto p-4 text-base-content">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Diagramas</h1>
        <Link href="/dashboard/create" className="btn btn-primary">
          Nuevo Diagrama
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : errorMessage ? (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{errorMessage}</span>
        </div>
      ) : diagrams.length === 0 ? (
        <div className="bg-base-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No hay diagramas disponibles</h3>
          <p className="text-base-content/70 mb-4">Comienza creando tu primer diagrama a partir de un requisito del sistema.</p>
          <Link href="/dashboard/diagrams/new" className="btn btn-primary">
            Crear mi primer diagrama
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Título</th>
                <th>Requisito</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {diagrams.map((diagram) => (
                <tr key={diagram.id} className="hover:bg-base-200">
                  <td className="font-medium">{diagram.title}</td>
                  <td>{diagram.requirementName}</td>
                  <td>{diagram.date}</td>
                  <td>
                    <span className={`badge ${diagram.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                      {diagram.status === 'completed' ? 'Completado' : 'Borrador'}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/diagrams/${diagram.id}`} className="btn btn-sm btn-ghost">
                        Ver
                      </Link>
                      {/* El botón de editar ha sido eliminado ya que la funcionalidad no está disponible */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Link href="/dashboard" className="btn btn-ghost">
          ← Volver al Dashboard
        </Link>
      </div>
      
      <div className="mt-6 text-center text-sm text-base-content/70">
        ¿Necesitas ayuda? Ponte en contacto con nosotros en <a href="mailto:kodeandoando2023@gmail.com" className="link link-primary">kodeandoando2023@gmail.com</a>
      </div>
    </div>
  );
}
