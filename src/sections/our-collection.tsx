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
import { Product } from '@/types/database';

export default function OurCollection() {
  const [sectionRef, isVisible] = useScrollReveal(0.08);
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const result = await response.json();
        if (!result.success) throw new Error(result.error || 'Gagal mengambil data');
        setProducts(result.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section 
      id="product" 
      ref={sectionRef as any} 
      className="w-full py-16 md:py-24 bg-secondary overflow-hidden" 
      style={{ 
        opacity: isVisible ? 1 : 0, 
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)', 
        transition: 'opacity 600ms ease, transform 600ms ease' 
      }}
    >
      <div className="container mx-auto px-4">
        <SectionHeader title="Koleksi" highlightedText="Kami" />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Belum ada koleksi yang dipublikasikan.</p>
        ) : (
          <div className="relative w-full max-w-6xl mx-auto mt-12">
            <Carousel 
              opts={{ align: 'start', loop: true }} 
              setApi={undefined} 
              plugins={undefined}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {products.map((product) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-[90%] sm:basis-[45%] md:basis-1/3 lg:basis-1/4">
                    <div className="group relative overflow-hidden rounded-3xl h-[350px] md:h-[400px] shadow-lg transition-all duration-500 ease-out">
                      <img
                        src={product.image_url || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{product.name}</h3>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:flex">
                <CarouselPrevious className="left-2 xl:-left-12" />
                <CarouselNext className="right-2 xl:-right-12" />
              </div>
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
}