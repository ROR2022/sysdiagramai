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
        <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
          {/* Topbar */}
          <Topbar toggleSidebar={toggleSidebar} />
          
          {/* Contenido */}
          <main className="flex-1 p-4 overflow-auto">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="p-4 border-t border-base-300 text-center text-sm text-base-content/70">
            <p>© 2024 SysDiagramAI. Todos los derechos reservados.</p>
          </footer>
        </div>
      </div>
    </SessionProvider>
  );
} 