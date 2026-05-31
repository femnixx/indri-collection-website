import React from 'react';
import Button from '../components/ui/button';
import { MessageCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative w-full h-[90vh] min-h-[600px] flex items-center pt-20">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')` }}
      >
        {/* Dark Navy Overlay matching design */}
        <div className="absolute inset-0 bg-[#0B1E2E]/80 backdrop-brightness-75"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-4xl pt-10">
        <h1 className="text-white text-5xl md:text-7xl font-bold leading-tight mb-6">
          Discover Your <br />
          <span className="text-[#00B2FF]">Perfect Style</span>
        </h1>
        
        <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-xl font-light">
          Elevate your wardrobe with <span className="font-semibold text-white">premium fashion pieces</span> that blend elegance with modern sophistication.
        </p>
        
        <Button className="px-8 py-3.5 text-sm uppercase tracking-wider">
          Explore Collection
        </Button>
      </div>

      {/* Floating Chat Icon */}
      <div className="absolute bottom-32 right-12 z-20">
        <button className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform">
           <MessageCircle size={28} />
        </button>
      </div>

      {/* Curved Bottom SVG */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[120px] fill-[#F5FCFF]">
            <path d="M0,0 V46.29 c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z"></path>
        </svg>
      </div>
    </section>
  );
}
