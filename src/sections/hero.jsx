import WhatsappIcon from '../assets/Icon.png';
import heroBg from '../assets/images/Main.webp';
import { useScrollReveal } from '../hooks/use-scroll-reveal';

function Hero() {
    const [sectionRef, sectionVisible] = useScrollReveal(0.05);

    const base = 'transition-all ease-out';

    const fadeUp = (delay = '0ms') => ({
        style: { transitionDuration: '800ms', transitionDelay: sectionVisible ? delay : '0ms' },
        className: `${base} ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`,
    });

    return (
        <div
            id="home"
            ref={sectionRef}
            className="relative w-full min-h-screen overflow-hidden bg-primary bg-fabric-matrix"
        >
            <img
                src={heroBg}
                alt="Hero background"
                style={{ transitionDuration: '1200ms', transitionDelay: sectionVisible ? '0ms' : '0ms' }}
                className={`absolute inset-0 w-full h-full object-cover object-center ${base}
                    ${sectionVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
            />

            <div
                style={{ transitionDuration: '900ms', transitionDelay: sectionVisible ? '150ms' : '0ms' }}
                className={`absolute inset-0 bg-primary/60 ${base} ${sectionVisible ? 'opacity-100' : 'opacity-0'}`}
            />

            <div 
                style={{ transitionDuration: '1200ms', transitionDelay: sectionVisible ? '200ms' : '0ms' }}
                className={`absolute right-[5%] top-[10%] text-[160px] opacity-10 pointer-events-none select-none ${base}
                    ${sectionVisible ? 'rotate-0 scale-100 translate-x-0' : '-rotate-45 scale-75 translate-x-12'}`}
            >
                🪡
            </div>

            <div 
                style={{ transitionDuration: '1000ms', transitionDelay: sectionVisible ? '150ms' : '0ms' }}
                className={`absolute right-[-100px] bottom-[-50px] w-[450px] h-[450px] bg-[#5EA1E4]/10 rounded-full border-4 border-dashed border-[#5EA1E4]/20 pointer-events-none ${base}
                    ${sectionVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-24 scale-90'}`}
            />

            <div 
                style={{ transitionDuration: '900ms', transitionDelay: sectionVisible ? '400ms' : '0ms' }}
                className={`absolute right-[35%] bottom-[15%] text-4xl opacity-15 pointer-events-none select-none ${base}
                    ${sectionVisible ? 'opacity-15 translate-y-0 rotate-12' : 'opacity-0 translate-y-10 rotate-0'}`}
            >
                🔘
            </div>

            <div className="relative z-10 flex flex-col justify-center h-full min-h-screen px-6 md:px-16 lg:px-24 pt-24 pb-24">
                <div className="max-w-xl">

                    <h1
                        className={`${fadeUp('350ms').className} text-4xl md:text-6xl font-extrabold text-white leading-tight mb-2 tracking-tight`}
                        style={fadeUp('350ms').style}
                    >
                        Temukan
                    </h1>

                    <h1
                        className={`${fadeUp('500ms').className} text-4xl md:text-6xl font-extrabold text-accent leading-tight mb-4 tracking-tight`}
                        style={fadeUp('500ms').style}
                    >
                        <span className="relative inline-block">
                            Gaya Terbaikmu
                            
                        </span>
                    </h1>

                    <p
                        className={`${fadeUp('650ms').className} text-sm md:text-base text-gray-200 mb-8 leading-relaxed max-w-sm md:max-w-md font-normal`}
                        style={fadeUp('650ms').style}
                    >
                        Indri Collection adalah usaha konveksi pemberdayaan disabilitas di Malang, menghasilkan ragam pakaian dengan <span className="text-accent font-medium">kualitas jahitan premium</span> yang penuh ketelitian.
                    </p>

                    {/* Interactive Button Action Wrapper */}
                    <div 
                        className={`${fadeUp('700ms').className} flex flex-col sm:flex-row items-center gap-4`}
                        style={fadeUp('700ms').style}
                    >
                        <a 
                            href="#about" 
                            className="inline-flex items-center gap-2 bg-accent hover:-translate-y-1 hover:shadow-accent/30 border-2 border-transparent active:scale-95 text-white text-sm md:text-base font-bold px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg"
                        >
                            Jelajahi Koleksi 
                        </a>
                    </div>

                </div>
            </div>

            <div
                style={{ transitionDuration: '800ms', transitionDelay: sectionVisible ? '600ms' : '0ms' }}
                className={`absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10 ${base}
                    ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
                <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 md:h-20">
                    <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" className="fill-secondary" />
                </svg>
            </div>

            {/* Floating WhatsApp Chat Interaction Element */}
            <a
                href="https://wa.me/6285385353014"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat via WhatsApp"
                style={{ transitionDuration: '500ms', transitionDelay: sectionVisible ? '1000ms' : '0ms' }}
                className={`fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 border border-white/20
                    ${sectionVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
            >
                <img 
                    src={WhatsappIcon} 
                    alt="WhatsApp" 
                    className="w-8 h-8 object-contain" 
                />
            </a>
        </div>
    );
}

export default Hero;
