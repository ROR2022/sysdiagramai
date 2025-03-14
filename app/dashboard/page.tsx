import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Importar componentes modulares
import DashboardHeader from "../components/dashboard/DashboardHeader";
import SummarySection from "../components/dashboard/SummarySection";
import UserProfileCard from "../components/dashboard/UserProfileCard";
import RecentActivityCard from "../components/dashboard/RecentActivityCard";
import ResourcesCard from "../components/dashboard/ResourcesCard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  // Extraer datos del usuario
  const user = session.user;

  // En un proyecto real, aquí se cargarían datos como diagramas recientes, estadísticas, etc.
  const mockRecentDiagrams = [
    { id: '1', title: 'Arquitectura Microservicios', date: '2024-03-05', status: 'completed' },
    { id: '2', title: 'Diseño de API', date: '2024-03-07', status: 'draft' },
    { id: '3', title: 'Modelo de Base de Datos', date: '2024-03-09', status: 'completed' },
  ];

  return (
    <>
      {/* Encabezado del Dashboard */}
      <DashboardHeader userName={user?.name} />

      {/* Sistema de Grid para el contenido principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sección de Resumen */}
        <div className="md:col-span-2 lg:col-span-2">
          <SummarySection diagrams={mockRecentDiagrams} />
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
