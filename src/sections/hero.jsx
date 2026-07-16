"use client";

import { useEffect } from 'react';
import { useScrollReveal } from '../hooks/use-scroll-reveal';
import { settingsRepository } from '@/repositories/settingsRepository';

function Hero() {
  const [sectionRef, sectionVisible] = useScrollReveal(0.05);
  const [settings, setSettings] = useState(null);

  useEffect(() => { 
    async function loadSettings() {
      try {
        const data = await settingsRepository.fetchPublicSettings();
        setSettings(data);
      } catch (error) {
        console.error("Gagal mengambil data dari Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const fadeUp = (delay = '0ms') => ({
    style: {
      opacity: sectionVisible ? 1 : 0,
      transform: sectionVisible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 700ms ease ${sectionVisible ? delay : '0ms'},
                   transform 700ms ease ${sectionVisible ? delay : '0ms'}`,
    },
  });

  return (
    <div
      id="home"
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-primary bg-fabric-matrix"
    >
      {/* Background image: Path is relative to the 'public' folder */}
      <img
        src="/images/Main.webp"
        alt="Hero background"
        style={{
          opacity: sectionVisible ? 1 : 0,
          transition: 'opacity 1000ms ease',
        }}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlay */}
      <div
        style={{
          opacity: sectionVisible ? 1 : 0,
          transition: 'opacity 800ms ease 100ms',
        }}
        className="absolute inset-0 bg-primary/60"
      />

      {/* Decorative elements */}
      <div
        className="hidden md:block absolute right-[5%] top-[10%] text-[160px] opacity-10 pointer-events-none select-none"
        style={{
          opacity: sectionVisible ? 0.1 : 0,
          transform: sectionVisible ? 'rotate(0deg)' : 'rotate(-20deg) translateX(12px)',
          transition: 'opacity 1000ms ease 200ms, transform 1000ms ease 200ms',
        }}
      >
        🪡
      </div>

      <div
        className="hidden md:block absolute right-[-100px] bottom-[-50px] w-[450px] h-[450px] bg-[#5EA1E4]/10 rounded-full border-4 border-dashed border-[#5EA1E4]/20 pointer-events-none"
        style={{
          opacity: sectionVisible ? 1 : 0,
          transition: 'opacity 900ms ease 150ms',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full min-h-screen px-6 md:px-16 lg:px-24 pt-24 pb-24">
        <div className="max-w-xl">
          <h1 style={fadeUp('300ms').style}
            className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-2 tracking-tight">
            Temukan
          </h1>

          <h1 style={fadeUp('420ms').style}
            className="text-4xl md:text-6xl font-extrabold text-accent leading-tight mb-4 tracking-tight">
            Gaya Terbaikmu
          </h1>

          <p style={fadeUp('540ms').style}
            className="text-sm md:text-base text-gray-200 mb-8 leading-relaxed max-w-sm md:max-w-md font-normal">
            Indri Collection adalah usaha konveksi pemberdayaan disabilitas di Malang,
            menghasilkan ragam pakaian dengan{' '}
            <span className="text-accent font-medium">kualitas jahitan premium</span> yang penuh ketelitian.
          </p>

          <div style={fadeUp('640ms').style} className="flex flex-col sm:flex-row items-center gap-4">
            <a href="#product"
              className="inline-flex items-center gap-2 bg-accent hover:-translate-y-1 hover:shadow-accent/30
                border-2 border-transparent active:scale-95 text-white text-sm md:text-base font-bold
                px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg">
              Jelajahi Koleksi
            </a>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div style={{
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 700ms ease 500ms, transform 700ms ease 500ms',
        }}
        className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none" className="w-full h-16 md:h-20">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" className="fill-secondary" />
        </svg>
      </div>

      {/* WhatsApp FAB */}
      <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noopener noreferrer"
        aria-label="Chat via WhatsApp"
        style={{
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'scale(1)' : 'scale(0.5)',
          transition: 'opacity 500ms ease 900ms, transform 500ms ease 900ms',
        }}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white
          w-14 h-14 rounded-full flex items-center justify-center shadow-xl
          hover:-translate-y-1 active:scale-95 border border-white/20 transition-colors duration-300">
        <img src="/Icon.png" alt="WhatsApp" className="w-8 h-8 object-contain" />
      </a>
    </div>
  );
}

export default Hero;