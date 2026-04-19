const services = [
  {
    icon: "🔧",
    title: "MANTENIMIENTO",
    description: "Revisiones completas, ajuste de cambios y frenos, lubricación de cadena y tensión de radios."
  },
  {
    icon: "⚙️",
    title: "REPARACIONES",
    description: "Arreglo de pinchazos, cambio de cubiertas, perbaikan de cambios, Frenos y transmisión."
  },
  {
    icon: "🎨",
    title: "PERSONALIZACIÓN",
    description: "Upgrade de componentes, instalación de luces, portaequipajes y accesorios personalizados."
  },
  {
    icon: "🛒",
    title: "VENTA DE PARTES",
    description: "Amplio inventario de repuestos, cadenas, frenos, neumáticos y accesorios para tu bicicleta."
  }
];

export default function Services() {
  return (
    <section id="servicios" className="py-20 bg-[#084C4C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-[#E6DAB9] tracking-wider mb-4">
            NUESTROS SERVICIOS
          </h2>
          <div className="w-24 h-1 bg-[#E6DAB9] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-[#063d3d] p-8 hover:bg-[#E6DAB9] transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-display text-[#E6DAB9] tracking-wider mb-4 group-hover:text-[#084C4C]">
                {service.title}
              </h3>
              <p className="text-[#E6DAB9]/70 group-hover:text-[#084C4C]/90">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}