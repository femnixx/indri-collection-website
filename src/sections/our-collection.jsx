import React, { useState } from 'react';
import SectionHeader from '../components/ui/section-header';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/ui/carousel';
import { useScrollReveal } from '../hooks/use-scroll-reveal';

const imageModules = import.meta.glob(
  '../assets/images/collection-*.{webp,png,jpg,jpeg}',
  { eager: true }
);
const images = Object.keys(imageModules)
  .sort((a, b) => {
    const n = (s) => parseInt(s.match(/collection-(\d+)/)?.[1] || 0);
    return n(a) - n(b);
  })
  .map((path) => imageModules[path].default);

// Only stagger cards on desktop — on mobile animate the whole section at once
// to avoid dozens of simultaneous IntersectionObserver callbacks
const isMobileDevice = () => window.innerWidth < 768;

export default function OurCollection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [sectionRef, isVisible]     = useScrollReveal(0.08);

  return (
    <section
      id="product"
      ref={sectionRef}
      className="w-full py-24 bg-secondary"
      style={{
        opacity:    isVisible ? 1 : 0,
        transform:  isVisible ? 'translateY(0)' : 'translateY(24px)',
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
              {images.map((img, index) => (
                <CarouselItem key={index} className="pl-4 basis-full md:basis-1/4">
                  <div
                    className="group overflow-hidden rounded-2xl h-100 cursor-pointer"
                    // Only attach mouse handlers on desktop — touch devices
                    // don't use hover and the state updates can lag scroll
                    onMouseEnter={() => !isMobileDevice() && setHoveredIdx(index)}
                    onMouseLeave={() => !isMobileDevice() && setHoveredIdx(null)}
                  >
                    <img
                      src={img}
                      alt={`Item koleksi ${index + 1}`}
                      className="w-full h-full object-cover"
                      style={{
                        // translate instead of scale — doesn't trigger layout recalc
                        transform:  hoveredIdx === index ? 'scale(1.08)' : 'scale(1)',
                        transition: 'transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex absolute left-0 top-1/2 bg-white text-gray-400 hover:text-black shadow-lg border-0 w-12 h-12 cursor-pointer" />
            <CarouselNext    className="hidden md:flex absolute right-0 top-1/2 bg-white text-gray-400 hover:text-black shadow-lg border-0 w-12 h-12 cursor-pointer" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}