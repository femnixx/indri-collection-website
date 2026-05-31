import section1Banner_desktop from '../assets/section1Banner_desktop.svg';
import section1Banner_mobile from "../assets/section1Banner_mobile.svg";
import Bar from '../components/Bar';

function SectionOne() {
    return (
        <div className='relative w-full bg-blue-900 min-h-screen'>
            {/* Navbar Bar.jsx dimasukin ke sini sama Surya */}
            <Bar /> 
            
            {/* Nampilin SVG Desktop (Disembunyiin di HP) */}
            <img 
                src={section1Banner_desktop} 
                alt="Banner Desktop" 
                className="w-full h-auto hidden md:block" 
            />
            
            {/* Nampilin SVG Mobile (Disembunyiin di Desktop) */}
            <img 
                src={section1Banner_mobile} 
                alt="Banner Mobile" 
                className="w-full h-auto block md:hidden" 
            />
        </div>
    )
}

export default SectionOne;