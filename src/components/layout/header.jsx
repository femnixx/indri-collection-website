import React from 'react';
import { navLinks } from '../../constants';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-50 py-6">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <a href="#home" className="text-white font-bold text-2xl tracking-wide">
          Indri Collection
        </a>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href}
              className="text-white hover:text-[#00B2FF] font-medium text-sm uppercase tracking-wider transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
