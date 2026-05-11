import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ProductsPreview from "@/components/ProductsPreview";
import BlogPreview from "@/components/BlogPreview";
import VideosPreview from "@/components/VideosPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const revalidate = 60;

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <Services />
      <ProductsPreview />
      <BlogPreview />
      <VideosPreview />
      <Contact />
      <Footer />
    </main>
  );
}