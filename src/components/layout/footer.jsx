import { contactInfo, socialLinks } from '@/constants'; 
import { ChatIcon, InstagramIcon, MailIcon } from '../ui/icons';

export default function Footer() {
    const getIcon = (id) => {
        switch (id) {
            case 'whatsapp': return <ChatIcon />;
            case 'email': return <MailIcon />;
            case 'instagram': return <InstagramIcon />;
            default: return null;
        }
    };

    return (
        <footer className="bg-primary text-white">
            <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center mb-2">
                        <img className="w-10 h-10 object-contain" src={'/logo-indri.svg'} alt="Logo"/>
                        <span className="font-bold text-xl">Indri Collection</span>
                    </div>
                    <p className="text-accent-light text-sm mt-2">{contactInfo.address}</p>
                </div>
                <div className="flex items-center gap-3">
                    {socialLinks.filter(link => ['whatsapp', 'email', 'instagram'].includes(link.id)).map(({ id, label, href }) => (
                        <a key={label} href={href} aria-label={label} target='_blank' rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:border-accent hover:scale-110 transition-all duration-200">
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
