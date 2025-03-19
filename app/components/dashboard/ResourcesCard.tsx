"use client"

import Link from "next/link"

export default function ResourcesCard() {
  return (
    <div className="card text-base-content bg-base-100 shadow-md h-full">
      <div className="card-body">
        <h2 className="card-title text-xl mb-4">Recursos y Tutoriales</h2>

        <ul className="space-y-3 mb-4">
          <li className="p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
            <Link href="/documentation" className="flex items-start">
              <div className="bg-primary bg-opacity-20 text-primary p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Documentación</p>
                <p className="text-xs text-base-content/70 mt-1">Guías completas y referencia técnica</p>
              </div>
            </Link>
          </li>

          <li className="p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
            <Link href="/blog" className="flex items-start">
              <div className="bg-secondary bg-opacity-20 text-secondary p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Blog</p>
                <p className="text-xs text-base-content/70 mt-1">Artículos, noticias y actualizaciones</p>
              </div>
            </Link>
          </li>

          <li className="p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
            <Link href="/tutorials" className="flex items-start">
              <div className="bg-accent bg-opacity-20 text-accent p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Tutoriales</p>
                <p className="text-xs text-base-content/70 mt-1">Guías paso a paso y videos formativos</p>
              </div>
            </Link>
          </li>
        </ul>

        <div className="card-actions justify-end hidden">
          <Link href="/resources" className="btn btn-sm btn-ghost">
            Explorar recursos →
          </Link>
        </div>
      </div>
    </div>
  )
}

