'use client';

import React, { useState } from 'react';
import BlogImage from '../components/blog/BlogImage';
import Link from 'next/link';

export default function TestImagePage() {
  const [showBrokenImages, setShowBrokenImages] = useState(true);
  
  // Array de URLs para probar
  const testImages = [
    // Imagen válida
    '/images/blog/system-diagrams-intro.jpg',
    // Imagen rota con ruta inexistente (debería mostrar el fallback)
    '/images/non-existent/missing-image.jpg',
    // Ruta directa al SVG de fallback (debería funcionar)
    '/images/blog/fallback-image.svg'
  ];

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Prueba de Imágenes y Fallbacks</h1>
      
      <div className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver al Blog
        </Link>
        
        <button 
          onClick={() => setShowBrokenImages(!showBrokenImages)}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showBrokenImages ? 'Ocultar' : 'Mostrar'} imágenes rotas
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Imagen normal con dimensiones fijas */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Imagen Normal (width/height)</h2>
          <div className="relative" style={{ height: '200px', width: '300px' }}>
            <BlogImage 
              src={testImages[0]} 
              alt="Imagen de prueba normal" 
              width={300}
              height={200}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">Fuente: {testImages[0]}</p>
        </div>
        
        {/* Imagen normal con fill */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Imagen Normal (fill)</h2>
          <div className="relative h-[200px]">
            <BlogImage 
              src={testImages[0]} 
              alt="Imagen de prueba normal con fill" 
              fill
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">Fuente: {testImages[0]}</p>
        </div>
        
        {/* SVG de fallback directamente */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">SVG Fallback Directo</h2>
          <div className="relative h-[200px]">
            <BlogImage 
              src={testImages[2]} 
              alt="SVG Fallback cargado directamente" 
              fill
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">Fuente: {testImages[2]}</p>
        </div>
        
        {showBrokenImages && (
          <>
            {/* Imagen rota con dimensiones fijas */}
            <div className="p-4 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Imagen Rota (width/height)</h2>
              <div className="relative" style={{ height: '200px', width: '300px' }}>
                <BlogImage 
                  src={testImages[1]} 
                  alt="Imagen rota con dimensiones" 
                  width={300}
                  height={200}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Fuente: {testImages[1]}</p>
            </div>
            
            {/* Imagen rota con fill */}
            <div className="p-4 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Imagen Rota (fill)</h2>
              <div className="relative h-[200px]">
                <BlogImage 
                  src={testImages[1]} 
                  alt="Imagen rota con fill" 
                  fill
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Fuente: {testImages[1]}</p>
            </div>
            
            {/* Prueba directa de SVG con IMG */}
            <div className="p-4 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">IMG nativo con SVG</h2>
              <div className="relative h-[200px] flex items-center justify-center">
                <img 
                  src={testImages[2]} 
                  alt="SVG con etiqueta img nativa"
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Fuente (img nativo): {testImages[2]}</p>
            </div>
          </>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Información de Depuración</h2>
        <p>Esta página prueba diferentes configuraciones de <code>BlogImage</code> para identificar problemas con la visualización de imágenes de fallback.</p>
        <ul className="list-disc ml-6 mt-2">
          <li>Ruta del SVG de fallback: <code>{testImages[2]}</code></li>
          <li>Ruta intencionalmente rota: <code>{testImages[1]}</code></li>
        </ul>
      </div>
    </main>
  );
}
