'use client';

import Link from 'next/link';
import BlogImage from '../blog/BlogImage';

interface TutorialCardProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: {
    id: string;
    name: string;
  };
  difficulty: string;
  duration: number;
  updatedDate: string;
}

export default function TutorialCard({
  slug,
  title,
  excerpt,
  coverImage,
  category,
  difficulty,
  duration,
  updatedDate
}: TutorialCardProps) {
  // Mapeo de niveles de dificultad a colores
  const difficultyColors: Record<string, string> = {
    'principiante': 'badge-success',
    'intermedio': 'badge-warning',
    'avanzado': 'badge-error'
  };
  
  const badgeClass = difficultyColors[difficulty.toLowerCase()] || 'badge-info';
  
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full">
      <figure className="relative h-48 w-full">
        <BlogImage
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </figure>
      <div className="card-body p-5">
        <div className="flex flex-wrap gap-2 mb-2">
          <div className="badge badge-outline">{category.name}</div>
          <div className={`badge ${badgeClass}`}>{difficulty}</div>
        </div>
        
        <h3 className="card-title text-lg mb-2">
          <Link href={`/tutorials/${slug}`} className="hover:text-primary transition-colors">
            {title}
          </Link>
        </h3>
        
        <p className="text-base-content/70 text-sm mb-4 line-clamp-3">{excerpt}</p>
        
        <div className="card-actions justify-between mt-auto pt-3 border-t border-base-300">
          <div className="flex items-center gap-1 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{duration} min</span>
          </div>
          
          <div className="flex items-center text-xs text-base-content/60">
            <span>Actualizado: {updatedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
