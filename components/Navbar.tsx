
import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onBookNow: () => void;
  isBookingView: boolean;
  onHomeClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onBookNow, isBookingView, onHomeClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (isBookingView) {
      onHomeClick();
      // Small timeout to allow home to render before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navbarBg = isBookingView || isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4';
  const textColor = isBookingView || isScrolled ? 'text-gray-900' : 'text-white';
  const accentColor = isBookingView || isScrolled ? 'text-orange-600' : 'text-orange-400';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={onHomeClick}
        >
          <img
            src="/BJK.ico"
            alt="BJK Mobile Water Wash"
            className="h-14 md:h-16 lg:h-20 w-auto object-contain hover:scale-105 transition-transform"
            style={{
              filter: 'contrast(1.15) brightness(1.05) saturate(1.1)',
              imageRendering: '-webkit-optimize-contrast'
            }}
          />
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {!isBookingView && (
            <>
              <button onClick={() => scrollToSection('services')} className={`font-medium hover:text-orange-500 transition-colors ${textColor}`}>Services</button>
              <button onClick={() => scrollToSection('about')} className={`font-medium hover:text-orange-500 transition-colors ${textColor}`}>About</button>
            </>
          )}
          {isBookingView && (
            <button onClick={onHomeClick} className={`font-medium hover:text-orange-500 transition-colors ${textColor}`}>Back to Home</button>
          )}
          <button onClick={onBookNow} className={`bg-orange-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-700 transition-all transform hover:scale-105`}>
            Book Now
          </button>
        </div>

        <div className="md:hidden flex items-center">
          <button className={textColor}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
