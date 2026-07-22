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
import { supabaseData as supabase } from '@/lib/supabaseClient';

export default function OurCollection() {
  const [sectionRef, isVisible] = useScrollReveal(0.08);
  const [images, setImages] = useState<{ url: string; category?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllImages = async () => {
      const allImages: { url: string; category?: string }[] = [];
      
      try {
        const { data: folders } = await supabase.storage.from('products').list();
        
        if (folders) {
          for (const folder of folders) {
            if (folder.id === null && folder.name) {
              const { data: files } = await supabase.storage.from('products').list(folder.name);
              
              if (files) {
                for (const file of files) {
                  if (file.name !== '.keep') {
                    const { data } = supabase.storage.from('products').getPublicUrl(`${folder.name}/${file.name}`);
                    allImages.push({ url: data.publicUrl, category: folder.name });
                  }
                }
              }
            }
          }
        }
        
        // Shuffle images for variety
        const shuffled = allImages.sort(() => Math.random() - 0.5);
        setImages(shuffled);
        console.log(`Loaded ${allImages.length} images from storage bucket`);
      } catch (error) {
        console.error('Gagal mengambil gambar dari bucket:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllImages();
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
        ) : images.length === 0 ? (
          <p className="text-center text-gray-400">Tidak ada gambar yang ditampilkan.</p>
        ) : (
          <InfiniteCarousel images={images} />
        )}
      </div>
    </section>
  );
}

function InfiniteCarousel({ images }: { images: { url: string; category?: string }[] }) {
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    if (!api) return;

    let isPaused = false;
    let interval: NodeJS.Timeout;

    const startAutoscroll = () => {
      interval = setInterval(() => {
        if (!isPaused) {
          api.scrollNext();
        }
      }, 2500);
    };

    const stopAutoscroll = () => {
      if (interval) clearInterval(interval);
    };

    startAutoscroll();

    const root = api.rootNode();
    if (root) {
      root.addEventListener('mouseenter', () => { isPaused = true; });
      root.addEventListener('mouseleave', () => { isPaused = false; });
    }

    return () => {
      stopAutoscroll();
      if (root) {
        root.removeEventListener('mouseenter', () => { isPaused = true; });
        root.removeEventListener('mouseleave', () => { isPaused = false; });
      }
    };
  }, [api]);

  // Repeat images many times to create a truly infinite feel
  const REPEAT_COUNT = 10;
  const repeatedImages = Array.from({ length: REPEAT_COUNT }).flatMap((_, i) =>
    images.map((item, index) => ({
      ...item,
      _key: `${i}-${item.url}-${index}`
    }))
  );

  return (
    <Carousel 
      opts={{ 
        align: 'start', 
        loop: true,
        slidesToScroll: 1,
      }} 
      setApi={setApi} 
      plugins={[]} 
      className="w-full"
    >
      <CarouselContent className="py-4">
        {repeatedImages.map((item, index) => (
          <CarouselItem key={item._key} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4">
            <div className="group relative overflow-hidden rounded-3xl h-[400px] cursor-pointer shadow-xl transition-all duration-500 ease-out">
              <img
                src={item.url || '/placeholder.png'}
                alt={item.category || 'Koleksi'}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {item.category ? item.category.replace(/_/g, ' ') : 'Koleksi'}
                </span>
                <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">
                  {item.category ? item.category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Koleksi'}
                </h3>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex absolute -left-4 top-1/2 bg-white text-gray-600 hover:text-black hover:bg-gray-50 shadow-xl border-0 w-14 h-14 cursor-pointer scale-110" />
      <CarouselNext className="hidden md:flex absolute -right-4 top-1/2 bg-white text-gray-600 hover:text-black hover:bg-gray-50 shadow-xl border-0 w-14 h-14 cursor-pointer scale-110" />
    </Carousel>
  );
}