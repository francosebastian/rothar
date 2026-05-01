import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.6'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Acepta cualquier dominio
        port: '',
        pathname: '/**', // Acepta cualquier ruta
      },
    ],
    qualities: [75, 80],
  },
};

export default nextConfig;
