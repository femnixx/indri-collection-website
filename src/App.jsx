import React from 'react';
import Header from './components/layout/header';
import Footer from './components/layout/footer';
import Hero from './sections/hero';
import AboutUs from './sections/about-us';
import OurCollection from './sections/our-collection';
import Testimonial from './sections/testimonial';
import Contact from './sections/contact';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-[#10324A] font-sans antialiased overflow-x-hidden">
      <Header />
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
