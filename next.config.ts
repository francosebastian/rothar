import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
