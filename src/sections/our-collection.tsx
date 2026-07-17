"use client";

import React, { useState, useEffect } from 'react';
import Autoplay from "embla-carousel-autoplay";
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
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products');
        const result = await response.json();
        if (!result.success) throw new Error(result.error || 'Gagal mengambil data');
        
        let fetchedProducts = result.data;
        
        // If less than 6 products, duplicate them to fill the carousel
        if (fetchedProducts.length < 6) {
          const duplicateCount = Math.ceil(12 / fetchedProducts.length);
          const duplicated = [];
          for (let i = 0; i < duplicateCount; i++) {
            duplicated.push(...fetchedProducts.map((p, idx) => ({
              ...p,
              id: `${p.id}-${i}-${idx}`, // Unique key for each duplicate
            })));
          }
          fetchedProducts = duplicated.slice(0, 12); // Limit to 12 items
        }
        
        setProducts(fetchedProducts);
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
      className="w-full py-12 md:py-20 bg-secondary overflow-hidden" 
      style={{ 
        opacity: isVisible ? 1 : 0, 
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)', 
        transition: 'opacity 600ms ease, transform 600ms ease' 
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Koleksi" highlightedText="Kami" />
        
        {isLoading ? (
          // Loading state
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          // Empty state
          <p className="text-center text-gray-400 py-16 text-sm sm:text-base">
            Belum ada koleksi yang dipublikasikan.
          </p>
        ) : (
          // Infinite carousel
          <div className="w-full mt-8 sm:mt-12">
            <Carousel 
              opts={{
                align: 'start',
                loop: true,
                slidesToScroll: 1,
              }}
              plugins={[
                Autoplay({
                  delay: 5000, // 5 seconds between slides
                  stopOnInteraction: false, // Don't pause on click
                  stopOnMouseEnter: false, // Don't pause on hover
                }),
              ]}
              setApi={undefined}
              className="w-full"
            >
              <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
                {products.map((product) => (
                  <CarouselItem 
                    key={product.id} 
                    className="pl-2 sm:pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl h-[280px] xs:h-[320px] sm:h-[360px] md:h-[400px] lg:h-[420px] shadow-lg transition-all duration-500 ease-out">
                      <img
                        src={product.image_url || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white line-clamp-2">
                          {product.name}
                        </h3>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation buttons - hidden on small screens, visible on larger screens */}
              <div className="hidden lg:flex justify-center gap-4 mt-8">
                <CarouselPrevious className="relative left-0 top-0 -translate-y-0 w-12 h-12" />
                <CarouselNext className="relative right-0 top-0 -translate-y-0 w-12 h-12" />
              </div>
            </Carousel>

            {/* Mobile indicator text */}
            <p className="text-center text-gray-500 text-xs sm:text-sm mt-6 lg:hidden">
              Geser untuk melihat lebih banyak
            </p>
          </div>
        )}
      </div>
    </section>
  );
}