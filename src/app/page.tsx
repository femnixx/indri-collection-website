// src/app/page.tsx
import MobileMenu from '../components/layout/header';
import Hero from '../sections/hero';
import AboutUs from '../sections/about-us';
import OurCollection from '../sections/our-collection';
import Testimonial from '../sections/testimonial';
import Contact from '../sections/contact';
import Footer from '../components/layout/footer';

export default function HomePage() {
  return (
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
  );
}