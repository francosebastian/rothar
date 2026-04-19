import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ProductsPreview from "@/components/ProductsPreview";
import BlogPreview from "@/components/BlogPreview";
import VideosPreview from "@/components/VideosPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <div className="text-center my-8">
        <a href="/servicios" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out">
          Agenda tu Cita Ahora
        </a>
      </div>
      <Services />
      <ProductsPreview />
      <BlogPreview />
      <VideosPreview />
      <Contact />
      <Footer />
    </main>
  );
}