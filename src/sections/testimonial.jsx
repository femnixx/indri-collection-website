import React from 'react';
import SectionHeader from '../components/ui/section-header';
import { reviews } from '../constants';
import { Star } from 'lucide-react';

export default function Testimonial() {
  return (
    <section id="testimonial" className="w-full py-24 bg-[#F5FCFF]">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader title="What Our" highlightedText="Customers Say" />
        <p className="text-center text-gray-500 mb-16 font-light">
          Hear from those who love our collection
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
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
