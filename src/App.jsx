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

  return (
    <div className="font-sans overflow-x-hidden text-neutral-900 bg-neutral-50">
      <SectionOne />
      <About />
      <Product />
    </div>
  )
}

export default App;