import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Products from '@/components/Products';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#121212] selection:bg-amber-400 selection:text-black">
      {/* Sticky Top Header Navigation */}
      <Navbar />

      {/* Main Sections */}
      <Hero />
      <About />
      <Products />
      <Testimonials />
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
