
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import Services from './components/Services';
import About from './components/About';
import Footer from './components/Footer';
import BookingFlow from './components/BookingFlow';
import ChatBot from './components/ChatBot';
import { CONTACT } from './constants';
import { BookingData } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'booking' | 'success'>('home');
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>();
  const [lastBooking, setLastBooking] = useState<BookingData | null>(null);

  const handleBookNow = () => {
    setSelectedPlan(undefined);
    setView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingComplete = (data: BookingData) => {
    setLastBooking(data);
    setView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white p-8 md:p-12 rounded-[48px] shadow-2xl border border-white animate-fadeIn">
          <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100 ring-8 ring-green-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Booking Confirmed!</h2>
          
          <div className="text-slate-600 mb-8 leading-relaxed px-2">
            Great news <span className="font-bold text-slate-900">{lastBooking?.name}</span>! Your doorstep mobile wash is locked in. We'll arrive at your location on <span className="font-bold text-slate-900">{lastBooking?.date}</span> during the <span className="font-bold text-slate-900">{lastBooking?.time}</span> slot.
          </div>
          
          <div className="bg-slate-50 rounded-[32px] p-6 mb-8 text-left border border-slate-200">
            <div className="flex items-center space-x-2 mb-5 border-b border-slate-200 pb-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
              <h4 className="font-black text-[11px] text-slate-400 uppercase tracking-widest">Appointment Summary</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-tight">Wash Plan</span> 
                <span className="font-black text-slate-900 text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                  BJK WASH-0{lastBooking?.planId.split('-')[1]}
                </span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-tight">Vehicle Details</span> 
                <span className="font-black text-slate-900 text-base uppercase bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
                  {lastBooking?.carModel}
                </span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-tight">Service Address</span> 
                <span className="font-medium text-slate-700 text-sm leading-snug bg-white/50 p-3 rounded-2xl border border-slate-100">
                  {lastBooking?.address}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <button 
              onClick={handleBackToHome}
              className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95"
            >
              Finish & Exit
            </button>
            <a 
              href={`https://wa.me/${CONTACT.whatsapp.replace('+', '')}?text=Hi BJK Wash, I've booked a service for my vehicle (${lastBooking?.carModel}) on ${lastBooking?.date}. Please confirm!`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-green-100"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.589.943 3.143 1.411 4.746 1.412 5.403 0 9.803-4.397 9.805-9.802 0-2.618-1.02-5.08-2.871-6.932-1.851-1.852-4.311-2.872-6.93-2.873-5.405 0-9.803 4.398-9.806 9.801 0 1.688.455 3.334 1.316 4.77l-.98 3.58 3.72-.976zm11.365-5.394c-.273-.136-1.62-.8-1.869-.89-.25-.089-.431-.136-.613.136-.182.273-.705.89-.863 1.071-.159.182-.318.204-.591.068-.273-.136-1.152-.424-2.195-1.353-.811-.724-1.359-1.618-1.518-1.89-.159-.273-.017-.42.12-.555.123-.122.273-.318.409-.477.136-.159.182-.273.273-.454.091-.182.045-.341-.023-.477-.068-.136-.613-1.477-.841-2.022-.222-.53-.447-.457-.613-.466-.159-.008-.341-.011-.523-.011-.182 0-.477.068-.727.341-.25.273-.954.932-.954 2.273s.977 2.636 1.114 2.818c.136.182 1.921 2.933 4.653 4.111.649.28 1.157.447 1.552.572.652.208 1.246.179 1.715.109.523-.078 1.62-.663 1.847-1.303.227-.641.227-1.182.159-1.303-.068-.11-.25-.179-.523-.315z"/></svg>
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-orange-200 selection:text-orange-900 relative">
      <Navbar 
        onBookNow={handleBookNow} 
        isBookingView={view === 'booking'} 
        onHomeClick={handleBackToHome}
      />
      
      {view === 'home' ? (
        <main>
          <HeroBanner onBookNow={handleBookNow} />
          
          {/* Mobile Value Prop Banner */}
          <div className="bg-orange-600 text-white py-3 overflow-hidden whitespace-nowrap">
            <div className="animate-marquee inline-block">
              <span className="mx-4 font-bold uppercase tracking-tighter">🚀 WE COME TO YOU</span>
              <span className="mx-4 font-bold uppercase tracking-tighter">💧 ECO-FRIENDLY WASH</span>
              <span className="mx-4 font-bold uppercase tracking-tighter">🏠 DOORSTEP SERVICE</span>
              <span className="mx-4 font-bold uppercase tracking-tighter">⚡ QUICK BOOKING</span>
              <span className="mx-4 font-bold uppercase tracking-tighter">🚀 WE COME TO YOU</span>
              <span className="mx-4 font-bold uppercase tracking-tighter">💧 ECO-FRIENDLY WASH</span>
              <span className="mx-4 font-bold uppercase tracking-tighter">🏠 DOORSTEP SERVICE</span>
              <span className="mx-4 font-bold uppercase tracking-tighter">⚡ QUICK BOOKING</span>
            </div>
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                animation: marquee 20s linear infinite;
              }
            `}</style>
          </div>

          <Services onPlanSelect={handlePlanSelect} />
          
          {/* Mobile Sticky CTA */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] md:hidden">
            <button 
              onClick={handleBookNow}
              className="w-full flex items-center justify-center space-x-3 bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-2xl ring-4 ring-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Book Appointment</span>
            </button>
          </div>

          <About />

          {/* Features Icon Section */}
          <section className="py-20 bg-slate-900">
             <div className="container mx-auto px-4">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                  <div className="flex flex-col items-center">
                     <div className="bg-orange-600 p-4 rounded-full mb-4 shadow-lg shadow-orange-900/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                     </div>
                     <h5 className="font-bold text-lg mb-1">100% Satisfied</h5>
                     <p className="text-white/40 text-sm">Quality Guaranteed</p>
                  </div>
                  <div className="flex flex-col items-center">
                     <div className="bg-orange-600 p-4 rounded-full mb-4 shadow-lg shadow-orange-900/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                     </div>
                     <h5 className="font-bold text-lg mb-1">Mobile Unit</h5>
                     <p className="text-white/40 text-sm">At Your Doorstep</p>
                  </div>
                  <div className="flex flex-col items-center">
                     <div className="bg-orange-600 p-4 rounded-full mb-4 shadow-lg shadow-orange-900/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758L5 19m0-14l4.121 4.121" />
                        </svg>
                     </div>
                     <h5 className="font-bold text-lg mb-1">Hi-Tech Tools</h5>
                     <p className="text-white/40 text-sm">Steam & Pressure</p>
                  </div>
                  <div className="flex flex-col items-center">
                     <div className="bg-orange-600 p-4 rounded-full mb-4 shadow-lg shadow-orange-900/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                     </div>
                     <h5 className="font-bold text-lg mb-1">Best Price</h5>
                     <p className="text-white/40 text-sm">No Hidden Costs</p>
                  </div>
               </div>
             </div>
          </section>

          {/* CTA Contact Section */}
          <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
               <div className="bg-slate-900 rounded-[40px] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                 <div className="relative z-10">
                   <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready for a Mobile Deep Clean?</h2>
                   <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">Skip the service station. We bring the full wash experience to your home or office.</p>
                   <div className="flex flex-wrap justify-center gap-6">
                      <button 
                        onClick={handleBookNow}
                        className="bg-orange-600 hover:bg-orange-700 px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 transition-all transform hover:scale-105 shadow-xl shadow-orange-900/40"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Book Online Now</span>
                      </button>
                      <a 
                        href={`tel:${CONTACT.phones[0].replace(/\s/g, '')}`} 
                        className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 transition-all border border-white/10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>Call Support</span>
                      </a>
                   </div>
                 </div>
                 {/* Background Glow Decorations */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse"></div>
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
               </div>
            </div>
          </section>
        </main>
      ) : (
        <BookingFlow 
          initialPlanId={selectedPlan} 
          onComplete={handleBookingComplete} 
          onCancel={handleBackToHome}
        />
      )}
      
      <ChatBot />
      <Footer />
    </div>
  );
};

export default App;
