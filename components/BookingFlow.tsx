import React, { useState } from 'react';
import Countdown from "@/components/ui/countdown";
import { jwtDecode } from "jwt-decode";
import { SERVICE_PACKAGES } from '../constants';
import { BookingData } from '../types';

interface BookingFlowProps {
  initialPlanId?: string;
  onComplete: (data: BookingData) => void;
  onCancel: () => void;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ initialPlanId, onComplete, onCancel }) => {
  const [step, setStep] = useState(initialPlanId ? 2 : 1);
  const [bookingData, setBookingData] = useState<Partial<BookingData> & { email?: string }>({
    planId: initialPlanId || '',
    name: '',
    phone: '',
    email: '',
    carModel: '',
    address: '',
    date: '',
    time: ''
  });

  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpStatus, setOtpStatus] = useState<'idle'|'error'|'success'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [slotError, setSlotError] = useState('');

  const handleTimerComplete = () => {
    setOtpStatus('error');
    setTimeout(() => {
      setOtpStatus('idle');
      setEnteredOtp('');
      setBookingData({
        planId: '',
        name: '',
        phone: '',
        email: '',
        carModel: '',
        address: '',
        date: '',
        time: ''
      });
      setSlotError('');
      setStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const selectedPlan = SERVICE_PACKAGES.find(p => p.id === bookingData.planId);

  const handlePlanSelect = (id: string) => {
    setBookingData(prev => ({ ...prev, planId: id }));
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Only allow digits up to 10 characters for phone input
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setBookingData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }
    
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingData.name && bookingData.phone?.length === 10 && bookingData.email && bookingData.address) {
      setIsLoading(true);
      
      const newBookingId = `BJK-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
      setBookingId(newBookingId);
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      
      const formattedPhone = `+91${bookingData.phone}`;
      
      const payload = { ...bookingData, phone: formattedPhone, bookingId: newBookingId };
      const otpPayload = { 
        bookingId: newBookingId, 
        otp, 
        email: bookingData.email, 
        phone: formattedPhone 
      };
      
      try {
        // Fire the booking data to CDF (fire-and-forget to avoid blocking)
        fetch('https://n8n.kishoren8n.in/webhook/CDF', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(err => console.error("Error sending to CDF:", err));
        
        // Unconditionally instantly move the user to the OTP verification form
        setSlotError('');
        setIsLoading(false);
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } catch (error) {
        console.error('Submission error:', error);
        setSlotError('An error occurred. Please try again.');
        setIsLoading(false);
      }
    }
  };

  const extractJwtToken = (data: any): string | null => {
    if (!data) return null;
    if (typeof data === 'string' && data.startsWith('eyJ')) return data;
    if (data.jwt) return data.jwt;
    if (data.token) return data.token;
    if (data.jwtToken) return data.jwtToken;
    if (data.accessToken) return data.accessToken;
    if (Array.isArray(data) && data.length > 0) return extractJwtToken(data[0]);
    if (typeof data === 'object') {
      for (const key in data) {
        if (typeof data[key] === 'string' && data[key].startsWith('eyJ')) return data[key];
        if (typeof data[key] === 'object') {
          const token = extractJwtToken(data[key]);
          if (token) return token;
        }
      }
    }
    return null;
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // Allow 123456 as backdoor during dev/testing
    if (enteredOtp === '123456') {
      setOtpStatus('success');
      setTimeout(() => {
        onComplete(bookingData as BookingData);
      }, 3000);
      setIsVerifying(false);
      return;
    }

    const otpPayload = { 
      bookingId: bookingId, 
      otp: Number(enteredOtp), 
      email: bookingData.email, 
      phone: `+91${bookingData.phone}`
    };

    console.log("Firing OTP Confirmation Webhook with payload:", otpPayload);

    try {
      const response = await fetch('https://n8n.kishoren8n.in/webhook/OTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(otpPayload),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        data = text;
      }
      
      console.log("OTP Webhook Response:", data);
      
      const token = extractJwtToken(data);
      
      if (token) {
        try {
          // Properly decode the JWT to check its payload using jwt-decode
          const decoded = jwtDecode<{ status?: string }>(token);
          console.log("Decoded JWT payload:", decoded);
          
          if (decoded.status === 'Success') {
            localStorage.setItem('auth_token', token);
            setOtpStatus('success');
            setTimeout(() => {
              onComplete(bookingData as BookingData);
            }, 3000);
          } else {
            throw new Error("OTP verification failed, JWT status is not Success");
          }
        } catch (decodeErr) {
          console.error("Failed to decode JWT:", decodeErr);
          throw new Error("Invalid JWT token received");
        }
      } else {
        throw new Error("No JWT token received or invalid OTP");
      }
    } catch (error) {
      console.error("Error confirming OTP:", error);
      setOtpStatus('error');
      setTimeout(() => {
        setOtpStatus('idle');
        setEnteredOtp('');
        // Reset the form and send user back to start
        setBookingData({
          planId: '',
          name: '',
          phone: '',
          email: '',
          carModel: '',
          address: '',
          date: '',
          time: ''
        });
        setSlotError('');
        setStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2000);
    } finally {
      setIsVerifying(false);
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
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center w-full max-w-2xl mx-auto px-4">
            <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 1 ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className={`flex-1 h-1 mx-2 transition-colors ${step >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 2 ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <div className={`flex-1 h-1 mx-2 transition-colors ${step >= 3 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 3 ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-gray-200 text-gray-500'}`}>3</div>
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

              <form onSubmit={handleSubmitDetails} className="space-y-6">
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
                      type="tel"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. yourname@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
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
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${slotError ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                    >
                      <option value="">Select a slot</option>
                      <option value="09:00 - 11:00">09:00 AM - 11:00 AM</option>
                      <option value="11:00 - 01:00">11:00 AM - 01:00 PM</option>
                      <option value="02:00 - 04:00">02:00 PM - 04:00 PM</option>
                      <option value="04:00 - 06:00">04:00 PM - 06:00 PM</option>
                    </select>
                  </div>
                </div>

                {slotError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-center animate-shake">
                    <svg className="w-5 h-5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="font-bold text-sm">{slotError}</p>
                  </div>
                )}

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
                    disabled={isLoading}
                    className="flex-[2] py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Confirm Details'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fadeIn max-w-xl mx-auto">
            <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 text-center">
              
              {otpStatus === 'idle' && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Enter OTP</h2>
                  <p className="text-gray-600 mb-6">We've sent a 6-digit code to your contact details.</p>
                  
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "32px",
                  }}>
                    <Countdown
                      startFrom={90}
                      onComplete={handleTimerComplete}
                    />
                  </div>
                  
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                      <input
                        required
                        type="text"
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        className="w-1/2 mx-auto text-center text-3xl tracking-widest px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="pt-4 flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 py-4 bg-gray-100 text-gray-900 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isVerifying}
                        className="flex-[2] py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 disabled:opacity-50"
                      >
                        {isVerifying ? 'Verifying...' : 'Confirm OTP'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {otpStatus === 'success' && (
                <div className="py-12 animate-scaleIn flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-100">
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Hurray!</h2>
                  <p className="text-gray-600">OTP Verified Successfully.</p>
                </div>
              )}

              {otpStatus === 'error' && (
                <div className="py-12 animate-shake flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-red-100">
                    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Oops!</h2>
                  <p className="text-gray-600">Time's up or incorrect OTP. Please try again.</p>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
