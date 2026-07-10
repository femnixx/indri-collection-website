<<<<<<< HEAD
import { useEffect } from 'react';
import SectionOne from './pages/SectionOne.jsx';
import About from './components/About.jsx';
import Product from './components/Product.jsx';

function App() {
  // Script Animasi: Nyalain class "active" pas elemennya kelihatan di layar
  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
=======
import Footer from './components/layout/footer.jsx';
import MobileMenu from './components/layout/header.jsx';
import AboutUs from './sections/about-us';
import Contact from './sections/contact.jsx';
import Hero from './sections/hero.jsx';
import OurCollection from './sections/our-collection';
import Testimonial from './sections/testimonial';
>>>>>>> bc207850476d2bcf910d8720205df7d223491e7d

export default function App() {
  // Styles like min-h-screen, bg-color, text-color, etc., are now handled globally in index.css
  return (
<<<<<<< HEAD
    <div className="font-sans overflow-x-hidden text-neutral-900 bg-neutral-50">
      <SectionOne />
      <About />
      <Product />
    </div>
  )
}

export default App;
=======
    <div className="min-h-screen">
      <MobileMenu />
      <main>
        <Hero />
        <AboutUs />     
        <OurCollection />
        <Testimonial />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
>>>>>>> bc207850476d2bcf910d8720205df7d223491e7d
