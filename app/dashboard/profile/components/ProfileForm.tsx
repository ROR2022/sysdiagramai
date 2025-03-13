'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface ProfileFormProps {
  userEmail: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: string | null;
}

export default function ProfileForm({ userEmail }: ProfileFormProps) {
  const router = useRouter();
  
  // Estados para los datos del formulario
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  
  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        //const loadingToast = toast.loading('Cargando información del perfil...');
        
        const response = await fetch('/api/user/profile');
        
        // Asegurarse de que el toast se cierre correctamente
        //setTimeout(() => {
        //  toast.dismiss(loadingToast);
        //}, 500);
        
        if (!response.ok) {
          throw new Error('Error al cargar el perfil');
        }
        
        const data = await response.json();
        setProfileData(data);
        setName(data.name || '');
        setImage(data.image || null);
        
        // Mostrar un toast de éxito al cargar los datos
        //toast.success('Perfil cargado correctamente');
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
        toast.error('No se pudo cargar la información del perfil. Por favor, recarga la página.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);
  
  // Manejar la subida de imagen
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, sube solo imágenes (JPG, PNG, GIF).');
      return;
    }
    
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 5MB. Por favor, selecciona una imagen más pequeña.');
      return;
    }
    
    // Mostrar notificación de procesamiento
    toast.loading('Procesando imagen...', { duration: 1500 });
    
    // Convertir a base64 para previsualización
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      toast.success('Imagen seleccionada correctamente. Guarda los cambios para aplicarla.');
    };
    reader.readAsDataURL(file);
  };
  
  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar contraseñas si se están actualizando
    if (password && password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden. Por favor, verifica que sean iguales.');
      return;
    }
    
    // Verificar si hay cambios para guardar
    const hasNameChanged = name !== profileData?.name;
    const hasPasswordChanged = password.length > 0;
    const hasImageChanged = image !== profileData?.image;
    
    if (!hasNameChanged && !hasPasswordChanged && !hasImageChanged) {
      // Usar toast.custom para mayor control
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-blue-500 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">
                  No hay cambios para guardar
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-blue-400">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-200 hover:text-white focus:outline-none"
            >
              Cerrar
            </button>
          </div>
        </div>
      ));
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Mostrar notificación de proceso con ID específico
      const toastId = toast.loading('Actualizando tu perfil...', {
        id: 'profile-update',
      });
      
      // Preparar datos para enviar
      const updateData: {
        name: string;
        password?: string;
        image?: string;
      } = {
        name,
      };
      
      // Incluir contraseña solo si se ha proporcionado
      if (password) {
        updateData.password = password;
      }
      
      // Incluir imagen solo si ha cambiado
      if (image && image !== profileData?.image) {
        updateData.image = image;
      }
      
      // Enviar solicitud de actualización
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      // Cerrar notificación de carga
      toast.dismiss(toastId);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el perfil');
      }
      
      // Mostrar mensaje de éxito con ID específico
      toast.success('¡Perfil actualizado correctamente! Los cambios se han guardado.', {
        id: 'profile-success',
        duration: 5000,
      });
      
      // Limpiar campos de contraseña
      setPassword('');
      setConfirmPassword('');
      
      // Actualizar la página para reflejar los cambios
      router.refresh();
      
    } catch (error: unknown) {
      console.error('Error al actualizar el perfil:', error);
      
      // Mostrar mensaje de error detallado con ID específico
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}. Por favor, intenta nuevamente.`, {
          id: 'profile-error',
          duration: 5000,
        });
      } else {
        toast.error('Ocurrió un error inesperado al actualizar tu perfil. Por favor, intenta nuevamente.', {
          id: 'profile-error',
          duration: 5000,
        });
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-base-content">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sección de imagen de perfil */}
        <div className="flex flex-col items-center space-y-4">
          <div className="avatar">
            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
              {image ? (
                <Image 
                  src={image} 
                  alt="Imagen de perfil" 
                  width={128} 
                  height={128} 
                  className="object-cover"
                />
              ) : (
                <div className="bg-neutral-content flex items-center justify-center text-4xl text-neutral">
                  {name.charAt(0).toUpperCase() || userEmail.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          
          <div className="form-control w-full max-w-xs hidden">
            <label className="label">
              <span className="label-text">Cambiar imagen</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input file-input-bordered file-input-sm w-full"
            />
            <label className="label">
              <span className="label-text-alt">PNG, JPG o GIF (máx. 5MB)</span>
            </label>
          </div>
        </div>
        
        {/* Sección de datos personales */}
        <div className="flex-1 space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="input input-bordered"
            />
            <label className="label">
              <span className="label-text-alt">No puedes cambiar tu email</span>
            </label>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nombre</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered"
              required
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nueva contraseña</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered"
              placeholder="Dejar en blanco para no cambiar"
              minLength={6}
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirmar contraseña</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered"
              placeholder="Confirma tu nueva contraseña"
              minLength={6}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-outline mr-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Guardando...
            </>
          ) : (
            'Guardar cambios'
          )}
        </button>
      </div>
    </form>
  );
} 