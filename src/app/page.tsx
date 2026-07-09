// src/app/page.tsx

// Remove the MobileMenu and Footer imports from here!
import Hero from '../sections/hero';
import AboutUs from '../sections/about-us';
import OurCollection from '../sections/our-collection';
import Testimonial from '../sections/testimonial';
import Contact from '../sections/contact';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Handled by LayoutContentWrapper globally */}
      <main>
        <Hero />
        <AboutUs />     
        <OurCollection />
        <Testimonial />
        <Contact />
      </main>
      {/* Handled by LayoutContentWrapper globally */}
    </div>
  );
}