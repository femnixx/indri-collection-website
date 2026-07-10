"use client";

import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/ui/section-header';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/ui/carousel';
import { useScrollReveal } from '../hooks/use-scroll-reveal';

// 💡 SOLUSI: Jangan gunakan require() untuk file di folder public.
// Langsung buat daftar path string-nya.
const totalImages = 14; 
const images = Array.from({ length: totalImages }, (_, i) => `/images/collection-${i + 1}.webp`);

export default function OurCollection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [sectionRef, isVisible] = useScrollReveal(0.08);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      id="product"
      ref={sectionRef}
      className="w-full py-24 bg-secondary"
      style={{
        opacity:   isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 600ms ease, transform 600ms ease',
      }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader title="Koleksi" highlightedText="Kami" />
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto font-light">
          Temukan berbagai pilihan busana premium yang dirancang khusus untuk Anda
        </p>

        <div className="relative px-4 md:px-0">
          <Carousel opts={{ align: 'start', loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {images.map((imageSrc, index) => (
                <CarouselItem key={index} className="pl-4 basis-full md:basis-1/4">
                  <div
                    className="group overflow-hidden rounded-2xl h-100 cursor-pointer"
                    onMouseEnter={() => !isMobile && setHoveredIdx(index)}
                    onMouseLeave={() => !isMobile && setHoveredIdx(null)}
                  >
                    <img
                      src={imageSrc}
                      alt={`Item koleksi ${index + 1}`}
                      className="w-full h-full object-cover"
                      style={{
                        transform:  hoveredIdx === index ? 'scale(1.08)' : 'scale(1)',
                        transition: 'transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex absolute left-0 top-1/2 bg-white text-gray-400 hover:text-black shadow-lg border-0 w-12 h-12 cursor-pointer" />
            <CarouselNext     className="hidden md:flex absolute right-0 top-1/2 bg-white text-gray-400 hover:text-black shadow-lg border-0 w-12 h-12 cursor-pointer" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}