import { notFound } from 'next/navigation';
import { getRequirementById } from '@/libs/data/requirements';
import { auth } from '@/auth';
import RequirementDetails from './components/RequirementDetails';
import DiagramGenerator from './components/DiagramGenerator';
import DiagramViewer from './components/DiagramViewer';
import { ISystemRequirement } from '@/libs/models/systemRequirement';

// Modificamos la interfaz para que tanto params como searchParams sean Promises
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RequirementPage({ params }: PageProps) {
  const session = await auth();
  
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

  let requirement: ISystemRequirement | null = null;
  try {
    // Esperamos la resolución de params
    const { id } = await params;
    //const id = resolvedParams.id;
    
    if (!id) {
      console.error('No se encontró el ID en la URL', id);
      notFound();
    }
    requirement = await getRequirementById(id, session.user.id as string);
    //console.log("requirement...", requirement);
  } catch (error) {
    console.error('Error al obtener el requisito:', error);
    notFound();
  }
  
  if (!requirement) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8">
        {/* Panel superior: Detalles del requisito */}
        <RequirementDetails requirement={requirement} />
        
        {/* Panel intermedio: Generador de diagramas */}
        <DiagramGenerator 
          requirementId={requirement._id?.toString() || ''} 
          status={requirement.status || ''} 
          hasDiagrams={Array.isArray(requirement.diagrams) && requirement.diagrams.length > 0} 
        />
        
        {/* Panel inferior: Visualizador de diagramas */}
        {requirement.diagrams && requirement.diagrams.length > 0 && (
          <DiagramViewer 
            diagramUrls={requirement.diagramUrls || []} 
            diagrams={requirement.diagrams} 
            requirementId={requirement._id?.toString() || ''}
          />
        )}
      </div>
    </div>
  );
}