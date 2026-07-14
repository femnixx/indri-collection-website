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
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [sectionRef, isVisible] = useScrollReveal(0.08);
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Gagal mengambil data produk');
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
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

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400">Belum ada koleksi yang dipublikasikan.</p>
        ) : (
          <div className="relative px-4 md:px-0">
            <Carousel opts={{ align: 'center', loop: true }} setApi={undefined} plugins={[]} className="w-full">
              <CarouselContent className="-ml-4 py-8">
                {products.map((product, index) => (
                  <CarouselItem key={product.id} className="pl-4 basis-4/5 md:basis-1/3 lg:basis-1/4">
                    <div
                      className="group relative overflow-hidden rounded-3xl h-[400px] cursor-pointer shadow-xl transition-all duration-500 ease-out"
                      style={{
                        transform: hoveredIdx === index ? 'translateY(-12px)' : 'translateY(0)',
                      }}
                      onMouseEnter={() => !isMobile && setHoveredIdx(index)}
                      onMouseLeave={() => !isMobile && setHoveredIdx(null)}
                    >
                      {/* Image Parallax/Zoom Effect */}
                      <img
                        src={product.image_url || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Text Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {product.categories?.name || 'Koleksi'}
                        </span>
                        <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">
                          {product.name}
                        </h3>
                        {product.price && (
                          <p className="text-gray-300 font-medium">
                            Rp {product.price.toLocaleString('id-ID')}
                          </p>
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex absolute -left-4 top-1/2 bg-white text-gray-600 hover:text-black hover:bg-gray-50 shadow-xl border-0 w-14 h-14 cursor-pointer scale-110" />
              <CarouselNext className="hidden md:flex absolute -right-4 top-1/2 bg-white text-gray-600 hover:text-black hover:bg-gray-50 shadow-xl border-0 w-14 h-14 cursor-pointer scale-110" />
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
}