import { useEffect, useState, useRef } from 'react';
import heroBg from '../assets/images/Main.jpg';

// Re-triggerable scroll animation hook
// Returns [ref, isVisible] — resets when element leaves viewport, re-animates on re-entry
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

function HeroSection() {
    const [sectionRef, sectionVisible] = useScrollReveal(0.05);

    const base = 'transition-all ease-out';

    const fadeUp = (delay = '0ms') => ({
        style: { transitionDuration: '700ms', transitionDelay: sectionVisible ? delay : '0ms' },
        className: `${base} ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`,
    });

    return (
        <div
            id="home"
            ref={sectionRef}
            className='relative w-full min-h-screen overflow-hidden bg-[#10324A]'
        >
            {/* Background — zoom on reveal */}
            <img
                src={heroBg}
                alt="Hero background"
                style={{ transitionDuration: '1200ms', transitionDelay: sectionVisible ? '0ms' : '0ms' }}
                className={`absolute inset-0 w-full h-full object-cover object-center ${base}
                    ${sectionVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
            />

            {/* Dark overlay */}
            <div
                style={{ transitionDuration: '900ms', transitionDelay: sectionVisible ? '150ms' : '0ms' }}
                className={`absolute inset-0 bg-[#10324A]/60 ${base} ${sectionVisible ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Hero content — pushed down to clear the fixed bar */}
            <div className='relative z-10 flex flex-col justify-center h-full min-h-screen px-6 md:px-16 lg:px-24 pt-24 pb-24'>
                <div className='max-w-xl'>

                    <h1
                        className={`${fadeUp('350ms').className} text-4xl md:text-6xl font-extrabold text-white leading-tight mb-2`}
                        style={fadeUp('350ms').style}
                    >
                        Discover Your
                    </h1>

                    <h1
                        className={`${fadeUp('500ms').className} text-4xl md:text-6xl font-extrabold text-[#11B5F5] leading-tight mb-4`}
                        style={fadeUp('500ms').style}
                    >
                        Perfect Style
                    </h1>

                    <p
                        className={`${fadeUp('650ms').className} text-sm md:text-base text-gray-200 mb-8 leading-relaxed max-w-sm md:max-w-md`}
                        style={fadeUp('650ms').style}
                    >
                        Elevate your wardrobe with{' '}
                        <span className='text-[#6ED8FF] font-medium'>premium fashion pieces</span>{' '}
                        that blend elegance with modern sophistication
                    </p>

                    <div
                        style={{ transitionDuration: '600ms', transitionDelay: sectionVisible ? '850ms' : '0ms' }}
                        className={`${base} ${sectionVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    >
                        <a href='#about-us' className='bg-[#11B5F5] hover:bg-[#6ED8FF] active:scale-95 text-white text-sm md:text-base font-semibold px-7 py-3 rounded-full transition-all duration-200 shadow-lg'>
                            Explore Collection
                        </a>
                    </div>

                </div>
            </div>

            {/* Bottom wave */}
            <div
                style={{ transitionDuration: '800ms', transitionDelay: sectionVisible ? '500ms' : '0ms' }}
                className={`absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10 ${base}
                    ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
                <svg viewBox='0 0 1440 80' xmlns='http://www.w3.org/2000/svg'
                    preserveAspectRatio='none' className='w-full h-16 md:h-20'>
                    <path d='M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z' fill='white' />
                </svg>
            </div>

            {/* WhatsApp button */}
            <a
                href='#'
                aria-label='Chat with us'
                style={{ transitionDuration: '500ms', transitionDelay: sectionVisible ? '1000ms' : '0ms' }}
                className={`fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-200
                    ${sectionVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
            >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
                    <path fillRule='evenodd' clipRule='evenodd'
                        d='M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z' />
                </svg>
            </a>
        </div>
    );
}

export default HeroSection;