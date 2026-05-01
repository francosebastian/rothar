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
    image: "https://i0.wp.com/www.evobikes.cl/wp-content/uploads/2023/07/cadena_m8100.jpg?fit=700%2C700&ssl=1",
    description: "Cadena de 6-7-8 velocidades compatible con la mayoría de bicis urbanas y de montaña."
  },
  {
    id: "2",
    name: "Pastillas de Freno Shimano",
    price: 12500,
    category: "Frenos",
    image: "https://cdnx.jumpseller.com/full-bike/image/41315570/resize/1122/1122?1743093532",
    description: "Pastillas de freno orgánicas para Shimano Deore, XT, SLX."
  },
  {
    id: "3",
    name: "Neumático Continental City",
    price: 28500,
    category: "Ruedas",
    image: "https://mibicio.cl/wp-content/uploads/2022/05/contact.jpg",
    description: "Neumático resistente para ciudad, 700x35c, con protección antipinchazos."
  },
  {
    id: "4",
    name: "Manillar BMX Pro",
    price: 35000,
    category: "Dirección",
    image: "https://roda.cl/cdn/shop/files/1894_4f228a33-af30-4907-b71e-6c6de34b03f6.jpg?v=1709664708&width=1445",
    description: "Manillar de acero cromado, 8.5\" rise, para BMX y dirt."
  },
  {
    id: "5",
    name: "Sillin Gel Comfort",
    price: 22000,
    category: "Sillin",
    image: "https://mibicio.cl/wp-content/uploads/2022/05/27320-130_SDDL_BG-COMFORT-GEL-SADDLE-BLK-200_HERO.jpg",
    description: "Sillin acolchado con gel para mayor comodidad en trayectos largos."
  },
  {
    id: "6",
    name: "Pata de cambio Microshift",
    price: 45000,
    category: "Transmisión",
    image: "https://satiro.cl/cdn/shop/files/Pata-de-cambio-Microshift-10v-web.jpg?v=1736641408&width=1445",
    description: "Cambio trasero Microshift."
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