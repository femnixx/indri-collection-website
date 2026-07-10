"use client";

import { useState, useEffect } from 'react';
import { navLinks } from '../../constants';

const BREAKPOINT = 768; // matches Tailwind md

function MenuIcon({ open }) {
  return (
    <div className="relative w-6 h-5 flex flex-col justify-between">
      <span className="block h-0.5 bg-white rounded-full transition-all duration-300 ease-out origin-center"
        style={{ transform: open ? 'translateY(9px) rotate(45deg)' : 'none' }} />
      <span className="block h-0.5 bg-white rounded-full transition-all duration-300 ease-out"
        style={{ opacity: open ? 0 : 1, transform: open ? 'scaleX(0)' : 'scaleX(1)' }} />
      <span className="block h-0.5 bg-white rounded-full transition-all duration-300 ease-out origin-center"
        style={{ transform: open ? 'translateY(-9px) rotate(-45deg)' : 'none' }} />
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [inHero, setInHero]         = useState(true);
  const [barVisible, setBarVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setInHero(window.scrollY < window.innerHeight - 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // iOS-safe scroll lock
  useEffect(() => {
    if (menuOpen) {
      const scrollY = window.scrollY;
      document.body.dataset.scrollY = String(scrollY);
      document.body.style.position  = 'fixed';
      document.body.style.top       = `-${scrollY}px`;
      document.body.style.width     = '100%';
      document.body.style.overflow  = 'hidden';
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
      document.body.style.position  = '';
      document.body.style.top       = '';
      document.body.style.width     = '';
      document.body.style.overflow  = '';
      delete document.body.dataset.scrollY;
      if (scrollY) window.scrollTo({ top: scrollY, behavior: 'instant' });
    }
    return () => {
      const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
      document.body.style.position  = '';
      document.body.style.top       = '';
      document.body.style.width     = '';
      document.body.style.overflow  = '';
      delete document.body.dataset.scrollY;
      if (scrollY) window.scrollTo({ top: scrollY, behavior: 'instant' });
    };
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= BREAKPOINT) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    const delay = menuOpen ? 30 : 0;

    setTimeout(() => {
      if (href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, delay);
  };

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-50
        flex items-center justify-between
        px-6 md:px-16 lg:px-24 py-2
        transition-all duration-500 ease-out
        ${barVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
        ${inHero ? 'bg-transparent' : 'bg-accent shadow-lg shadow-accent/30'}
      `}>
        <div onClick={() => handleNavClick('#home')}
          className="flex items-center text-white font-extrabold text-lg tracking-wide cursor-pointer">
          <img src={"/logo-indri.svg"} alt="logo indri" className="h-12 w-auto" />
          <span>Indri Collection</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button 
              key={link.label} 
              onClick={() => handleNavClick(link.href)}
              className="text-white font-medium text-sm tracking-wide cursor-pointer
                relative pb-1
                [transform:translateZ(0)] backface-hidden antialiased
                after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0
                after:bg-white after:rounded-full after:transition-all after:duration-300
                hover:after:w-full hover:-translate-y-0.5 transition-transform duration-200"
            >
              {link.label}
            </button>
          ))}
        </div>

        <button onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          className="md:hidden p-1 focus:outline-none">
          <MenuIcon open={menuOpen} />
        </button>
      </nav>

      <div className={`transition-all duration-500 bg-transparent ${inHero ? 'h-0' : 'h-16'}`} />

      {/* Backdrop */}
      <div onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 right-0 z-50 h-full w-72 bg-primary shadow-2xl flex flex-col
        transition-transform duration-400 ease-out md:hidden
        ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src={"/logo-indri.svg"} alt="Logo Indri" className="w-8 h-8 object-contain" />
            <span className="text-white font-extrabold text-lg">Indri Collection</span>
          </div>
          <button onClick={() => setMenuOpen(false)} aria-label="Tutup menu"
            className="p-1 text-white/70 hover:text-white transition-colors">
            <MenuIcon open={true} />
          </button>
        </div>

        <div className="flex flex-col px-6 pt-8 gap-2">
          {navLinks.map((link, i) => (
            <button key={link.label} onClick={() => handleNavClick(link.href)}
              className={`text-left w-full text-white/80 hover:text-white hover:bg-white/10
                font-medium text-base px-4 py-3 rounded-xl
                border border-transparent hover:border-white/10
                transition-all
                ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}
              style={{
                transitionDuration: '350ms',
                transitionDelay: menuOpen ? `${120 + i * 60}ms` : '0ms',
              }}>
              {link.label}
            </button>
          ))}
        </div>

        <div className={`mt-auto px-6 pb-10 transition-all duration-500
          ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: menuOpen ? '450ms' : '0ms' }}>
          <div className="h-px w-full bg-white/10 mb-6" />
          <p className="text-accent-light text-xs leading-relaxed">
            Jalan Vinolia no 22, Jatimulyo<br />Lowokwaru, Kota Malang
          </p>
          <div className="mt-4 w-10 h-1 rounded-full bg-accent" />
        </div>
      </div>
    </>
  );
}