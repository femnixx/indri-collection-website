'use client';

import { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/use-scroll-reveal';
import { settingsRepository, FALLBACK_SETTINGS } from '@/repositories/settingsRepository';

export default function Hero() {
  const [sectionRef, sectionVisible] = useScrollReveal(0.05);
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);

  useEffect(() => {
    let isMounted = true;
    settingsRepository.fetchPublicSettings().then((data) => {
      if (isMounted && data) setSettings(data);
    });
    return () => { isMounted = false; };
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
    <div id="home" ref={sectionRef} className="relative w-full min-h-screen overflow-hidden bg-primary bg-fabric-matrix flex flex-col justify-between">
      {/* Background Media */}
      <img
        src="/images/Main.webp"
        alt="Hero background"
        style={{ opacity: sectionVisible ? 1 : 0, transition: 'opacity 1000ms ease' }}
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />
      <div 
        style={{ opacity: sectionVisible ? 1 : 0, transition: 'opacity 800ms ease 100ms' }} 
        className="absolute inset-0 bg-primary/60 z-0" 
      />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center flex-grow px-6 md:px-16 lg:px-24 pt-32 pb-20">
        <div className="max-w-xl">
          <h1 style={fadeUp('300ms').style} className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-2 tracking-tight">
            Temukan
          </h1>
          <h1 style={fadeUp('420ms').style} className="text-4xl md:text-6xl font-extrabold text-accent leading-tight mb-4 tracking-tight">
            Gaya Terbaikmu
          </h1>
          <p style={fadeUp('540ms').style} className="text-sm md:text-base text-gray-200 mb-8 leading-relaxed max-w-sm md:max-w-md font-normal">
            Indri Collection adalah usaha konveksi pemberdayaan disabilitas di Malang, menghasilkan ragam pakaian dengan <span className="text-accent font-medium">kualitas jahitan premium</span> yang penuh ketelitian.
          </p>
          <div style={fadeUp('640ms').style}>
            <a href="#product" className="inline-flex items-center gap-2 bg-accent hover:-translate-y-1 hover:shadow-accent/30 border-2 border-transparent active:scale-95 text-white text-sm md:text-base font-bold px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg">
              Jelajahi Koleksi
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Needle Emoji */}
      <div 
        className="hidden md:block absolute right-[5%] top-[10%] text-[160px] opacity-10 pointer-events-none select-none z-10" 
        style={{ opacity: sectionVisible ? 0.1 : 0, transition: 'opacity 1000ms ease 200ms' }}
      >
        🪡
      </div>
      
      {/* Wave Divider - Pin to absolute bottom */}
      <div 
        style={{
          opacity: sectionVisible ? 1 : 0,
          transition: 'opacity 700ms ease 500ms',
        }}
        className="absolute bottom-0 left-0 w-full z-10 leading-none pointer-events-none"
      >
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-secondary block">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>

      {/* DynamicWhatsApp FAB */}
      <a 
        href={`https://wa.me/${settings.whatsapp_number}`} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Chat via WhatsApp"
        style={{
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'scale(1)' : 'scale(0.5)',
          transition: 'opacity 500ms ease 900ms, transform 500ms ease 900ms',
        }}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl border border-white/20 transition-all duration-300 animate-whatsapp-bounce"
        onMouseEnter={(e) => {
          e.currentTarget.style.animation = 'none';
          e.currentTarget.style.transform = 'scale(1.15) rotate(-8deg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animation = '';
          e.currentTarget.style.transform = '';
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      <style jsx>{`
        @keyframes whatsappBounce {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-8px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }
        .animate-whatsapp-bounce {
          animation: whatsappBounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}