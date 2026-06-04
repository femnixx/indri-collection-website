import MobileMenu from './components/MobileMenu.jsx'
import HeroSection from './pages/HeroSection.jsx'
import { ContactSection, Footer } from './pages/ContactSection.jsx'
// import AboutUs from './sections/about-us'
// import OurCollection from './sections/our-collection'
// import Testimonial from './sections/testimonial'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-[#10324A] font-sans antialiased overflow-x-hidden">
      <MobileMenu />
      <main>
        <HeroSection />
        {/* <AboutUs /> */}
        {/* <OurCollection /> */}
        {/* <Testimonial /> */}
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
