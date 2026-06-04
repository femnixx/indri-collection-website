import { useState, useEffect } from 'react';

const NAV_LINKS = [
    { label: 'Home', href: '#home' },
    { label: 'Know More', href: '#know-more' },
    { label: 'Product', href: '#product' },
    { label: 'Testimonial', href: '#testimonial' },
    { label: 'Contact', href: '#contact' },
];

// Hamburger → X icon, animated
function MenuIcon({ open }) {
    return (
        <div className="relative w-6 h-5 flex flex-col justify-between">
            {/* Top bar */}
            <span
                className="block h-0.5 bg-white rounded-full transition-all duration-300 ease-out origin-center"
                style={{
                    transform: open ? 'translateY(9px) rotate(45deg)' : 'none',
                }}
            />
            {/* Middle bar */}
            <span
                className="block h-0.5 bg-white rounded-full transition-all duration-300 ease-out"
                style={{ opacity: open ? 0 : 1, transform: open ? 'scaleX(0)' : 'scaleX(1)' }}
            />
            {/* Bottom bar */}
            <span
                className="block h-0.5 bg-white rounded-full transition-all duration-300 ease-out origin-center"
                style={{
                    transform: open ? 'translateY(-9px) rotate(-45deg)' : 'none',
                }}
            />
        </div>
    );
}

function Bar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Add a subtle backdrop blur when user scrolls
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const handleNavClick = (href) => {
        setMenuOpen(false);
        // Smooth scroll to section
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {/* ── Top bar ─────────────────────────────────────────── */}
            <nav
                className={`relative z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-24 py-5 transition-all duration-300
                    ${scrolled ? 'bg-black/30 backdrop-blur-md' : 'bg-transparent'}`}
            >
                {/* Brand */}
                <button
                    onClick={() => handleNavClick('#home')}
                    className="text-white font-semibold text-lg tracking-wide hover:text-[#11B5F5] transition-colors duration-200"
                >
                    Indri Collection
                </button>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <button
                            key={link.label}
                            onClick={() => handleNavClick(link.href)}
                            className="text-white/90 hover:text-[#11B5F5] font-medium text-sm tracking-wide
                                relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0
                                after:bg-[#11B5F5] after:rounded-full after:transition-all after:duration-300
                                hover:after:w-full transition-colors duration-200"
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    className="md:hidden p-1 focus:outline-none"
                >
                    <MenuIcon open={menuOpen} />
                </button>
            </nav>

            {/* ── Mobile drawer overlay ────────────────────────────── */}
            {/* Backdrop */}
            <div
                onClick={() => setMenuOpen(false)}
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-400 md:hidden
                    ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />

            {/* Drawer panel — slides in from the right */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-72 bg-[#10324A] shadow-2xl flex flex-col
                    transition-transform duration-400 ease-out md:hidden
                    ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                    <span className="text-white font-semibold text-lg">Indri Collection</span>
                    <button
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                        className="p-1 text-white/70 hover:text-white transition-colors"
                    >
                        <MenuIcon open={true} />
                    </button>
                </div>

                {/* Drawer nav links — staggered fade-in */}
                <div className="flex flex-col px-6 pt-8 gap-2">
                    {NAV_LINKS.map((link, i) => (
                        <button
                            key={link.label}
                            onClick={() => handleNavClick(link.href)}
                            className={`text-left w-full text-white/80 hover:text-white hover:bg-white/10
                                font-medium text-base px-4 py-3 rounded-xl transition-all duration-200
                                border border-transparent hover:border-white/10
                                ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}
                            style={{
                                transitionDelay: menuOpen ? `${120 + i * 60}ms` : '0ms',
                                transitionDuration: '350ms',
                            }}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                {/* Decorative cyan accent at bottom */}
                <div
                    className={`mt-auto px-6 pb-10 transition-all duration-500
                        ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: menuOpen ? '450ms' : '0ms' }}
                >
                    <div className="h-px w-full bg-white/10 mb-6" />
                    <p className="text-[#6ED8FF] text-xs">
                        123 Fashion Avenue<br />New York, NY 10001
                    </p>
                    <div className="mt-4 w-10 h-1 rounded-full bg-[#11B5F5]" />
                </div>
            </div>
        </>
    );
}

export default Bar;