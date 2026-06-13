import React from 'react';
import SectionHeader from '../components/ui/section-header';
import { reviews } from '../constants';
import { Star } from 'lucide-react';
import { useScrollReveal } from '../hooks/use-scroll-reveal';

// Duplicate cards until we have at least MIN so the marquee never gaps
function buildRow(arr, min = 5) {
  const out = [];
  while (out.length < min) out.push(...arr);
  return [...out, ...out]; // double for seamless loop
}

function Card({ review }) {
  return (
    <div
      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50"
      style={{ minWidth: '320px', maxWidth: '320px', marginRight: '24px', flexShrink: 0 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <img src={review.imgURL} alt={review.customerName}
            className="w-12 h-12 rounded-full object-cover" />
          <div>
            <h4 className="font-bold text-primary text-sm">{review.customerName}</h4>
            <p className="text-xs text-gray-400">{review.customerRole}</p>
          </div>
        </div>
        <div className="flex">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} size={14} className="fill-[#FF8B00] text-[#FF8B00]" />
          ))}
        </div>
      </div>
      <hr className="border-gray-100 mb-4" />
      <p className="text-gray-600 text-sm leading-relaxed font-light">{review.feedback}</p>
    </div>
  );
}

export default function Testimonial() {
  const [sectionRef, isVisible] = useScrollReveal(0.08);

  const half = Math.ceil(reviews.length / 2);
  const row1 = buildRow(reviews.slice(0, half).length ? reviews.slice(0, half) : reviews);
  const row2 = buildRow(reviews.slice(half).length    ? reviews.slice(half)    : reviews);

  return (
    // CSS for .row-left / .row-right keyframes lives in index.css (not injected here),
    // so the browser doesn't re-parse a <style> tag on every render.
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
      </div>

      <div style={{ overflow: 'hidden', marginBottom: '24px',
        opacity: isVisible ? 1 : 0, transition: 'opacity 600ms ease 200ms' }}>
        <div className="row-left">
          {row1.map((review, i) => <Card key={i} review={review} />)}
        </div>
      </div>

      <div style={{ overflow: 'hidden',
        opacity: isVisible ? 1 : 0, transition: 'opacity 600ms ease 300ms' }}>
        <div className="row-right" style={{ paddingLeft: '160px' }}>
          {row2.map((review, i) => <Card key={i} review={review} />)}
        </div>
      </div>
    </section>
  );
}