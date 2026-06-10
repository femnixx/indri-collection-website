import React, { useState, useEffect, useRef } from 'react';
import SectionHeader from '../components/ui/section-header';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import col1 from '../assets/images/20260608_175357.jpg';
import col2 from '../assets/images/20260608_180432.jpg';
import col3 from '../assets/images/20260608_181052.jpg';
import col4 from '../assets/images/20260608_181417.jpg';

export default function OurCollection() {
  const [isHovered, setIsHovered] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const images = [col1, col2, col3, col4];

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
      id="product"
      ref={sectionRef}
      className="w-full py-24 bg-[#F5FCFF]"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader title="Our" highlightedText="Collection" />
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto font-light">
          Discover our handpicked selection of premium fashion pieces designed for the modern individual
        </p>

        <div className="relative">
          {/* Collection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {images.map((img, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-2xl h-[400px]"
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
                }}
              >
                <img
                  src={img}
                  alt={`Collection item ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{
                    transform: isHovered === index ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-lg text-gray-400 hover:text-black transition-colors hidden md:block z-10"
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-lg text-gray-400 hover:text-black transition-colors hidden md:block z-10"
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
