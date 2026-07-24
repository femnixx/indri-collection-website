"use client";

import SectionHeader from '@/components/ui/section-header';
import { statistics } from '@/constants';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

export default function AboutUs() {
  const [sectionRef, isVisible] = useScrollReveal(0.1);

  const fade = (delay = '0ms', fromX = null) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? 'translate(0,0)'
      : fromX ? `translateX(${fromX})` : 'translateY(20px)',
    transition: `opacity 650ms ease ${isVisible ? delay : '0ms'}, transform 650ms ease ${isVisible ? delay : '0ms'}`,
  });

  return (
    <section id="about-us" ref={sectionRef} className="w-full py-20 md:py-28 bg-secondary relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-7xl">
        
        <div style={fade('0ms')}>
            <SectionHeader title="Tentang" highlightedText="Kami" />
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mt-12 md:mt-16">
          
          <div className="w-full lg:w-1/2 space-y-6" style={fade('150ms', '-30px')}>
            <div className="space-y-4">
                {/* Teks dibuat sedikit lebih kecil (text-base) agar lebih profesional & rapi */}
                <p className="text-gray-700 text-base md:text-lg leading-relaxed font-light">
                  Indri Collection lahir dari keyakinan sederhana, bahwa pakaian yang indah bisa diciptakan oleh siapa saja.
                </p>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed font-light">
                  Kami adalah konveksi asal Malang yang memberdayakan teman-teman disabilitas.
                </p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2">
              {statistics.map((stat, i) => (
                <div key={i} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 min-w-[140px]" 
                  style={{ opacity: isVisible ? 1 : 0, transition: `opacity 500ms ease ${350 + i * 100}ms` }}>
                  {/* Angka sedikit diperkecil agar seimbang dengan ukuran teks paragraf */}
                  <h3 className="text-2xl md:text-3xl font-bold text-highlight mb-1">{stat.value}</h3>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative" style={fade('250ms', '30px')}>
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src="/images/About.webp"
                alt="Indri Collection Store"
                className="w-full h-[350px] md:h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}