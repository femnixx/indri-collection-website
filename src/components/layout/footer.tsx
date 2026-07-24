'use client';

import { useEffect, useState } from 'react';
import { ChatIcon, InstagramIcon, MailIcon } from '../ui/icons';
import { settingsRepository, FALLBACK_SETTINGS } from '@/repositories/settingsRepository';

export default function Footer() {
    const [settings, setSettings] = useState(FALLBACK_SETTINGS);

    useEffect(() => {
        let isMounted = true;
        settingsRepository.fetchPublicSettings().then((data) => {
            if (isMounted) setSettings(data);
        });
        return () => { isMounted = false; };
    }, []);

    const socialLinks = [
        { id: "email", label: "Email", href: `mailto:${settings.email_address}` },
        { id: "instagram", label: "Instagram", href: settings.instagram_url },
        { id: "whatsapp", label: "WhatsApp", href: `https://wa.me/${settings.whatsapp_number}` }
    ];

    const getIcon = (id) => {
        const icons = {
            whatsapp: <ChatIcon />,
            email: <MailIcon />,
            instagram: <InstagramIcon />
        };
        return icons[id] || null;
    };

    return (
        /* Added 'relative' and 'isolate' to create a clear stacking boundary */
        <footer className="bg-primary text-white w-full relative z-[50] isolate">
            <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center mb-2">
                        <img className="w-10 h-10 object-contain" src={'/logo-indri.svg'} alt="Logo" />
                        <span className="font-bold text-xl ml-2">Indri Collection</span>
                    </div>
                    <p className="text-accent-light text-sm mt-2">{settings.address}</p>
                </div>

                {/* Simplified the container to avoid unnecessary z-index fighting */}
                <div className="flex items-center gap-3">
                    {socialLinks.map(({ id, label, href }) => (
                        <a 
                            key={id} 
                            href={href} 
                            aria-label={label} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            /* Added 'relative' so z-index works. 'pointer-events-auto' is implicit on <a> tags */
                            className="relative z-[60] w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:border-accent hover:scale-110 transition-all duration-200 cursor-pointer"
                        >
                            {getIcon(id)}
                        </a>
                    ))}
                </div>
            </div>
            
            <div className="border-t border-white/10 py-4 text-center">
                <p className="text-accent-light/60 text-xs">© 2026 Indri Collection. All rights reserved.</p>
            </div>
        </footer>
    );
}