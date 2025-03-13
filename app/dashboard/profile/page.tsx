import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProfileForm from './components/ProfileForm';

export const metadata: Metadata = {
  title: 'Mi Perfil - SysDiagramAI',
  description: 'Edita tu información de perfil',
};

export default async function ProfilePage() {
  // Verificar autenticación
  const session = await auth();
  
  // Redirigir si no hay sesión
  if (!session?.user) {
    redirect('/auth/signin');
  }
  
  return (
    <div className="container mx-auto px-4 py-8 text-base-content">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
        
        <div className="bg-base-100 shadow-xl rounded-box">
          <div className="p-6">
            <ProfileForm userEmail={session.user.email || ''} />
          </div>
        </div>
      </div>
    </div>
  );
} 