'use client';

import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';

export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SessionProvider>
      <div className="min-h-screen bg-base-200 flex">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Contenido principal */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Topbar */}
          <Topbar toggleSidebar={toggleSidebar} />
          
          {/* Contenedor del contenido principal con restricción de ancho máximo */}
          <div className="flex-1 w-full mx-auto max-w-screen-2xl px-4 md:px-6 lg:px-8">
            {/* Contenido */}
            <main className="py-6">
              {children}
            </main>
          </div>
          
          {/* Footer */}
          <footer className="p-4 border-t border-base-300 text-center text-sm text-base-content/70">
            <div className="max-w-screen-2xl mx-auto">
              <p> 2024 SysDiagramAI. Todos los derechos reservados.</p>
            </div>
          </footer>
        </div>
      </div>
    </SessionProvider>
  );
} 