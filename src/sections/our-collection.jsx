import React from 'react';
import SectionHeader from '../components/ui/section-header';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function OurCollection() {
  const images = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1524041255072-7da0525d6b34?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1550614000-4b95dd247565?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  ];

  return (
    <section id="product" className="w-full py-24 bg-[#F5FCFF]">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader title="Our" highlightedText="Collection" />
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto font-light">
          Discover our handpicked selection of premium fashion pieces designed for the modern individual
        </p>
        
        <div className="relative">
          {/* Collection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {images.map((img, index) => (
              <div key={index} className="group overflow-hidden rounded-2xl h-[400px]">
                <img 
                  src={img} 
                  alt={`Collection item ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-lg text-gray-400 hover:text-black transition-colors hidden md:block z-10">
            <ChevronLeft size={24} />
          </button>
          
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-lg text-gray-400 hover:text-black transition-colors hidden md:block z-10">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
