import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

interface CountdownProps {
  startFrom: number;
  onComplete?: () => void;
}

export default function Countdown({ startFrom = 90, onComplete }: CountdownProps) {
    const count = useMotionValue(startFrom);
    const rounded = useTransform(() => Math.round(count.get()));
    
    useEffect(() => {
        const controls = animate(count, 0, { 
            duration: startFrom, 
            ease: "linear",
            onComplete: () => {
                if (onComplete) onComplete();
            }
        });
        
        return () => controls.stop();
    }, [count, startFrom, onComplete]);

    return (
        <div className="flex flex-col items-center justify-center space-y-2">
            <motion.div 
                className="text-5xl font-black text-orange-600 tracking-tighter tabular-nums"
                style={{
                  textShadow: '0 4px 12px rgba(234, 88, 12, 0.2)'
                }}
            >
                {rounded}
            </motion.div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Seconds Left</p>
        </div>
    );
}
