import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SystemRequirementService } from "@/libs/services/systemRequirementService";
import { ISystemRequirement } from "@/libs/models/systemRequirement";

// Importar componentes modulares
import DashboardHeader from "../components/dashboard/DashboardHeader";
import SummarySection from "../components/dashboard/SummarySection";
import UserProfileCard from "../components/dashboard/UserProfileCard";
import RecentActivityCard from "../components/dashboard/RecentActivityCard";
import ResourcesCard from "../components/dashboard/ResourcesCard";

// Definir interfaces para los datos que espera SummarySection
interface Diagram {
  id: string;
  title: string;
  date: string;
  status: string;
}

interface Project {
  id: string;
  name: string;
}

interface Collaborator {
  id: string;
  name: string;
}

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

// Transformamos los requisitos del sistema en el formato que espera SummarySection
function transformSystemRequirementsToData(requirements: ISystemRequirement[]) {
  // Extraer todos los diagramas
  const diagrams: Diagram[] = requirements
    .filter(req => req.status === 'completed' && req.diagrams && req.diagrams.length > 0)
    .flatMap(req => {
      return (req.diagrams || []).map((diagram, diagramIndex) => ({
        // Crear un ID único combinando el ID del requisito y el índice del diagrama
        id: `${ensureString(req._id)}_diagram_${diagramIndex}`,
        title: diagram.title || req.name || 'Sin título',
        date: new Date(req.updated || req.created || new Date()).toISOString().split('T')[0],
        status: req.status || 'draft'
      }));
    })
    // Ordenar por fecha más reciente
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Considerar cada requisito como un proyecto
  const projects: Project[] = requirements.map(req => ({
    id: ensureString(req._id),
    name: req.name || 'Proyecto sin nombre'
  }));
  
  // Por ahora, solo consideramos al usuario actual como colaborador
  // En una implementación futura, esto podría venir de una lista real de colaboradores
  const collaborators: Collaborator[] = [{
    id: '1',
    name: 'Usuario actual (tú)'
  }];

  return {
    diagrams,
    projects,
    collaborators
  };
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  // Extraer datos del usuario
  const user = session.user;
  let diagrams: Diagram[] = [];
  let projects: Project[] = [];
  let collaborators: Collaborator[] = [];
  let isLoading = true;

  try {
    // Obtener todos los requisitos del sistema del usuario
    const userId = session.user.id as string;
    const requirements = await SystemRequirementService.getAllByUser(userId);
    
    // Asegurar que los datos son serializables para componentes de cliente
    const serializableRequirements = requirements.map(req => ({
      ...req,
      _id: ensureString(req._id)
    }));
    
    isLoading = false;

    // Transformar los datos
    const transformedData = transformSystemRequirementsToData(serializableRequirements);
    diagrams = transformedData.diagrams;
    projects = transformedData.projects;
    collaborators = transformedData.collaborators;
  } catch (error) {
    console.error("Error al cargar datos del dashboard:", error);
    isLoading = false;
    // Dejar los arrays vacíos en caso de error
  }

  return (
    <>
      {/* Encabezado del Dashboard */}
      <DashboardHeader userName={user?.name} />

      {/* Sistema de Grid para el contenido principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sección de Resumen */}
        <div className="md:col-span-2 lg:col-span-2">
          <SummarySection 
            diagrams={diagrams} 
            projects={projects}
            collaborators={collaborators}
            isLoading={isLoading}
          />
        </div>
        
        {/* Perfil del Usuario */}
        <div className="lg:col-span-1">
          <UserProfileCard user={user} />
        </div>
        
        {/* Actividad Reciente */}
        <div className="md:col-span-1 lg:col-span-1">
          <RecentActivityCard />
        </div>
        
        {/* Recursos y Tutoriales */}
        <div className="md:col-span-1 lg:col-span-2">
          <ResourcesCard />
        </div>
      </div>
    </>
  );
}
