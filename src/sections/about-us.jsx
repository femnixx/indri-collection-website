import React from 'react';
import SectionHeader from '../components/ui/section-header';
import { statistics } from '../constants';

export default function AboutUs() {
  return (
    <section id="about-us" className="w-full py-24 bg-[#F5FCFF] relative overflow-hidden">
      
      {/* Decorative Circles */}
      <div className="absolute top-10 left-1/2 w-32 h-32 bg-[#DDF4FF] rounded-full -translate-x-1/2 -z-10 opacity-70 blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-[#DDF4FF] rounded-full -z-10 opacity-70 blur-xl"></div>

      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <SectionHeader title="About" highlightedText="Us" />
        
        <div className="flex flex-col md:flex-row gap-16 items-center mt-12">
          {/* Text Content */}
          <div className="md:w-1/2 space-y-6">
            <p className="text-gray-700 leading-relaxed font-light">
              We are a modern fashion brand dedicated to bringing you the finest collection of contemporary clothing that embodies elegance, quality, and timeless style.
            </p>
            <p className="text-gray-700 leading-relaxed font-light">
              Each piece in our collection is carefully curated to ensure you feel confident and stylish, whether you're dressing for a special occasion or everyday elegance.
            </p>
            
            {/* Stats */}
            <div className="flex gap-6 pt-6">
              {statistics.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-w-[140px]">
                  <h3 className="text-3xl font-bold text-[#00B2FF] mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Image */}
          <div className="md:w-1/2 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl relative z-10 border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Store Interior" 
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
