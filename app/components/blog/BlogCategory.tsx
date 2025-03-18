'use client';

import Link from 'next/link';

interface BlogCategoryProps {
  id: string;
  name: string;
  isActive?: boolean;
  count?: number;
}

export default function BlogCategory({ id, name, isActive = false, count }: BlogCategoryProps) {
  const href = id === 'all' ? '/blog' : `/blog/category/${id}`;
  
  return (
    <Link 
      href={href} 
      className={`flex justify-between items-center p-2 rounded transition-colors ${
        isActive 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'hover:bg-base-200'
      }`}
    >
      <span>{name}</span>
      {count !== undefined && (
        <span className="badge badge-sm">{count}</span>
      )}
    </Link>
  );
}
