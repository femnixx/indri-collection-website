"use client";

import React from 'react';
import Script from 'next/script'; // Import Script bawaan Next.js
import SectionHeader from '../components/ui/section-header';
import { useScrollReveal } from '../hooks/use-scroll-reveal';

export default function Testimonial() {
  const [sectionRef, isVisible] = useScrollReveal(0.08);

  return (
    <section id="testimonial" ref={sectionRef} className="w-full py-24 bg-secondary overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div style={{
          opacity:    isVisible ? 1 : 0,
          transform:  isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 600ms ease, transform 600ms ease',
        }}>
          <SectionHeader title="Apa Kata" highlightedText="Pelanggan Kami" />
        </div>
        
        <p className="text-center text-gray-500 mb-16 font-light"
          style={{
            opacity:    isVisible ? 1 : 0,
            transform:  isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 600ms ease 100ms, transform 600ms ease 100ms',
          }}>
          Dengarkan dari mereka yang menyukai koleksi kami
        </p>

        {/* Container Widget Elfsight Google Reviews */}
        <div 
          style={{ 
            opacity: isVisible ? 1 : 0, 
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 600ms ease 200ms, transform 600ms ease 200ms' 
          }}
          className="w-full min-h-[400px] flex justify-center relative z-10"
        >
          {/* Target div dari Elfsight */}
          <div className="elfsight-app-20ab98bf-5091-4c5e-9be1-592fc437f319" data-elfsight-app-lazy></div>
        </div>
      </div>

      {/* Eksekusi Script menggunakan next/script */}
      {/* strategy="lazyOnload" memastikan script dimuat saat waktu idle browser agar tidak menghambat load awal website */}
      <Script 
        src="https://elfsightcdn.com/platform.js" 
        strategy="lazyOnload" 
      />
    </section>
  );
}