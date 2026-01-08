
import React, { useState, useEffect, useCallback } from 'react';
import { BANNERS } from '../constants';

interface HeroBannerProps {
  onBookNow: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ onBookNow }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative h-[85vh] w-full overflow-hidden bg-gray-900">
      {BANNERS.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-linear transform scale-110"
            style={{ 
              backgroundImage: `url(${banner.image})`,
              transform: index === currentIndex ? 'scale(1)' : 'scale(1.1)'
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <div className={`max-w-2xl transition-all duration-700 delay-300 transform ${
                index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                {banner.seasonTag && (
                  <span className="inline-block bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                    {banner.seasonTag}
                  </span>
                )}
                <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-extrabold mb-6 leading-tight drop-shadow-lg">
                  {banner.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-lg">
                  {banner.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <button 
                    onClick={onBookNow}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                  >
                    View Our Plans
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-lg font-bold text-lg transition-all">
                    Call Us Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 transition-all duration-300 rounded-full ${
              index === currentIndex ? 'w-10 bg-orange-500' : 'w-2 bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>

      {/* Scroll Down */}
      <div className="absolute bottom-8 right-10 hidden md:block animate-bounce z-20">
         <div className="flex flex-col items-center">
           <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest mb-2 vertical-text">Scroll</span>
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
           </svg>
         </div>
      </div>
    </div>
  );
};

export default HeroBanner;
