import { useEffect, useRef, useState } from 'react';

// ── Brand colors from design ──────────────────────────────────────────────────
// #11B5F5  – cyan accent (100%)
// #10324A  – dark navy (100 / 80 / 70 %)
// #6ED8FF  – light cyan
// #F5FCFF  – near-white tint
// #FFFFFF  – white

// ── Icons (inline SVG, no external deps) ─────────────────────────────────────
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <polyline points="2,4 12,13 22,4" />
    </svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
);

const TiktokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
        className="w-5 h-5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5
            2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01
            a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34
            6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z" />
    </svg>
);

const PinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
        className="w-6 h-6 text-white">
        <path fillRule="evenodd" clipRule="evenodd"
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0
            9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" clipRule="evenodd"
            d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029
            c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9
            s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543
            a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0
            100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125
            1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" />
    </svg>
);

// ── Animated wrapper (fade-up on scroll into view) ───────────────────────────
function FadeUp({ children, delay = 0, className = '' }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms`, transitionDuration: '650ms' }}
            className={`transition-all ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
        >
            {children}
        </div>
    );
}

// ── Contact Section ───────────────────────────────────────────────────────────
function ContactSection() {
    return (
        <section id="contact" className="bg-white py-16 px-6 md:px-16 lg:px-24">
            {/* Header */}
            <FadeUp className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-[#10324A]">
                    Contact <span className="text-[#11B5F5]">Us</span>
                </h2>
                <p className="text-gray-500 mt-3 text-sm md:text-base">
                    Visit us or reach out through your preferred channel
                </p>
            </FadeUp>

            {/* Main grid */}
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-10">

                {/* Store card */}
                <FadeUp delay={150} className="w-full md:w-auto">
                    <div className="bg-[#10324A] rounded-2xl p-8 flex flex-col items-center text-center w-full md:w-64 shadow-xl">
                        {/* Pin circle */}
                        <div className="w-14 h-14 rounded-full bg-[#11B5F5] flex items-center justify-center mb-5 shadow-lg">
                            <PinIcon />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Visit Our Store</h3>
                        <p className="text-[#6ED8FF] text-sm leading-relaxed">
                            123 Fashion Avenue<br />New York, NY 10001
                        </p>
                        {/* Decorative bars */}
                        <div className="mt-6 flex gap-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex flex-col gap-1.5">
                                    {[1, 2, 3].map(j => (
                                        <div key={j} className="w-8 h-1.5 rounded-full bg-[#10324A]/60 border border-[#6ED8FF]/20" />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeUp>

                {/* Contact details */}
                <FadeUp delay={300} className="flex-1 w-full">
                    <div className="flex flex-col gap-5">
                        {/* Email */}
                        <a href="mailto:indri@gmail.com"
                            className="flex items-center gap-3 text-[#10324A] hover:text-[#11B5F5] transition-colors duration-200 text-base font-medium">
                            <MailIcon />
                            indri@gmail.com
                        </a>

                        {/* Instagram */}
                        <a href="#"
                            className="flex items-center gap-3 text-[#10324A] hover:text-[#11B5F5] transition-colors duration-200 text-base font-medium">
                            <InstagramIcon />
                            @indricollection
                        </a>

                        {/* TikTok */}
                        <a href="#"
                            className="flex items-center gap-3 text-[#10324A] hover:text-[#11B5F5] transition-colors duration-200 text-base font-medium">
                            <TiktokIcon />
                            @indricollection
                        </a>

                        {/* Divider */}
                        <div className="border-t border-gray-100 pt-4 mt-1">
                            <p className="text-[#10324A] font-bold text-sm mb-1">Store Hours:</p>
                            <p className="text-gray-500 text-sm">Monday – Saturday: 10:00 AM – 8:00 PM</p>
                            <p className="text-gray-500 text-sm">Sunday: 11:00 AM – 6:00 PM</p>
                        </div>
                    </div>
                </FadeUp>
            </div>
        </section>
    );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
    return (
        <footer className="bg-[#10324A] text-white">
            {/* Main footer row */}
            <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Brand */}
                <div>
                    <p className="font-bold text-lg text-white">Indri Collection</p>
                    <p className="text-[#6ED8FF] text-sm mt-1">123 Fashion Avenue, New York, NY 10001</p>
                </div>

                {/* Social icons */}
                <div className="flex items-center gap-3">
                    {/* Chat */}
                    <a href="#" aria-label="Chat"
                        className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#11B5F5] hover:border-[#11B5F5] transition-all duration-200">
                        <ChatIcon />
                    </a>
                    {/* Email */}
                    <a href="mailto:indri@gmail.com" aria-label="Email"
                        className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#11B5F5] hover:border-[#11B5F5] transition-all duration-200">
                        <MailIcon />
                    </a>
                    {/* Instagram */}
                    <a href="#" aria-label="Instagram"
                        className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#11B5F5] hover:border-[#11B5F5] transition-all duration-200">
                        <InstagramIcon />
                    </a>
                </div>
            </div>

            {/* Copyright bar */}
            <div className="border-t border-white/10 py-4 text-center">
                <p className="text-[#6ED8FF]/70 text-xs">
                    © 2026 Indri Collection. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

// ── Combined export ───────────────────────────────────────────────────────────
export { ContactSection, Footer };
export default function ContactAndFooter() {
    return (
        <>
            <ContactSection />
            <Footer />
        </>
    );
}