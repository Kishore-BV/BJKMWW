
import React from 'react';
import { SERVICE_PACKAGES } from '../constants';

interface ServicesProps {
  onPlanSelect: (planId: string) => void;
}

const Services: React.FC<ServicesProps> = ({ onPlanSelect }) => {
  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-orange-600 font-bold uppercase tracking-widest text-sm">Professional Cleaning</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-4">Choose Your Wash Package</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From basic washes to premium detailing, our mobile units are equipped with high-tech machinery to bring the best cleaning to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {SERVICE_PACKAGES.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative bg-white rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl border-2 group flex flex-col ${
                pkg.featured ? 'border-orange-500 shadow-xl scale-105 z-10' : 'border-transparent shadow-lg'
              }`}
            >
              {pkg.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-bold py-1 px-4 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-500 text-sm">{pkg.description}</p>
              </div>

              <div className="flex items-baseline mb-8">
                <span className="text-gray-400 text-lg">Rs.</span>
                <span className="text-5xl font-extrabold text-gray-900 ml-1">{pkg.price}</span>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {pkg.items.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="mt-1 bg-green-100 rounded-full p-0.5 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => onPlanSelect(pkg.id)}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  pkg.featured 
                  ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Book Package
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
