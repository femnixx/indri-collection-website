import Footer from './components/layout/footer.jsx';
import MobileMenu from './components/layout/header.jsx';
import AboutUs from './sections/about-us';
import Contact from './sections/contact.jsx';
import Hero from './sections/hero.jsx';
import OurCollection from './sections/our-collection';
import Testimonial from './sections/testimonial';

export default function App() {
  // Styles like min-h-screen, bg-color, text-color, etc., are now handled globally in index.css
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
  )
}
