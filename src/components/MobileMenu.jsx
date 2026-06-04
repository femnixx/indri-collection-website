import { useState, useEffect } from 'react';

const NAV_LINKS = [
    { label: 'Home', href: '#home' },
    { label: 'Know More', href: '#know-more' },
    { label: 'Product', href: '#product' },
    { label: 'Testimonial', href: '#testimonial' },
    { label: 'Contact', href: '#contact' },
];

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

function Bar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [inHero, setInHero] = useState(true);
    const [barVisible, setBarVisible] = useState(false);

    useEffect(() => {
        // Animate bar in on mount
        const t = setTimeout(() => setBarVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            // Hero section is roughly 100vh tall
            const heroHeight = window.innerHeight;
            setInHero(window.scrollY < heroHeight - 80);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const handleNavClick = (href) => {
        setMenuOpen(false);
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {/* ── Top bar ── */}
            <nav
                style={{ transitionDuration: '500ms', transitionDelay: barVisible ? '0ms' : '0ms' }}
                className={`
                    fixed top-0 left-0 right-0 z-50
                    flex items-center justify-between
                    px-6 md:px-16 lg:px-24 py-5
                    transition-all duration-500 ease-out
                    ${barVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
                    ${inHero
                        ? 'bg-transparent'
                        : 'bg-[#11B5F5] shadow-lg shadow-[#11B5F5]/30'
                    }
                `}
            >
                {/* Brand */}
                <button
                    onClick={() => handleNavClick('#home')}
                    className="text-white font-bold text-lg tracking-wide transition-opacity duration-200 hover:opacity-80"
                >
                    Indri Collection
                </button>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <button
                            key={link.label}
                            onClick={() => handleNavClick(link.href)}
                            className="text-white font-medium text-sm tracking-wide
                                relative pb-0.5
                                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0
                                after:bg-white after:rounded-full after:transition-all after:duration-300
                                hover:after:w-full hover:opacity-80 transition-opacity duration-200"
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

            {/* Spacer so fixed bar doesn't overlap content outside hero */}
            <div className={`transition-all duration-500 ${inHero ? 'h-0' : 'h-[72px]'}`} />

            {/* ── Mobile drawer backdrop ── */}
            <div
                onClick={() => setMenuOpen(false)}
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden
                    ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />

            {/* ── Mobile drawer panel ── */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-72 bg-[#10324A] shadow-2xl flex flex-col
                    transition-transform duration-400 ease-out md:hidden
                    ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                    <span className="text-white font-bold text-lg">Indri Collection</span>
                    <button
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                        className="p-1 text-white/70 hover:text-white transition-colors"
                    >
                        <MenuIcon open={true} />
                    </button>
                </div>

                {/* Drawer links — staggered */}
                <div className="flex flex-col px-6 pt-8 gap-2">
                    {NAV_LINKS.map((link, i) => (
                        <button
                            key={link.label}
                            onClick={() => handleNavClick(link.href)}
                            className={`text-left w-full text-white/80 hover:text-white hover:bg-white/10
                                font-medium text-base px-4 py-3 rounded-xl
                                border border-transparent hover:border-white/10
                                transition-all
                                ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}
                            style={{
                                transitionDuration: '350ms',
                                transitionDelay: menuOpen ? `${120 + i * 60}ms` : '0ms',
                            }}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                {/* Drawer footer accent */}
                <div
                    className={`mt-auto px-6 pb-10 transition-all duration-500
                        ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: menuOpen ? '450ms' : '0ms' }}
                >
                    <div className="h-px w-full bg-white/10 mb-6" />
                    <p className="text-[#6ED8FF] text-xs leading-relaxed">
                        123 Fashion Avenue<br />New York, NY 10001
                    </p>
                    <div className="mt-4 w-10 h-1 rounded-full bg-[#11B5F5]" />
                </div>
            </div>
        </>
    );
}

export default Bar;