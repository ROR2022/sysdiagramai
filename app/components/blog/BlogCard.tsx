'use client';

import Link from 'next/link';
import BlogCategory from './BlogCategory';
import BlogImage from './BlogImage';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: {
    id: string;
    name: string;
  };
  author: {
    name: string;
    avatar: string;
  };
  publishDate: string;
  readTime: number;
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  coverImage,
  category,
  author,
  publishDate,
  readTime
}: BlogCardProps) {
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
        <div className="mb-2">
          <BlogCategory id={category.id} name={category.name} />
        </div>
        <h3 className="card-title text-lg mb-2">
          <Link href={`/blog/${slug}`} className="hover:text-primary transition-colors">
            {title}
          </Link>
        </h3>
        <p className="text-base-content/70 text-sm mb-4 line-clamp-3">{excerpt}</p>
        
        <div className="card-actions flex items-center mt-auto pt-3 border-t border-base-300">
          <div className="flex items-center">
            <div className="avatar mr-2">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <BlogImage
                  src={author.avatar}
                  alt={author.name}
                  width={32}
                  height={32}
                />
              </div>
            </div>
            <span className="text-xs font-medium">{author.name}</span>
          </div>
          
          <div className="ml-auto flex items-center text-xs text-base-content/60">
            <span>{publishDate}</span>
            <span className="mx-1">•</span>
            <span>{readTime} min lectura</span>
          </div>
        </div>
      </div>
    </div>
  );
}
