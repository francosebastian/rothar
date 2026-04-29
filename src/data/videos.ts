export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  youtubeId: string;
  views: string;
}

export const videos: Video[] = [
  {
    id: "1",
    title: "Cómo centrar un disco de freno",
    thumbnail: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=225&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    views: "1.2K"
  },
  {
    id: "2",
    title: "Mantenimiento básico de horquilla",
    thumbnail: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=225&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    views: "890"
  },
  {
    id: "3",
    title: "Ajustar tensión del cable de cambios",
    thumbnail: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&h=225&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    views: "2.1K"
  },
  {
    id: "4",
    title: "Cambiar pastillas de freno",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    views: "3.4K"
  },
  {
    id: "5",
    title: "Limpieza y lubricación de cadena",
    thumbnail: "https://images.unsplash.com/photo-1558618047-f4b511d88421?w=400&h=225&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    views: "1.8K"
  },
  {
    id: "6",
    title: "Instalar manetas de freno nuevas",
    thumbnail: "https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=400&h=225&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    views: "756"
  }
];

export const youtubeChannelUrl = "https://www.youtube.com/@francosebastian22";