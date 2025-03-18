"use client";

import { useState, useEffect, FC, Suspense } from "react";
import { useParams } from "next/navigation";
import BlogLayout from "../../../components/blog/BlogLayout";
import BlogCard from "../../../components/blog/BlogCard";
import BlogPagination from "../../../components/blog/BlogPagination";


interface GetParamsProps {
  setCategory: (category: string) => void;
  setPage: (page: number) => void;
}

const GetParams: FC<GetParamsProps> = ({ setCategory, setPage }) => {
  const params = useParams();
  //console.log('params', params);
  //const category = params.category || "";
  //const page = params.page || "1";
  let category = '';
  let page = '';
  if(typeof params.category === 'string') category = params.category;
  if(typeof params.page === 'string') page = params.page;
  if(typeof params.category !== 'string' && params.category) category = params.category.join('');
  if(typeof params.page !== 'string' && params.page) page = params.page.join('');

  useEffect(() => {
    if (category) {
      console.log("Category:", category);
      setCategory(category);
    }
    if (page) {
      console.log("Page:", page);
      setPage(parseInt(page));
    }
  }, [category, setCategory, page, setPage]);

  return null;
};

// Definición de tipos
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
  };
  publishDate: string;
  readTime: number;
}

// Datos de ejemplo para el blog
const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    slug: "introduccion-diagramas-sistemas",
    title: "Introducción a los Diagramas de Sistemas: Una Guía Completa",
    excerpt:
      "Aprende los fundamentos de los diagramas de sistemas y cómo pueden ayudarte a visualizar arquitecturas complejas de manera efectiva.",
    coverImage: "/images/blog/system-diagrams-intro.jpg",
    category: { id: "tutorials", name: "Tutoriales" },
    author: {
      name: "Ana Martínez",
      avatar: "/images/blog/authors/ana-martinez.jpg",
    },
    publishDate: "15 Mar 2025",
    readTime: 8,
  },
  {
    slug: "patrones-diseno-microservicios",
    title: "Patrones de Diseño para Arquitecturas de Microservicios",
    excerpt:
      "Explora los patrones de diseño más efectivos para implementar arquitecturas basadas en microservicios en sistemas distribuidos.",
    coverImage: "/images/blog/microservice-patterns.jpg",
    category: { id: "tips", name: "Consejos y Trucos" },
    author: {
      name: "Carlos Ramírez",
      avatar: "/images/blog/authors/carlos-ramirez.jpg",
    },
    publishDate: "10 Mar 2025",
    readTime: 12,
  },
  {
    slug: "ia-generativa-disenio-sistemas",
    title: "IA Generativa en el Diseño de Sistemas: El Futuro es Ahora",
    excerpt:
      "Descubre cómo la inteligencia artificial generativa está transformando la forma en que diseñamos sistemas complejos.",
    coverImage: "/images/blog/ai-system-design.jpg",
    category: { id: "news", name: "Noticias" },
    author: {
      name: "Elena Sánchez",
      avatar: "/images/blog/authors/elena-sanchez.jpg",
    },
    publishDate: "5 Mar 2025",
    readTime: 6,
  },
  {
    slug: "caso-exito-fintech",
    title:
      "Caso de Éxito: Cómo una Fintech Rediseñó su Arquitectura con SysDiagramAI",
    excerpt:
      "Un análisis detallado de cómo una startup fintech utilizó SysDiagramAI para rediseñar su arquitectura y escalar su plataforma.",
    coverImage: "/images/blog/fintech-case-study.jpg",
    category: { id: "case-studies", name: "Casos de Estudio" },
    author: {
      name: "Roberto González",
      avatar: "/images/blog/authors/roberto-gonzalez.jpg",
    },
    publishDate: "28 Feb 2025",
    readTime: 10,
  },
  {
    slug: "mejores-practicas-documentacion",
    title: "5 Mejores Prácticas para Documentar tus Arquitecturas de Sistema",
    excerpt:
      "Aprende a documentar tus arquitecturas de sistema de manera efectiva para mejorar la colaboración y mantenibilidad.",
    coverImage: "/images/blog/documentation-best-practices.jpg",
    category: { id: "tips", name: "Consejos y Trucos" },
    author: {
      name: "Ana Martínez",
      avatar: "/images/blog/authors/ana-martinez.jpg",
    },
    publishDate: "20 Feb 2025",
    readTime: 7,
  },
  {
    slug: "comparativa-herramientas-diagramas",
    title:
      "Comparativa: Las Mejores Herramientas para Diagramas de Sistemas en 2025",
    excerpt:
      "Un análisis comparativo de las principales herramientas de diseño y diagramación de sistemas disponibles en el mercado.",
    coverImage: "/images/blog/tools-comparison.jpg",
    category: { id: "tutorials", name: "Tutoriales" },
    author: {
      name: "Carlos Ramírez",
      avatar: "/images/blog/authors/carlos-ramirez.jpg",
    },
    publishDate: "15 Feb 2025",
    readTime: 9,
  },
];

export default function CategoryPage() {
  //const searchParams = useSearchParams();
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  //const [currentPage, setCurrentPage] = useState(1);
  const [categoryName, setCategoryName] = useState("");
  const postsPerPage = 4;

  // NOTA: En futuras versiones de Next.js, se deberá usar React.use() para acceder a params
  // Por ahora, usamos acceso directo ya que Next.js lo soporta en transición
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Obtener nombre de categoría para mostrar en el título
    const categoryMap: Record<string, string> = {
      tutorials: "Tutoriales",
      tips: "Consejos y Trucos",
      news: "Noticias",
      "case-studies": "Casos de Estudio",
    };
    setCategoryName(categoryMap[category] || category);

    // Filtrar posts por categoría
    const filtered = SAMPLE_BLOG_POSTS.filter(
      (post) => post.category.id === category
    );

    setFilteredPosts(filtered);

    // Obtener página actual de la URL
    //const page = parseInt(searchParams.get('page') || '1');
    //setCurrentPage(page);
  }, [category, page]);

  // Calcular posts para la página actual
  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Construir URL base para paginación
  const baseUrl = `/blog/category/${category}`;

  return (
    <div className="bg-base-100">
      <Suspense fallback={<div>Loading...</div>}>
        <GetParams setCategory={setCategory} setPage={setPage} />
      </Suspense>
      {category && (
        <BlogLayout activeCategory={category}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Categoría: {categoryName}</h2>
            <p className="text-base-content/70">
              {filteredPosts.length}{" "}
              {filteredPosts.length === 1 ? "artículo" : "artículos"}{" "}
              encontrados
            </p>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">
                No hay artículos en esta categoría
              </h3>
              <p>
                Explora otras categorías o regresa más tarde para ver nuevo
                contenido.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentPosts.map((post) => (
                  <BlogCard key={post.slug} {...post} />
                ))}
              </div>

              <BlogPagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl={baseUrl}
              />
            </>
          )}
        </BlogLayout>
      )}
    </div>
  );
}
