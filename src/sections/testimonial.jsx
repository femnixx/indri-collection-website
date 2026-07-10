import React, { useEffect } from 'react';
import SectionHeader from '../components/ui/section-header';
import { useScrollReveal } from '../hooks/use-scroll-reveal';

export default function Testimonial() {
  const [sectionRef, isVisible] = useScrollReveal(0.08);

useEffect(() => {
    // 1. Suntik script Elfsight
    if (!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // 2. Terminator Mode (Tanpa Henti)
    const intervalId = setInterval(() => {
      // Cari SEMUA tautan (link) yang ada di halaman
      const allLinks = document.querySelectorAll('a');
      
      allLinks.forEach(link => {
        // Jika link mengarah ke elfsight ATAU teksnya mengandung kata "Free Google"
        if (link.href.includes('elfsight.com') || link.textContent.includes('Free Google')) {
          // Paksa sembunyikan via inline CSS agar tidak merusak layout
          link.style.setProperty('display', 'none', 'important');
          link.style.setProperty('opacity', '0', 'important');
          // Hancurkan elemennya dari HTML
          link.remove(); 
        }
      });
    }, 500); // Lakukan patroli setiap 0.5 detik tanpa henti

    // Interval hanya akan dibersihkan jika pengunjung pindah ke halaman lain (unmount)
    return () => clearInterval(intervalId);
  }, []);
  return (
    <section id="testimonial" ref={sectionRef} className="w-full py-24 bg-secondary overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <div style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 600ms ease, transform 600ms ease',
        }}>
          <SectionHeader title="Apa Kata" highlightedText="Pelanggan Kami" />
        </div>
        
        <p className="text-center text-gray-500 mb-16 font-light"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 600ms ease 100ms, transform 600ms ease 100ms',
          }}>
          Dengarkan dari mereka yang menyukai koleksi kami
        </p>

        {/* --- WIDGET ELFSIGHT --- */}
        <div style={{
            opacity: isVisible ? 1 : 0, 
            transition: 'opacity 600ms ease 200ms',
            display: 'flex',
            justifyContent: 'center' 
        }}>
           <div className="elfsight-app-20ab98bf-5091-4c5e-9be1-592fc437f319" data-elfsight-app-lazy></div>
        </div>

      </div>
    </section>
  );
}