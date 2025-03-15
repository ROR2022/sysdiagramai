import { NextConfig } from 'next';
//import path from 'path';
const config: NextConfig = {
  // Especificar paquetes que deben ser ejecutados en Node.js
  serverExternalPackages: ['mongodb', 'mongoose'],
  
  // Configuración de imágenes para permitir dominios externos
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
    ],
  },

 
  
  // Configuración para servir archivos estáticos desde la carpeta uploads
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
};

export default config;
