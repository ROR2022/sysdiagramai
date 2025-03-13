'use client';

import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";

interface UserProfileCardProps {
  user: Session["user"];
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="card text-base-content bg-base-100 shadow-md h-full">
      <div className="card-body">
        <h3 className="text-xl font-semibold mb-4">Mi Perfil</h3>
        <div className="flex flex-col items-center">
          <div className="avatar mb-4">
            {user?.image ? (
              <div className="w-24 h-24 rounded-full overflow-hidden relative">
                <Image
                  src={user.image}
                  alt={`Avatar de ${user?.name || 'Usuario'}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xl">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
          <h4 className="text-lg font-medium">{user?.name || 'Usuario'}</h4>
          <p className="text-sm text-base-content/70 mb-4">{user?.email || ''}</p>
          
          <div className="flex gap-2 mt-2">
            <Link href="/dashboard/profile" className="btn btn-sm btn-primary">
              Editar Perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
