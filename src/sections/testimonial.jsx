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

  return (
    <section id="testimonial" ref={sectionRef} className="w-full py-24 bg-[#F5FCFF]">
      <div className="container mx-auto px-4 md:px-8">

        {/* Header */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <SectionHeader title="What Our" highlightedText="Customers Say" />
        </div>

        <p
          className="text-center text-gray-500 mb-16 font-light"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
          }}
        >
          Hear from those who love our collection
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
                transition: `opacity 0.5s ease ${0.2 + index * 0.1}s, transform 0.5s ease ${0.2 + index * 0.1}s`,
              }}
            >
              <div className="flex justify-between items-start mb-6">
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
              </div>

              <div className="flex mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#FF8B00] text-[#FF8B00]" />
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed font-light">
                {review.feedback}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}