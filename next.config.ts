import { NextConfig } from 'next';

const config: NextConfig = {
  // Especificar paquetes que deben ser ejecutados en Node.js
  serverExternalPackages: ['mongodb', 'mongoose']
};

export default config;
