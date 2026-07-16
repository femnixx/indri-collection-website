"use client";

import React, { useState, useEffect } from 'react';
import { InstagramIcon, TiktokIcon } from '../components/ui/icons';
import { Mail } from 'lucide-react';
import SectionHeader from '../components/ui/section-header';
import { useScrollReveal } from '../hooks/use-scroll-reveal';
import { ContactInfo } from '@/types/database';

const ICON: Record<string, React.ReactNode> = {
  email: <Mail className="w-[1.2em] h-[1.2em]" />,
  instagram: <InstagramIcon />,
  tiktok: <TiktokIcon />,
};

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) {
  const [ref, visible] = useScrollReveal(0.1);
  return (
    <div
      ref={ref as any}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 600ms ease ${visible ? `${delay}ms` : '0ms'},
                     transform 600ms ease ${visible ? `${delay}ms` : '0ms'}`,
      }}
    >
      {children}
    </div>
  );
}

const getHandle = (url: string) => {
  if (!url) return '';
  if (url.startsWith('@')) return url;
  const parts = url.replace(/\/$/, '').split('/');
  const lastPart = parts[parts.length - 1];
  return lastPart.startsWith('@') ? lastPart : `@${lastPart}`;
};

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch('/api/contact');
        if (!response.ok) throw new Error('Gagal memuat kontak');
        const data: ContactInfo = await response.json();
        setContactInfo(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContact();
  }, []);

  const socialLinks = [];
  
  if (contactInfo?.email_address) {
    socialLinks.push({ 
      id: 'email', 
      label: contactInfo.email_address,
      href: `mailto:${contactInfo.email_address}` 
    });
  }
  
  if (contactInfo?.instagram_url) {
    socialLinks.push({ 
      id: 'instagram', 
      label: getHandle(contactInfo.instagram_url),
      href: contactInfo.instagram_url 
    });
  }
  
  if (contactInfo?.tiktok_url) {
    socialLinks.push({ 
      id: 'tiktok', 
      label: getHandle(contactInfo.tiktok_url),
      href: contactInfo.tiktok_url 
    });
  }

  return (
    <section id="contact" className="bg-white py-20 px-6 md:px-16 lg:px-24">

      <Reveal className="text-center mb-14">
        <SectionHeader title="Hubungi" highlightedText="Kami" />
        <p className="text-gray-400 text-sm md:text-base">
          Kunjungi kami atau hubungi melalui kontak di bawah ini
        </p>
      </Reveal>

      {isLoading ? (
        <div className="flex justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : contactInfo ? (
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-10">
          
          {/* Map */}
          <Reveal delay={120}>
            <div className="h-60 w-full md:w-80 md:h-80 rounded-2xl shadow-xl overflow-hidden border-4 border-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d203.2388192792083!2d112.61190915601682!3d-7.938847851201809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7883000f8c5861%3A0xe88d20a59aba2693!2sIndri%20Collection!5e1!3m2!1sen!2sid!4v1781274935669!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Indri Collection Location"
              />
            </div>
          </Reveal>

          {/* Contact details */}
          <Reveal delay={240} className="w-full md:w-auto md:min-w-[280px]">
            <div className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-4 mb-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 text-primary hover:-translate-y-1 transition-all duration-200 text-base font-medium"
                  >
                    <span className="text-primary flex-shrink-0 group-hover:text-accent transition-colors duration-200">
                      {ICON[link.id]}
                    </span>
                    <span className="group-hover:text-accent transition-colors duration-200">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 mt-1">
                <p className="text-primary font-bold text-sm mb-2">Alamat</p>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                  {contactInfo.address || 'Belum ada alamat.'}
                </p>

                <p className="text-primary font-bold text-sm mb-2">Jam Operasional</p>
                <p className="text-gray-400 text-sm mb-5">
                  {contactInfo.operational_hours || 'Senin - Sabtu: 09:00 - 16:00 WIB'}
                </p>

                {contactInfo.whatsapp_number && (
                  <div className="mt-2">
                    <a 
                      href={`https://wa.me/${contactInfo.whatsapp_number.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-6 rounded-full text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      Chat WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      ) : (
        <p className="text-center text-gray-500">Informasi kontak tidak tersedia.</p>
      )}
    </section>
  );
}