export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Cómo ajustar los cambios de tu bicicleta",
    excerpt: "Aprende a ajustar el desviador y el cambio para que tus cambios de marcha sean suaves y precisos.",
    content: "Un cambio bien ajustado es fundamental para una experiencia de pedaleo óptima. En este artículo te enseñamos los pasos básicos para ajustar los cambios de tu bicicleta...",
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&h=400&fit=crop",
    date: "15 abril 2026",
    category: "Mantenimiento",
    readTime: "5 min"
  },
  {
    id: "2",
    title: "Mantenimiento del cassette: cuándo cambiarlo",
    excerpt: "El cassette es una de las piezas más importantes de la transmisión. Aprende a identificar cuándo necesita reemplazo.",
    content: "El cassette es el conjunto de piñones trasero de tu bicicleta. Con el uso, los dientes se van desgastando...",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    date: "10 abril 2026",
    category: "Reparaciones",
    readTime: "4 min"
  },
  {
    id: "3",
    title: "5 errores comuns al inflate tus neumáticos",
    excerpt: "Evita estos errores comunes que pueden afectar el rendimiento y seguridad de tu bicicleta.",
    content: "Mantener la presión correcta de los neumáticos es crucial para tu seguridad y rendimiento...",
    image: "https://images.unsplash.com/photo-1558618047-f4b511d88421?w=600&h=400&fit=crop",
    date: "5 abril 2026",
    category: "Tips",
    readTime: "3 min"
  },
  {
    id: "4",
    title: "Cómo cargar tu bicicleta para un viaje",
    excerpt: "Guía completa para preparar tu bicicleta antes de un viaje largo.",
    content: "Antes de emprender un viaje largo, es fundamental preparar correctamente tu bicicleta...",
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600&h=400&fit=crop",
    date: "1 abril 2026",
    category: "Noticias",
    readTime: "6 min"
  }
];