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

interface ProductItem {
  id: string;
  name: string;
  image_url: string;
  categories?: { name: string } | null;
}

export default function OurCollection() {
  const [sectionRef, isVisible] = useScrollReveal(0.08);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data: ProductItem[]) => {
        // Shuffle for variety on each page load
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setProducts(shuffled);
      })
      .catch((err) => console.error('Gagal memuat produk:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section
      id="product"
      ref={sectionRef as any}
      className="w-full py-24 bg-secondary"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 600ms ease, transform 600ms ease',
      }}
    >
      <div className="container mx-auto px-4 md:px-8">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader title="Koleksi" highlightedText="Kami" />
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto font-light">
          Temukan berbagai pilihan busana premium yang dirancang khusus untuk Anda
        </p>

        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto font-light">
          Temukan berbagai pilihan busana premium yang dirancang khusus untuk Anda
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400">Tidak ada gambar yang ditampilkan.</p>
        ) : (
          <InfiniteCarousel products={products} />
        )}
      </div>
    </section>
  );
}

function InfiniteCarousel({ products }: { products: ProductItem[] }) {
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    if (!api) return;

    let isPaused = false;
    const interval = setInterval(() => {
      if (!isPaused) api.scrollNext();
    }, 2500);

    const root = api.rootNode();
    const pause = () => { isPaused = true; };
    const resume = () => { isPaused = false; };

    if (root) {
      root.addEventListener('mouseenter', pause);
      root.addEventListener('mouseleave', resume);
    }

    return () => {
      clearInterval(interval);
      if (root) {
        root.removeEventListener('mouseenter', pause);
        root.removeEventListener('mouseleave', resume);
      }
    };
  }, [api]);

  // Repeat to give an "infinite" feel
  const REPEAT_COUNT = 10;
  const repeatedItems = Array.from({ length: REPEAT_COUNT }).flatMap((_, i) =>
    products.map((p) => ({ ...p, _key: `${i}-${p.id}` }))
  );

  return (
    <Carousel
      opts={{ align: 'start', loop: true, slidesToScroll: 1 }}
      setApi={setApi}
      plugins={[]}
      className="w-full"
    >
      <CarouselContent className="py-4">
        {repeatedItems.map((item) => (
          <CarouselItem key={item._key} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4">
            <div className="group relative overflow-hidden rounded-3xl h-[400px] cursor-pointer shadow-xl transition-all duration-500 ease-out">
              <img
                src={item.image_url || '/placeholder.png'}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                {item.categories?.name && (
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {item.categories.name}
                  </span>
                )}
                <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md line-clamp-2">
                  {item.name}
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
