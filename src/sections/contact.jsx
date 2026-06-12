import { InstagramIcon, MailIcon, TiktokIcon } from '../components/ui/icons';
import SectionHeader from '../components/ui/section-header';
import { useScrollReveal } from '../hooks/use-scroll-reveal';

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

// ── Contact Section ───────────────────────────────────────────────────────────
export default function Contact() {
    return (
        <section id="contact" className="bg-white py-20 px-6 md:px-16 lg:px-24">

            {/* Header */}
            <Reveal className="text-center mb-14">
                <SectionHeader title="Hubungi" highlightedText="Kami" />
                <p className="text-gray-400 text-sm md:text-base">
                    Kunjungi kami atau hubungi melalui kontak di bawah ini
                </p>
            </Reveal>

            {/* Grid */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-10">

                {/* Store Google Map iframe */}
                <Reveal delay={150}>
                    <div className="h-60 w-auto md:w-80 md:h-80 rounded-2xl shadow-xl overflow-hidden border-4 border-white">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d203.2388192792083!2d112.61190915601682!3d-7.938847851201809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7883000f8c5861%3A0xe88d20a59aba2693!2sIndri%20Collection!5e1!3m2!1sen!2sid!4v1781274935669!5m2!1sen!2sid"
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
                <Reveal delay={300} className="w-full md:w-auto md:min-w-[280px]">
                    <div className="flex flex-col gap-5">
                        <a href="mailto:indricollection@gmail.com"
                            className="flex items-center gap-3 text-[#10324A] hover:text-[#11B5F5] transition-colors duration-200 text-base font-medium group">
                            <span className="text-[#11B5F5] group-hover:scale-110 transition-transform duration-200"><MailIcon /></span>
                            <a href="mailto:indricollection@gmail.com">indricollection@gmail.com</a>
                        </a>
                        <a href="https://www.instagram.com/indricollection.mlg/" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 text-[#10324A] hover:text-[#11B5F5] transition-colors duration-200 text-base font-medium group">
                            <span className="text-[#11B5F5] group-hover:scale-110 transition-transform duration-200"><InstagramIcon /></span>
                            @indricollection.mlg
                        </a>
                        <a href="https://www.tiktok.com/@indricollection07" target='_blank' rel="noopener noreferrer"
                            className="flex items-center gap-3 text-[#10324A] hover:text-[#11B5F5] transition-colors duration-200 text-base font-medium group">
                            <span className="text-[#11B5F5] group-hover:scale-110 transition-transform duration-200"><TiktokIcon /></span>
                            @indricollection07
                        </a>

                        <div className="border-t border-gray-100 pt-5 mt-1">
                            <p className="text-[#10324A] font-bold text-sm mb-2">Jam Buka:</p>
                            <p className="text-gray-400 text-sm">Senin – Sabtu: 10:00 – 20:00 WIB</p>
                            <p className="text-gray-400 text-sm">Minggu: 11:00 – 18:00 WIB</p>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}