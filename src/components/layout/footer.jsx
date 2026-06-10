import React from 'react';
import { MessageCircle, Mail, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer" className="w-full py-8 bg-[#10324A] text-white">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand Name & Copyright */}
        <div>
          <h4 className="font-bold text-lg mb-1">Indri Collection</h4>
          <p className="text-xs text-gray-400 font-light">123 Fashion Avenue, New York, NY 10001</p>
        </div>

        {/* Copyright center */}
        <div className="text-xs text-gray-400 font-light">
          © {new Date().getFullYear()} Indri Collection. All rights reserved.
        </div>
        
        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <a href="https://wa.me/6285385353014" target='_blank' className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
            <MessageCircle size={16} />
          </a>
          <a href="mailto:indricollection@gmail.com" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
            <Mail size={16} />
          </a>
          <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
            <Globe size={16} />
          </a>
        </div>

      </div>
    </footer>
  );
}
