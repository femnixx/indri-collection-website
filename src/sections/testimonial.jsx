import React, { useEffect, useRef, useState } from 'react';
import SectionHeader from '../components/ui/section-header';
import { reviews } from '../constants';
import { Star } from 'lucide-react';

export default function Testimonial() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Guarantee at least 20 cards per row regardless of how many reviews exist
  const ensureEnough = (arr) => {
    const MIN = 5;
    const result = [];
    while (result.length < MIN) result.push(...arr);
    // Double it so the -50% translateX loop is always seamless
    return [...result, ...result];
  };

  const half = Math.ceil(reviews.length / 2);
  const row1 = ensureEnough(reviews.slice(0, half).length ? reviews.slice(0, half) : reviews);
  const row2 = ensureEnough(reviews.slice(half).length ? reviews.slice(half) : reviews);

  const Card = ({ review, idx }) => (
    <div
      key={idx}
      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50"
      style={{ minWidth: '320px', maxWidth: '320px', marginRight: '24px', flexShrink: 0 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <img
            src={review.imgURL}
            alt={review.customerName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h4 className="font-bold text-[#10324A] text-sm">{review.customerName}</h4>
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

  return (
    <section id="testimonial" ref={sectionRef} className="w-full py-24 bg-[#F5FCFF] overflow-hidden">
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .row-left  { display: flex; width: max-content; animation: marquee-left 35s linear infinite; }
        .row-right { display: flex; width: max-content; animation: marquee-right 35s linear infinite; }
        .row-left:hover, .row-right:hover { animation-play-state: paused; }
      `}</style>

      <div className="container mx-auto px-4 md:px-8">
        <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
          <SectionHeader title="What Our" highlightedText="Customers Say" />
        </div>
        <p
          className="text-center text-gray-500 mb-16 font-light"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s' }}
        >
          Hear from those who love our collection
        </p>
      </div>

      <div style={{ overflow: 'hidden', marginBottom: '24px', opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease 0.2s' }}>
        <div className="row-left">
          {row1.map((review, i) => <Card key={i} review={review} idx={i} />)}
        </div>
      </div>

      <div style={{ overflow: 'hidden', opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease 0.3s' }}>
        <div className="row-right" style={{ paddingLeft: '160px' }}>
          {row2.map((review, i) => <Card key={i} review={review} idx={i} />)}
        </div>
      </div>
    </section>
  );
}
