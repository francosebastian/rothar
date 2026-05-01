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
                  <p className="text-[#084C4C]/70">Pasaje Los Alvarado, Bollenar, Chile</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#084C4C] flex items-center justify-center text-[#E6DAB9] text-xl">
                  📞
                </div>
                <div>
                  <h4 className="font-display text-[#084C4C] tracking-wider">TELÉFONO</h4>
                  <p className="text-[#084C4C]/70">+56959511421</p>
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

          <div className="bg-[#084C4C] p-1 shadow-xl overflow-hidden" style={{ height: '400px' }}>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.464604921671!2d-71.1894602!3d-33.5709681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662f73496af0b1d%3A0x14be43b6edb28d8e!2sRothar!5e0!3m2!1ses!2scl!4v1714532000000!5m2!1ses!2scl"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Rothar Workshop"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}