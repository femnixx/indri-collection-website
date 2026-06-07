import React from 'react';
import SectionHeader from '../components/ui/section-header';
import { MapPin, Mail, Camera, Music } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="w-full py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader title="Contact" highlightedText="Us" />
        <p className="text-center text-gray-500 mb-16 font-light">
          Visit us or reach out through your preferred channel
        </p>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16 justify-center">
          
          {/* Store Location Card */}
          <div className="bg-[#10324A] text-white rounded-3xl p-12 text-center w-full max-w-sm flex flex-col items-center">
             <div className="bg-[#00B2FF] p-4 rounded-full mb-6">
                <MapPin size={32} />
             </div>
             <h3 className="text-xl font-bold mb-2">Visit Our Store</h3>
             <p className="text-gray-300 text-sm font-light leading-relaxed mb-10">
              Jalan Vinolia no 22, Jatimulyo, <br />
              Lowokwaru, Kota Malang
             </p>
             {/* Decorative lines matching design */}
             <div className="flex gap-2 opacity-30">
               <div className="w-8 h-1 bg-white rounded-full"></div>
               <div className="w-8 h-1 bg-white rounded-full"></div>
               <div className="w-8 h-1 bg-white rounded-full"></div>
             </div>
             <div className="flex gap-2 opacity-30 mt-2">
               <div className="w-8 h-1 bg-white rounded-full"></div>
               <div className="w-8 h-1 bg-white rounded-full"></div>
               <div className="w-8 h-1 bg-white rounded-full"></div>
             </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-6 text-[#10324A]">
             <div className="flex items-center gap-4">
                <Mail size={24} className="text-gray-400" />
                <span className="font-medium">indricollection@gmail.com</span>
             </div>
             <div className="flex items-center gap-4">
                <Camera size={24} className="text-gray-400" />
                <span className="font-medium">@indricollection</span>
             </div>
             <div className="flex items-center gap-4">
                <Music size={24} className="text-gray-400" />
                <span className="font-medium">@indricollection</span>
             </div>

             <div className="mt-8 pt-8 border-t border-gray-100">
                <h4 className="font-semibold text-sm mb-2">Store Hours:</h4>
                <p className="text-xs text-gray-500 font-light leading-loose">
                  Monday - Saturday: 10:00 AM - 8:00 PM<br />
                  Sunday: 11:00 AM - 6:00 PM
                </p>
             </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
