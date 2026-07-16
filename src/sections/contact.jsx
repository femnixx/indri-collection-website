"use client";

import React, { useState, useEffect } from 'react';
import { InstagramIcon, MailIcon, TiktokIcon } from '../components/ui/icons';
import SectionHeader from '../components/ui/section-header';
import { useScrollReveal } from '../hooks/use-scroll-reveal';
import { settingsRepository } from '@/repositories/settingsRepository';
import { contactInfo } from '../constants'; // Tetap di-import hanya untuk data statis seperti mapUrl

// Icon map — dipetakan berdasarkan ID dari data database
const ICON = {
  email:     <MailIcon />,
  instagram: <InstagramIcon />,
  tiktok:    <TiktokIcon />,
};

// Single Reveal wrapper
function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 600ms ease ${visible ? `${delay}ms` : '0ms'},
                     transform 600ms ease ${visible ? `${delay}ms` : '0ms'}`,
      }}
    >
      {children}
    </div>
  );
}

export default function Contact() {
  // 💡 Mengubah state menjadi inisialisasi JavaScript vanilla (tanpa generic type)
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 Fetch data dari Supabase via Repository saat komponen dipasang
  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await settingsRepository.fetchPublicSettings();
        setSettings(data);
      } catch (error) {
        console.error("Gagal mengambil data dari Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Tampilkan loading spinner sederhana saat menunggu data
  if (isLoading || !settings) {
    return (
      <section id="contact" className="bg-white py-20 px-6 md:px-16 lg:px-24 flex justify-center items-center min-h-[350px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </section>
    );
  }

  // Rekonstruksi baris kontak berdasarkan data dinamis Supabase
  const contactRows = [
    { id: 'email', href: `mailto:${settings.email_address}`, label: settings.email_address },
    { id: 'instagram', href: settings.instagram_url, label: 'Instagram' },
    { id: 'tiktok', href: settings.tiktok_url, label: 'TikTok' },
  ];

  return (
    <section id="contact" className="bg-white py-20 px-6 md:px-16 lg:px-24">

      <Reveal className="text-center mb-14">
        <SectionHeader title="Hubungi" highlightedText="Kami" />
        <p className="text-gray-400 text-sm md:text-base">
          Kunjungi kami atau hubungi melalui kontak di bawah ini
        </p>
      </Reveal>

      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-10">

        {/* Map */}
        <Reveal delay={120}>
          <div className="h-60 w-full md:w-80 md:h-80 rounded-2xl shadow-xl overflow-hidden border-4 border-white">
            <iframe
              src={contactInfo.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Indri Collection Location"
            />
          </div>
        </Reveal>

        {/* Contact details */}
        <Reveal delay={240} className="w-full md:w-auto md:min-w-[280px]">
          <div className="flex flex-col gap-5">
            
            {/* 📍 Alamat Fisik Dinamis dari Supabase */}
            <div className="flex flex-col text-primary text-base font-medium mb-1">
              <span className="font-bold text-sm text-gray-900 mb-1">Alamat Toko</span>
              <span className="text-gray-500 font-normal text-sm leading-relaxed max-w-[280px]">
                {settings.address}
              </span>
            </div>

            {/* 📱 Sosial Media Dinamis dari Supabase */}
            {contactRows.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target={link.id !== 'email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-primary hover:-translate-y-1 transition-all duration-200 text-base font-medium"
              >
                <span className="text-primary group-hover:text-accent transition-colors duration-200">
                  {ICON[link.id]}
                </span>
                <span className="group-hover:text-accent transition-colors duration-200">
                  {link.label}
                </span>
              </a>
            ))}

            {/* 🕒 Jam Operasional Dinamis dari Supabase */}
            <div className="border-t border-gray-100 pt-5 mt-1">
              <p className="text-primary font-bold text-sm mb-2">Jam Operasional</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {settings.operational_hours}
              </p>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}