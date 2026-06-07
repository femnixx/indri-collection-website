import { useEffect, useRef, useState } from 'react';

// ── Re-triggerable scroll reveal hook ────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);
    return [ref, visible];
}

// Wrapper that fades+slides up when visible, resets when out of view
function Reveal({ children, delay = 0, className = '' }) {
    const [ref, visible] = useScrollReveal(0.12);
    return (
        <div
            ref={ref}
            style={{
                transitionDuration: '650ms',
                transitionDelay: visible ? `${delay}ms` : '0ms',
            }}
            className={`transition-all ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
        >
            {children}
        </div>
    );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <polyline points="2,4 12,13 22,4" />
    </svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
);

const TiktokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5
            2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01
            a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34
            6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z" />
    </svg>
);

const PinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
        <path fillRule="evenodd" clipRule="evenodd"
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" clipRule="evenodd"
            d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" />
    </svg>
);

// ── Contact Section ───────────────────────────────────────────────────────────
function ContactSection() {
    return (
        <section id="contact" className="bg-white py-20 px-6 md:px-16 lg:px-24">

            {/* Header */}
            <Reveal className="text-center mb-14">
                <h2 className="text-4xl md:text-5xl font-bold text-[#10324A]">
                    Contact <span className="text-[#11B5F5]">Us</span>
                </h2>
                <p className="text-gray-400 mt-3 text-sm md:text-base">
                    Visit us or reach out through your preferred channel
                </p>
            </Reveal>

            {/* Grid */}
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-10">

                {/* Store card */}
                <a href="https://maps.app.goo.gl/vpvAbASRtMLoPpkT8" target='_blank'>
                    <Reveal delay={150}>
                        <div className="bg-[#10324A] rounded-2xl p-8 flex flex-col items-center text-center w-full md:w-64 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 rounded-full bg-[#11B5F5] flex items-center justify-center mb-5 shadow-lg">
                                <PinIcon />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Visit Our Store</h3>
                            <p className="text-[#6ED8FF] text-sm leading-relaxed">
                                Jalan Vinolia no 22, Jatimulyo,<br /> Lowokwaru, Kota Malang
                            </p>
                    
                            {/* Decorative bars */}
                            <div className="mt-6 flex gap-3">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="flex flex-col gap-1.5">
                                        {[0, 1, 2].map(j => (
                                            <div key={j} className="w-8 h-1.5 rounded-full bg-white/10" />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </a>

                {/* Contact details */}
                <Reveal delay={300} className="flex-1 w-full">
                    <div className="flex flex-col gap-5">
                        <a href="mailto:indri@gmail.com"
                            className="flex items-center gap-3 text-[#10324A] hover:text-[#11B5F5] transition-colors duration-200 text-base font-medium group">
                            <span className="text-[#11B5F5] group-hover:scale-110 transition-transform duration-200"><MailIcon /></span>
                            indricollection@gmail.com
                        </a>
                        <a href="#"
                            className="flex items-center gap-3 text-[#10324A] hover:text-[#11B5F5] transition-colors duration-200 text-base font-medium group">
                            <span className="text-[#11B5F5] group-hover:scale-110 transition-transform duration-200"><InstagramIcon /></span>
                            @indricollection
                        </a>
                        <a href="https://www.tiktok.com/@indricollection07" target='_blank'
                            className="flex items-center gap-3 text-[#10324A] hover:text-[#11B5F5] transition-colors duration-200 text-base font-medium group">
                            <span className="text-[#11B5F5] group-hover:scale-110 transition-transform duration-200"><TiktokIcon /></span>
                            @indricollection07
                        </a>

                        <div className="border-t border-gray-100 pt-5 mt-1">
                            <p className="text-[#10324A] font-bold text-sm mb-2">Store Hours:</p>
                            <p className="text-gray-400 text-sm">Monday – Saturday: 10:00 AM – 8:00 PM</p>
                            <p className="text-gray-400 text-sm">Sunday: 11:00 AM – 6:00 PM</p>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
    return (
        <footer className="bg-[#10324A] text-white">
            <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <p className="font-bold text-lg">Indri Collection</p>
                    <p className="text-[#6ED8FF] text-sm mt-1">Jalan Vinolia no 22, Jatimulyo, Lowokwaru, Kota Malang</p>
                </div>
                <div className="flex items-center gap-3">
                    {[
                        { icon: <ChatIcon />, label: 'Chat', href: '#' },
                        { icon: <MailIcon />, label: 'Email', href: 'mailto:indricollection@gmail.com' },
                        { icon: <InstagramIcon />, label: 'Instagram', href: '#' },
                    ].map(({ icon, label, href }) => (
                        <a key={label} href={href} aria-label={label}
                            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#11B5F5] hover:border-[#11B5F5] hover:scale-110 transition-all duration-200">
                            {icon}
                        </a>
                    ))}
                </div>
            </div>
            <div className="border-t border-white/10 py-4 text-center">
                <p className="text-[#6ED8FF]/60 text-xs">© 2026 Indri Collection. All rights reserved.</p>
            </div>
        </footer>
    );
}

export { ContactSection, Footer };
export default function ContactAndFooter() {
    return (
        <>
            <ContactSection />
            <Footer />
        </>
    );
}