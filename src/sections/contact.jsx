import { InstagramIcon, MailIcon, TiktokIcon } from '../components/ui/icons';
import SectionHeader from '../components/ui/section-header';
import { socialLinks, businessHours, contactInfo } from '../constants';
import { useScrollReveal } from '../hooks/use-scroll-reveal';

// Icon map — keeps JSX clean, avoids a switch statement
const ICON = {
  email:     <MailIcon />,
  instagram: <InstagramIcon />,
  tiktok:    <TiktokIcon />,
};

// Single Reveal wrapper — one IntersectionObserver per section is enough
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
  // Only email/instagram/tiktok have icons — filter out whatsapp (it's the FAB)
  const contactRows = socialLinks.filter((l) => ICON[l.id]);

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

            <div className="border-t border-gray-100 pt-5 mt-1">
              <p className="text-primary font-bold text-sm mb-2">Jam Operasional</p>
              {businessHours.map((h) => (
                <p key={h.days} className="text-gray-400 text-sm">
                  {h.days}: {h.hours}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}