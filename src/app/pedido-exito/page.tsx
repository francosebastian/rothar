import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      
      <section className="flex-1 flex items-center justify-center bg-[#E6DAB9]">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <svg className="w-24 h-24 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-display text-[#084C4C] tracking-wider mb-4">
            ¡PEDIDO RECIBIDO!
          </h1>
          <p className="text-[#084C4C]/70 text-lg mb-8">
            Gracias por tu compra. Hemos recibido tu pedido y nos pondremos en contacto contigo pronto para coordinar el envío.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tienda"
              className="bg-[#084C4C] text-[#E6DAB9] px-8 py-4 font-display text-lg tracking-wider hover:bg-[#063d3d] transition-colors inline-block"
            >
              SEGUIR COMPRANDO
            </Link>
            <Link 
              href="/"
              className="bg-transparent border-2 border-[#084C4C] text-[#084C4C] px-8 py-4 font-display text-lg tracking-wider hover:bg-[#084C4C] hover:text-[#E6DAB9] transition-colors inline-block"
            >
              VOLVER AL INICIO
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
