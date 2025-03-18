'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BlogLayout from '../../components/blog/BlogLayout';
import BlogAuthor from '../../components/blog/BlogAuthor';
import BlogCategory from '../../components/blog/BlogCategory';

// Tipos para los datos de blog
interface BlogPost {
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
    role?: string;
    bio?: string;
    socialLinks?: {
      twitter?: string;
      linkedin?: string;
      github?: string;
    };
  };
  publishDate: string;
  readTime: number;
  content: string;
}

// Datos de ejemplo para artículos del blog
const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    slug: 'introduccion-diagramas-sistemas',
    title: 'Introducción a los Diagramas de Sistemas: Una Guía Completa',
    excerpt: 'Aprende los fundamentos de los diagramas de sistemas y cómo pueden ayudarte a visualizar arquitecturas complejas de manera efectiva.',
    coverImage: '/images/blog/system-diagrams-intro.jpg',
    category: { id: 'tutorials', name: 'Tutoriales' },
    author: { 
      name: 'Ana Martínez', 
      avatar: '/images/blog/authors/ana-martinez.jpg',
      role: 'Ingeniera de Software Senior',
      bio: 'Ana es especialista en arquitectura de sistemas distribuidos con más de 10 años de experiencia en el sector tecnológico.',
      socialLinks: {
        twitter: 'https://twitter.com/anamartinez',
        linkedin: 'https://linkedin.com/in/anamartinez',
      }
    },
    publishDate: '15 Mar 2025',
    readTime: 8,
    content: `
      <h2>¿Qué son los diagramas de sistemas?</h2>
      <p>Los diagramas de sistemas son representaciones visuales que ilustran la estructura, comportamiento e interacciones de los componentes dentro de un sistema de software. Sirven como herramientas esenciales para la comunicación, documentación y análisis en el desarrollo de software.</p>
      
      <p>Estos diagramas permiten a los equipos:</p>
      <ul>
        <li>Visualizar sistemas complejos de manera intuitiva</li>
        <li>Comunicar ideas y diseños entre equipos técnicos y no técnicos</li>
        <li>Documentar la arquitectura para referencia futura</li>
        <li>Analizar potenciales problemas antes de la implementación</li>
      </ul>
      
      <h2>Tipos de diagramas más comunes</h2>
      <p>Existen varios tipos de diagramas utilizados en el diseño de sistemas, cada uno con un propósito específico:</p>
      
      <h3>Diagramas de arquitectura</h3>
      <p>Proporcionan una vista de alto nivel de la estructura del sistema, mostrando los principales componentes y sus interacciones. Son ideales para comunicar la visión general del sistema a stakeholders y equipos de desarrollo.</p>
      
      <h3>Diagramas de flujo de datos</h3>
      <p>Ilustran cómo los datos se mueven a través del sistema, identificando procesos, almacenes de datos y entidades externas. Son útiles para comprender las transformaciones de datos en el sistema.</p>
      
      <h3>Diagramas de secuencia</h3>
      <p>Muestran la interacción entre componentes a lo largo del tiempo, destacando el orden de las operaciones. Son fundamentales para entender el comportamiento dinámico del sistema.</p>
      
      <h2>Mejores prácticas para crear diagramas efectivos</h2>
      <p>Para maximizar el valor de tus diagramas de sistemas, considera estas prácticas recomendadas:</p>
      
      <h3>Mantén la simplicidad</h3>
      <p>Un buen diagrama comunica información compleja de manera simple. Evita sobrecargar tus diagramas con demasiados detalles que puedan dificultar la comprensión.</p>
      
      <h3>Utiliza estándares y convenciones</h3>
      <p>Adopta estándares como UML (Unified Modeling Language) para asegurar que tus diagramas sean entendibles por otros profesionales del sector.</p>
      
      <h3>Adapta el nivel de detalle a la audiencia</h3>
      <p>Considera quién va a utilizar el diagrama. Los ejecutivos pueden necesitar vistas de alto nivel, mientras que los desarrolladores requieren más detalles técnicos.</p>
      
      <h2>Herramientas para la creación de diagramas</h2>
      <p>Existe una amplia variedad de herramientas disponibles para crear diagramas de sistemas:</p>
      <ul>
        <li><strong>SysDiagramAI</strong>: Nuestra plataforma que utiliza IA para generar diagramas a partir de descripciones textuales</li>
        <li>Lucidchart: Una herramienta basada en la nube con múltiples plantillas</li>
        <li>draw.io: Una opción gratuita y de código abierto con integración con Google Drive</li>
        <li>Microsoft Visio: Una solución empresarial con funcionalidades avanzadas</li>
      </ul>
      
      <h2>Conclusión</h2>
      <p>Los diagramas de sistemas son herramientas fundamentales en el diseño y desarrollo de software. Dominar el arte de crear diagramas efectivos puede mejorar significativamente la comunicación en tu equipo y la calidad de tus proyectos de software.</p>
      
      <p>En próximos artículos, profundizaremos en cada tipo de diagrama y exploraremos técnicas avanzadas para el diseño de sistemas.</p>
    `
  },
  // Otros posts de ejemplo...
];

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // En una implementación real, esto sería una llamada a una API o base de datos
    const foundPost = SAMPLE_BLOG_POSTS.find(p => p.slug === params.slug);
    
    if (foundPost) {
      setPost(foundPost);
      setLoading(false);
    } else {
      // Si no se encuentra el post, redirigir a la página principal del blog
      router.push('/blog');
    }
  }, [params.slug, router]);
  
  if (loading) {
    return (
      <BlogLayout>
        <div className="flex justify-center items-center py-16">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </BlogLayout>
    );
  }
  
  if (!post) return null;
  
  return (
    <BlogLayout activeCategory={post.category.id}>
      <article className="prose prose-lg max-w-none">
        {/* Encabezado del artículo */}
        <header className="mb-8 not-prose">
          <BlogCategory id={post.category.id} name={post.category.name} />
          
          <h1 className="text-3xl font-bold mt-3 mb-4">{post.title}</h1>
          
          <div className="flex items-center text-sm text-base-content/70 mb-6">
            <span>{post.publishDate}</span>
            <span className="mx-2">•</span>
            <span>{post.readTime} min lectura</span>
          </div>
          
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        </header>
        
        {/* Contenido del artículo */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        
        {/* Información del autor */}
        <div className="mt-12 not-prose">
          <h3 className="text-xl font-semibold mb-4">Sobre el autor</h3>
          <BlogAuthor
            name={post.author.name}
            avatar={post.author.avatar}
            role={post.author.role}
            bio={post.author.bio}
            socialLinks={post.author.socialLinks}
          />
        </div>
        
        {/* Enlaces de compartir */}
        <div className="mt-8 not-prose">
          <h3 className="text-lg font-semibold mb-3">Compartir este artículo</h3>
          <div className="flex gap-2">
            <button className="btn btn-circle btn-outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </button>
            <button className="btn btn-circle btn-outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </button>
            <button className="btn btn-circle btn-outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </button>
            <button className="btn btn-circle btn-outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Enlaces a artículos relacionados */}
        <div className="mt-12 not-prose">
          <h3 className="text-xl font-semibold mb-6">Artículos relacionados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SAMPLE_BLOG_POSTS.filter(p => 
              p.slug !== post.slug && 
              p.category.id === post.category.id
            ).slice(0, 2).map(relatedPost => (
              <div key={relatedPost.slug} className="card bg-base-200">
                <div className="card-body p-4">
                  <h4 className="card-title text-base">
                    <Link href={`/blog/${relatedPost.slug}`} className="hover:text-primary transition-colors">
                      {relatedPost.title}
                    </Link>
                  </h4>
                  <p className="text-sm line-clamp-2">{relatedPost.excerpt}</p>
                  <Link href={`/blog/${relatedPost.slug}`} className="text-sm font-medium text-primary mt-2">
                    Leer más →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
