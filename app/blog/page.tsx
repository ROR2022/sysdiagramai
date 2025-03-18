'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BlogLayout from '../components/blog/BlogLayout';
import BlogCard from '../components/blog/BlogCard';
import BlogPagination from '../components/blog/BlogPagination';

// Datos de ejemplo para el blog
const SAMPLE_BLOG_POSTS = [
  {
    slug: 'introduccion-diagramas-sistemas',
    title: 'Introducción a los Diagramas de Sistemas: Una Guía Completa',
    excerpt: 'Aprende los fundamentos de los diagramas de sistemas y cómo pueden ayudarte a visualizar arquitecturas complejas de manera efectiva.',
    coverImage: '/images/blog/system-diagrams-intro.jpg',
    category: { id: 'tutorials', name: 'Tutoriales' },
    author: { 
      name: 'Ana Martínez', 
      avatar: '/images/blog/authors/ana-martinez.jpg' 
    },
    publishDate: '15 Mar 2025',
    readTime: 8
  },
  {
    slug: 'patrones-diseno-microservicios',
    title: 'Patrones de Diseño para Arquitecturas de Microservicios',
    excerpt: 'Explora los patrones de diseño más efectivos para implementar arquitecturas basadas en microservicios en sistemas distribuidos.',
    coverImage: '/images/blog/microservice-patterns.jpg',
    category: { id: 'tips', name: 'Consejos y Trucos' },
    author: { 
      name: 'Carlos Ramírez', 
      avatar: '/images/blog/authors/carlos-ramirez.jpg' 
    },
    publishDate: '10 Mar 2025',
    readTime: 12
  },
  {
    slug: 'ia-generativa-disenio-sistemas',
    title: 'IA Generativa en el Diseño de Sistemas: El Futuro es Ahora',
    excerpt: 'Descubre cómo la inteligencia artificial generativa está transformando la forma en que diseñamos sistemas complejos.',
    coverImage: '/images/blog/ai-system-design.jpg',
    category: { id: 'news', name: 'Noticias' },
    author: { 
      name: 'Elena Sánchez', 
      avatar: '/images/blog/authors/elena-sanchez.jpg' 
    },
    publishDate: '5 Mar 2025',
    readTime: 6
  },
  {
    slug: 'caso-exito-fintech',
    title: 'Caso de Éxito: Cómo una Fintech Rediseñó su Arquitectura con SysDiagramAI',
    excerpt: 'Un análisis detallado de cómo una startup fintech utilizó SysDiagramAI para rediseñar su arquitectura y escalar su plataforma.',
    coverImage: '/images/blog/fintech-case-study.jpg',
    category: { id: 'case-studies', name: 'Casos de Estudio' },
    author: { 
      name: 'Roberto González', 
      avatar: '/images/blog/authors/roberto-gonzalez.jpg' 
    },
    publishDate: '28 Feb 2025',
    readTime: 10
  },
  {
    slug: 'mejores-practicas-documentacion',
    title: '5 Mejores Prácticas para Documentar tus Arquitecturas de Sistema',
    excerpt: 'Aprende a documentar tus arquitecturas de sistema de manera efectiva para mejorar la colaboración y mantenibilidad.',
    coverImage: '/images/blog/documentation-best-practices.jpg',
    category: { id: 'tips', name: 'Consejos y Trucos' },
    author: { 
      name: 'Ana Martínez', 
      avatar: '/images/blog/authors/ana-martinez.jpg' 
    },
    publishDate: '20 Feb 2025',
    readTime: 7
  },
  {
    slug: 'comparativa-herramientas-diagramas',
    title: 'Comparativa: Las Mejores Herramientas para Diagramas de Sistemas en 2025',
    excerpt: 'Un análisis comparativo de las principales herramientas de diseño y diagramación de sistemas disponibles en el mercado.',
    coverImage: '/images/blog/tools-comparison.jpg',
    category: { id: 'tutorials', name: 'Tutoriales' },
    author: { 
      name: 'Carlos Ramírez', 
      avatar: '/images/blog/authors/carlos-ramirez.jpg' 
    },
    publishDate: '15 Feb 2025',
    readTime: 9
  }
];

export default function BlogPage() {
  const searchParams = useParams();
  const [filteredPosts, setFilteredPosts] = useState(SAMPLE_BLOG_POSTS);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    // Lógica para filtrar posts basado en parámetros de búsqueda
    
    if (searchParams.search) {
      if(typeof searchParams.search === 'string'){
        setSearch(searchParams.search);
      }else{
        setSearch(searchParams.search.join(''));
      }
    }
    
    
    if (searchParams.page) {
       if(typeof searchParams.page === 'string'){
        setPage(parseInt(searchParams.page));
       }else{
        setPage(parseInt(searchParams.page.join('')));
       }
    }
     
    
    let filtered = [...SAMPLE_BLOG_POSTS];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchLower) || 
        post.excerpt.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredPosts(filtered);
    setCurrentPage(page);
  }, [searchParams]);
  
  // Calcular posts para la página actual
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  // Construir URL base para paginación
  const baseUrl = search 
    ? `/blog?search=${search}` 
    : '/blog';
  
  return (
    <div className='bg-base-100'>
    <BlogLayout>
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-4">No se encontraron artículos</h3>
          <p>Intenta con otra búsqueda o explora nuestras categorías.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentPosts.map((post) => (
              <BlogCard
                key={post.slug}
                {...post}
              />
            ))}
          </div>
          
          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={baseUrl}
          />
        </>
      )}
    </BlogLayout>
    </div>
  );
}
