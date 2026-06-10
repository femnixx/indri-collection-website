import React, { useEffect, useRef, useState } from 'react';
import SectionHeader from '../components/ui/section-header';
import { statistics } from '../constants';

export default function AboutUs() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about-us"
      ref={sectionRef}
      className="w-full py-24 bg-[#F5FCFF] relative overflow-hidden"
    >
      {/* Decorative Circles */}
      <div className="absolute top-10 left-1/2 w-32 h-32 bg-[#DDF4FF] rounded-full -translate-x-1/2 -z-10 opacity-70 blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-[#DDF4FF] rounded-full -z-10 opacity-70 blur-xl"></div>

      <div className="container mx-auto px-4 md:px-8 max-w-6xl">

        {/* Header fade in */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <SectionHeader title="About" highlightedText="Us" />
        </div>

        <div className="flex flex-col md:flex-row gap-16 items-center mt-12">

          {/* Text Content — slides in from left */}
          <div
            className="md:w-1/2 space-y-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
            }}
          >
            <p className="text-gray-700 leading-relaxed font-light">
              Indri Collection lahir dari keyakinan sederhana, bahwa pakaian yang indah bisa diciptakan oleh siapa saja, termasuk mereka yang selama ini sering terlupakan.
            </p>
            <p className="text-gray-700 leading-relaxed font-light">
              Kami adalah konveksi asal Malang yang dengan bangga memberdayakan teman-teman disabilitas sebagai bagian dari tim kami. Di balik setiap jahitan rapi yang sampai ke tangan Anda, ada kerja keras dan dedikasi mereka yang nyata — bukti bahwa kemampuan tidak pernah mengenal batas.
            </p>

            {/* Stats — staggered fade up */}
            <div className="flex gap-6 pt-6">
              {statistics.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-w-[140px]"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `opacity 0.5s ease ${0.4 + index * 0.12}s, transform 0.5s ease ${0.4 + index * 0.12}s`,
                  }}
                >
                  <h3 className="text-3xl font-bold text-[#00B2FF] mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image — slides in from right */}
          <div
            className="md:w-1/2 relative"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
              transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
            }}
          >
            <div
              className="rounded-3xl overflow-hidden shadow-2xl relative z-10 border-8 border-white"
              style={{
                transition: 'transform 0.4s ease, box-shadow 0.4s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 32px 64px rgba(0,0,0,0.18)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Store Interior"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
