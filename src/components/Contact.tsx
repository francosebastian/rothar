export default function Contact() {
  return (
    <section id="contacto" className="py-20 bg-[#E6DAB9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-display text-[#084C4C] tracking-wider mb-4">
              CONTÁCTANOS
            </h2>
            <div className="w-24 h-1 bg-[#084C4C] mb-8"></div>
            <p className="text-[#084C4C]/70 text-lg mb-8">
              ¿Tienes dudas sobre tu bicicleta? ¿Necesitas un presupuesto? 
              Escríbenos o visítanos directamente en el taller.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#084C4C] flex items-center justify-center text-[#E6DAB9] text-xl">
                  📍
                </div>
                <div>
                  <h4 className="font-display text-[#084C4C] tracking-wider">DIRECCIÓN</h4>
                  <p className="text-[#084C4C]/70">Calle Falsa 123, Santiago, Chile</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#084C4C] flex items-center justify-center text-[#E6DAB9] text-xl">
                  📞
                </div>
                <div>
                  <h4 className="font-display text-[#084C4C] tracking-wider">TELÉFONO</h4>
                  <p className="text-[#084C4C]/70">+56 9 1234 5678</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#084C4C] flex items-center justify-center text-[#E6DAB9] text-xl">
                  ✉️
                </div>
                <div>
                  <h4 className="font-display text-[#084C4C] tracking-wider">EMAIL</h4>
                  <p className="text-[#084C4C]/70">contacto@rothar.cl</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#084C4C] p-8 shadow-xl">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#E6DAB9] mb-1">Nombre</label>
                <input
                  type="text"
                  className="w-full bg-[#063d3d] border-none px-4 py-3 focus:ring-2 focus:ring-[#E6DAB9] transition-all outline-none text-[#E6DAB9] placeholder-[#E6DAB9]/50"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E6DAB9] mb-1">Email</label>
                <input
                  type="email"
                  className="w-full bg-[#063d3d] border-none px-4 py-3 focus:ring-2 focus:ring-[#E6DAB9] transition-all outline-none text-[#E6DAB9] placeholder-[#E6DAB9]/50"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E6DAB9] mb-1">Mensaje</label>
                <textarea
                  rows={4}
                  className="w-full bg-[#063d3d] border-none px-4 py-3 focus:ring-2 focus:ring-[#E6DAB9] transition-all outline-none resize-none text-[#E6DAB9] placeholder-[#E6DAB9]/50"
                  placeholder="¿En qué podemos ayudarte?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#E6DAB9] text-[#084C4C] py-4 font-display text-xl tracking-wider hover:bg-[#d4c9a5] transition-colors"
              >
                ENVIAR MENSAJE
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}