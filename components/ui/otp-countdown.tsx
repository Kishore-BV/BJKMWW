import React, { useState, useEffect } from 'react';

interface OTPCountdownProps {
  startFrom: number;
  onComplete: () => void;
}

const OTPCountdown: React.FC<OTPCountdownProps> = ({ startFrom, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(startFrom);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
    }
    return () => clearInterval(interval);
  }, [timeLeft, onComplete]);

  return (
    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-orange-100 bg-orange-50 relative">
      <span className={`text-2xl font-black ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-orange-600'}`}>
        {timeLeft}s
      </span>
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="38"
          cy="38"
          r="36"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className={`${timeLeft <= 10 ? 'text-red-500' : 'text-orange-600'} transition-all duration-1000 ease-linear`}
          strokeDasharray="226"
          strokeDashoffset={226 - (226 * timeLeft) / startFrom}
        />
      </svg>
    </div>
  );
};

export default OTPCountdown;
