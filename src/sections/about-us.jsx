import React from 'react';
import SectionHeader from '../components/ui/section-header';
import { statistics } from '../constants';
import aboutImg from '../assets/images/About.webp';
import { useScrollReveal } from '../hooks/use-scroll-reveal';

// Single shared reveal for the whole section — avoids multiple IntersectionObservers
export default function AboutUs() {
  const [sectionRef, isVisible] = useScrollReveal(0.1);

  const fade = (delay = '0ms', fromX = null) => ({
    opacity:    isVisible ? 1 : 0,
    transform:  isVisible
      ? 'translate(0,0)'
      : fromX
        ? `translateX(${fromX})`
        : 'translateY(20px)',
    transition: `opacity 650ms ease ${isVisible ? delay : '0ms'},
                 transform 650ms ease ${isVisible ? delay : '0ms'}`,
  });

  return (
    <section
      id="about-us"
      ref={sectionRef}
      className="w-full py-24 bg-secondary relative overflow-hidden"
    >
      {/* Decorative blobs — hidden on mobile to save GPU layers */}
      <div className="hidden md:block absolute top-10 left-1/2 w-32 h-32 bg-[#DDF4FF] rounded-full -translate-x-1/2 -z-10 opacity-70 blur-xl" />
      <div className="hidden md:block absolute bottom-10 left-10 w-24 h-24 bg-[#DDF4FF] rounded-full -z-10 opacity-70 blur-xl" />

      <div className="container mx-auto px-4 md:px-8 max-w-6xl">

        <div style={fade('0ms')}>
          <SectionHeader title="Tentang" highlightedText="Kami" />
        </div>

        <div className="flex flex-col md:flex-row gap-16 items-center mt-12">

          {/* Text — slides from left */}
          <div className="md:w-1/2 space-y-6" style={fade('150ms', '-30px')}>
            <p className="text-gray-700 leading-relaxed font-light">
              Indri Collection lahir dari keyakinan sederhana, bahwa pakaian yang indah bisa
              diciptakan oleh siapa saja, termasuk mereka yang selama ini sering terlupakan.
            </p>
            <p className="text-gray-700 leading-relaxed font-light">
              Kami adalah konveksi asal Malang yang dengan bangga memberdayakan teman-teman
              disabilitas sebagai bagian dari tim kami. Di balik setiap jahitan rapi yang sampai
              ke tangan Anda, ada kerja keras dan dedikasi mereka yang nyata — bukti bahwa
              kemampuan tidak pernah mengenal batas.
            </p>

            {/* Stats — staggered, but only 2 items so this is fine */}
            <div className="flex gap-6 pt-6">
              {statistics.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-w-[140px]"
                  style={{
                    opacity:    isVisible ? 1 : 0,
                    transform:  isVisible ? 'translateY(0)' : 'translateY(16px)',
                    transition: `opacity 500ms ease ${isVisible ? `${350 + i * 100}ms` : '0ms'},
                                 transform 500ms ease ${isVisible ? `${350 + i * 100}ms` : '0ms'}`,
                  }}
                >
                  <h3 className="text-3xl font-bold text-highlight mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image — slides from right, no hover scale on mobile */}
          <div className="md:w-1/2 relative" style={fade('250ms', '30px')}>
            <div className="rounded-3xl overflow-hidden shadow-2xl relative z-10 border-8 border-white
              md:hover:scale-[1.02] md:hover:shadow-[0_32px_64px_rgba(0,0,0,0.18)]
              transition-transform duration-400 ease-out">
              <img
                src={aboutImg}
                alt="Indri Collection Store"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}