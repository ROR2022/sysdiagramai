import { NextConfig } from 'next';

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

  // Configuración experimental para Turbopack (actualizada)
  experimental: {
    turbo: {
      rules: {
        // Configuración para el procesamiento de CSS (nuevo formato con glob)
        '*.css': ['postcss-loader'],
      },
    },
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
