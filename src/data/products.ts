export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Cadena Shimano HG54",
    price: 18900,
    category: "Transmisión",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    description: "Cadena de 6-7-8 velocidades compatible con la mayoría de bicis urbanas y de montaña."
  },
  {
    id: "2",
    name: "Pastillas de Freno Shimano",
    price: 12500,
    category: "Frenos",
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=400&fit=crop",
    description: "Pastillas de freno orgánicas para Shimano Deore, XT, SLX."
  },
  {
    id: "3",
    name: "Neumático Continental City",
    price: 28500,
    category: "Ruedas",
    image: "https://images.unsplash.com/photo-1558618047-f4b511d88421?w=400&h=400&fit=crop",
    description: "Neumático resistente para ciudad, 700x35c, con protección antipinchazos."
  },
  {
    id: "4",
    name: "Manillar BMX Pro",
    price: 35000,
    category: "Dirección",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
    description: "Manillar de acero cromado, 8.5\" rise, para BMX y dirt."
  },
  {
    id: "5",
    name: "Sillin Gel Comfort",
    price: 22000,
    category: "Sillin",
    image: "https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=400&h=400&fit=crop",
    description: "Sillin acolchado con gel para mayor comodidad en trayectos largos."
  },
  {
    id: "6",
    name: "Cenital Shimano Altus",
    price: 45000,
    category: "Transmisión",
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&h=400&fit=crop",
    description: "Cambio trasero Shimano Altus 8 velocidades, índice para MTB."
  }
];

export const categories = [
  "Todos",
  "Transmisión",
  "Frenos",
  "Ruedas",
  "Dirección",
  "Sillin"
];