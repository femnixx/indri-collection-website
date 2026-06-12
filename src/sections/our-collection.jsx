import React, { useState, useEffect, useRef } from 'react';
import SectionHeader from '../components/ui/section-header';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/ui/carousel';
const imageModules = import.meta.glob('../assets/images/collection-*.{webp,png,jpg,jpeg}', { eager: true });

const images = Object.keys(imageModules)
  .sort((a, b) => {
    const numA = parseInt(a.match(/collection-(\d+)/)?.[1] || 0);
    const numB = parseInt(b.match(/collection-(\d+)/)?.[1] || 0);
    return numA - numB;
  })
  .map(path => imageModules[path].default);

export default function OurCollection() {
  const [isHovered, setIsHovered] = useState(null);
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
        <SectionHeader title="Koleksi" highlightedText="Kami" />
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto font-light">
          Temukan berbagai pilihan busana premium yang dirancang khusus untuk Anda
        </p>

        <div className="relative px-4 md:px-0">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {images.map((img, index) => (
                <CarouselItem key={index} className="pl-4 basis-full md:basis-1/4">
                  <div
                    className="group overflow-hidden rounded-2xl h-100 cursor-pointer"
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
                      alt={`Item koleksi ${index + 1}`}
                      className="w-full h-full object-cover"
                      style={{
                        transform: isHovered === index ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex absolute left-0 top-1/2 bg-white text-gray-400 hover:text-black shadow-lg border-0 w-12 h-12 cursor-pointer" />
            <CarouselNext className="hidden md:flex absolute right-0 top-1/2 bg-white text-gray-400 hover:text-black shadow-lg border-0 w-12 h-12 cursor-pointer" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
