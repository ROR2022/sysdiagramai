import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SystemRequirementService } from "@/libs/services/systemRequirementService";

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

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Interfaces para los datos del diagrama
interface DiagramNode {
  id: string | unknown;
  type?: string;
  position?: { x: number; y: number };
  data?: Record<string, unknown>;
}

interface DiagramEdge {
  id: string | unknown;
  source?: string;
  target?: string;
  type?: string;
}

// Interfaz para el contenido del diagrama que puede incluir nodos y bordes
type DiagramDataWithNodesAndEdges = {
  title?: string;
  description?: string;
  diagramText?: string;
  explanation?: string;
  content?: string;
  url?: string;
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
  [key: string]: unknown;
};

// Interfaz para la estructura del diagrama en la UI
interface DiagramDetail {
  id: string;
  title: string;
  date: string;
  status: string;
  requirementName: string;
  description: string;
  diagramText: string;     // Contenido textual del diagrama
  explanation: string;     // Explicación del diagrama
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export default async function DiagramDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const { id } = await params;
  // Extraer el ID del requisito y el índice del diagrama
  const [requirementId, /*placeholder*/, diagramIndexStr] = id.split('_');
  const diagramIndex = parseInt(diagramIndexStr, 10);
  
  let diagram: DiagramDetail | null = null;
  let requirement = null;
  let isLoading = true;
  let errorMessage: string | null = null;

  try {
    const userId = session.user.id as string;
    // Obtener todos los requisitos del usuario
    const requirements = await SystemRequirementService.getAllByUser(userId);
    
    // Encontrar el requisito correspondiente por ID
    requirement = requirements.find(req => ensureString(req._id) === requirementId);
    
    if (!requirement) {
      throw new Error(`Requisito con ID ${requirementId} no encontrado`);
    }

    if (!requirement.diagrams || !requirement.diagrams.length || isNaN(diagramIndex) || diagramIndex < 0 || diagramIndex >= requirement.diagrams.length) {
      throw new Error(`Diagrama con índice ${diagramIndex} no encontrado en el requisito ${requirementId}`);
    }

    // Obtener los datos del diagrama específico y tratarlo como un objeto con propiedades dinámicas
    const diagramData = requirement.diagrams[diagramIndex] as DiagramDataWithNodesAndEdges;
    
    // Crear el objeto de diagrama para la UI
    diagram = {
      id: id,
      title: diagramData.title || requirement.name || 'Sin título',
      date: new Date(requirement.updated || requirement.created || new Date()).toISOString().split('T')[0],
      status: requirement.status || 'draft',
      requirementName: requirement.name || 'Requisito sin nombre',
      description: diagramData.description || requirement.description || 'Sin descripción',
      diagramText: diagramData.diagramText || 'No hay contenido disponible para este diagrama.',
      explanation: diagramData.explanation || '',
      nodes: Array.isArray(diagramData.nodes) ? diagramData.nodes.map((node: DiagramNode) => ({
        id: ensureString(node.id),
        type: String(node.type || 'default'),
        position: {
          x: Number(node.position?.x || 0),
          y: Number(node.position?.y || 0)
        },
        data: node.data || {}
      })) : [],
      edges: Array.isArray(diagramData.edges) ? diagramData.edges.map((edge: DiagramEdge) => ({
        id: ensureString(edge.id),
        source: String(edge.source || ''),
        target: String(edge.target || ''),
        type: String(edge.type || 'default')
      })) : []
    };
    
    isLoading = false;
  } catch (error: unknown) {
    console.error("Error al cargar el diagrama:", error);
    isLoading = false;
    errorMessage = error instanceof Error 
      ? `Error: ${error.message}`
      : "Ocurrió un error al cargar el diagrama. Por favor, inténtalo de nuevo más tarde.";
  }

  return (
    <div className="container mx-auto p-4 text-base-content">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isLoading ? 'Cargando...' : diagram ? diagram.title : 'Diagrama no encontrado'}
        </h1>
        <div className="flex space-x-2">
          <Link href="/dashboard/diagrams" className="btn btn-ghost">
            Volver a diagramas
          </Link>
          {/* El botón de editar ha sido eliminado ya que la funcionalidad no está disponible */}
        </div>
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
      ) : !diagram ? (
        <div className="bg-base-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Diagrama no encontrado</h3>
          <p className="text-base-content/70 mb-4">No se pudo encontrar el diagrama solicitado.</p>
          <Link href="/dashboard/diagrams" className="btn btn-primary">
            Ver todos los diagramas
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-base-100 rounded-xl shadow p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Diagrama</h2>
              <div className="bg-base-200 rounded-lg p-4 min-h-[400px] overflow-auto">
                {/* Contenido del diagrama en formato de texto */}
                <pre className="whitespace-pre-wrap font-mono text-sm">{diagram.diagramText}</pre>
              </div>
            </div>
            
            {diagram.explanation && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Explicación</h2>
                <div className="bg-base-200 rounded-lg p-4">
                  <p className="whitespace-pre-line">{diagram.explanation}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-base-100 rounded-xl shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Detalles</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Estado</p>
                  <span className={`badge ${diagram.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                    {diagram.status === 'completed' ? 'Completado' : 'Borrador'}
                  </span>
                </div>
                
                <div>
                  <p className="font-medium">Fecha</p>
                  <p>{diagram.date}</p>
                </div>
                
                <div>
                  <p className="font-medium">Requisito asociado</p>
                  <p>{diagram.requirementName}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-base-100 rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Descripción</h2>
              <p className="text-base-content/80 whitespace-pre-line">{diagram.description}</p>
            </div>
            
            <div className="mt-6 text-center text-sm text-base-content/70">
              ¿Necesitas ayuda? Ponte en contacto con nosotros en <a href="mailto:kodeandoando2023@gmail.com" className="link link-primary">kodeandoando2023@gmail.com</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
