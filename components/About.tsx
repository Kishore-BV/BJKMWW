
import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 bg-gray-100 p-4 rounded-[40px] shadow-2xl">
              <img
                src="/BJK02.png"
                alt="Our Mobile Van"
                className="rounded-[32px] w-full object-cover aspect-video shadow-inner"
              />
              <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-600 text-white p-3 rounded-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-xl">Elite Grade</p>
                    <p className="text-gray-500 text-sm">Professional Equipment</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-50 rounded-full -z-10 blur-3xl opacity-60"></div>
          </div>

          <div className="w-full lg:w-1/2">
            <span className="text-orange-600 font-bold uppercase tracking-widest text-sm">Our Infrastructure</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-6 leading-tight">We Bring the Service Center to Your Garage</h2>
            <p className="text-gray-600 text-lg mb-8">
              BJK Mobile Water Wash is powered by state-of-the-art high-pressure washing machines and steam cleaners. Our customized service vans carry everything needed—water, power, and professional chemicals.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Save Time</h4>
                  <p className="text-gray-500 text-sm">No more waiting in queues. We wash while you work or relax.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Eco-Friendly</h4>
                  <p className="text-gray-500 text-sm">Our water-efficient tech uses 70% less water than traditional hose-washing.</p>
                </div>
              </div>
            </div>

            <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-colors flex items-center gap-3">
              Learn More About Us
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
