
import React, { useState } from 'react';
import { SERVICE_PACKAGES } from '../constants';
import { BookingData } from '../types';

interface BookingFlowProps {
  initialPlanId?: string;
  onComplete: (data: BookingData) => void;
  onCancel: () => void;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ initialPlanId, onComplete, onCancel }) => {
  const [step, setStep] = useState(initialPlanId ? 2 : 1);
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({
    planId: initialPlanId || '',
    name: '',
    phone: '',
    carModel: '',
    address: '',
    date: '',
    time: ''
  });

  const selectedPlan = SERVICE_PACKAGES.find(p => p.id === bookingData.planId);

  const handlePlanSelect = (id: string) => {
    setBookingData(prev => ({ ...prev, planId: id }));
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingData.name && bookingData.phone && bookingData.address) {
      onComplete(bookingData as BookingData);
    }
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setBookingData(prev => ({ 
          ...prev, 
          address: `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude} (Checking exact address...)` 
        }));
      });
    }
  };

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className={`w-12 md:w-24 h-1 mx-2 transition-colors ${step >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <div className={`w-12 md:w-24 h-1 mx-2 transition-colors ${step >= 3 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
          </div>
        </div>

        {step === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Select Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SERVICE_PACKAGES.map((pkg) => (
                <div 
                  key={pkg.id}
                  onClick={() => handlePlanSelect(pkg.id)}
                  className={`cursor-pointer bg-white p-6 rounded-3xl border-2 transition-all hover:scale-105 ${bookingData.planId === pkg.id ? 'border-orange-500 bg-orange-50' : 'border-transparent shadow-lg'}`}
                >
                  <h3 className="font-bold text-xl mb-2">{pkg.name}</h3>
                  <p className="text-2xl font-black text-orange-600 mb-4">Rs. {pkg.price}</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {pkg.items.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full mt-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm">Select</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fadeIn max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900">Your Details</h2>
                <button onClick={() => setStep(1)} className="text-orange-600 text-sm font-bold flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                  Change Plan
                </button>
              </div>

              <div className="bg-orange-50 p-4 rounded-2xl mb-8 flex justify-between items-center border border-orange-100">
                <div>
                  <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Selected Package</p>
                  <p className="font-bold text-gray-900">{selectedPlan?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Price</p>
                  <p className="font-bold text-gray-900">Rs. {selectedPlan?.price}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input 
                      required
                      name="name"
                      value={bookingData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                    <input 
                      required
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 9884774881"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Car Model & Number</label>
                  <input 
                    required
                    name="carModel"
                    value={bookingData.carModel}
                    onChange={handleInputChange}
                    placeholder="e.g. Honda City - TN 01 AB 1234"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700">Service Address</label>
                    <button type="button" onClick={useCurrentLocation} className="text-xs font-bold text-orange-600 flex items-center hover:underline">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      Use My Location
                    </button>
                  </div>
                  <textarea 
                    required
                    name="address"
                    value={bookingData.address}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Enter your full doorstep address..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Date</label>
                    <input 
                      required
                      type="date"
                      name="date"
                      value={bookingData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Time Slot</label>
                    <select 
                      required
                      name="time"
                      value={bookingData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select a slot</option>
                      <option value="09:00 - 11:00">09:00 AM - 11:00 AM</option>
                      <option value="11:00 - 01:00">11:00 AM - 01:00 PM</option>
                      <option value="02:00 - 04:00">02:00 PM - 04:00 PM</option>
                      <option value="04:00 - 06:00">04:00 PM - 06:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-4 bg-gray-100 text-gray-900 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
