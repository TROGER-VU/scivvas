// components/Countdown.tsx
'use client';
import React, { useState, useEffect } from 'react';

// Define the structure for the individual time segments
interface TimeSegmentProps {
    value: number;
    label: string;
}

// Helper component for displaying a single time number and label
const TimeSegment: React.FC<TimeSegmentProps> = ({ value, label }) => {
    return (
        <div style={{ textAlign: 'center', margin: '0 10px' }}>
            {/* The main number, large and neon-styled */}
            <div style={{ 
                fontSize: 'clamp(2rem, 8vw, 5rem)', // Responsive sizing
                fontWeight: '700',
                lineHeight: 1,
                // Neon Gradient Color
                background: 'linear-gradient(45deg, #FF9FFC, #ff2929)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                // Subtle shadow for the pop-out effect
                textShadow: '0 0 5px rgba(255, 159, 252, 0.5), 0 0 10px rgba(255, 41, 41, 0.5)',
            }}>
                {/* Pad the number with a leading zero if less than 10 */}
                {value.toString().padStart(2, '0')}
            </div>
            {/* The label, small and contrasting */}
            <div style={{ 
                fontSize: 'clamp(0.8rem, 2vw, 1.1rem)', 
                fontWeight: '600',
                opacity: 0.7,
                marginTop: '5px',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)' // Use the legible body font
            }}>
                {label}
            </div>
        </div>
    );
};

// Main Countdown Component Props
interface CountdownProps {
    targetDate: string; // ISO 8601 date string (e.g., "2026-06-15T20:00:00")
    eventName: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, eventName }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const targetTime = new Date(targetDate).getTime();

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const distance = targetTime - now;

            // Stop the countdown if the target time has passed
            if (distance < 0) {
                setTimeLeft(0);
                clearInterval(interval);
                return;
            }

            setTimeLeft(distance);
        };

        // Calculate immediately on mount
        calculateTimeLeft();
        
        // Update every second
        const interval = setInterval(calculateTimeLeft, 1000);

        // Cleanup on unmount
        return () => clearInterval(interval);
    }, [targetDate]);

    // Conversion function: milliseconds to days, hours, minutes, seconds
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    const isFinished = timeLeft <= 0;

    return (
        <div style={{ textAlign: 'center', color: 'white', padding: '20px' }}>
            {/* Event Title */}
            <h2 style={{ 
                fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                fontWeight: '700',
                marginBottom: '20px',
                fontFamily: 'var(--font-heading)', // Use the strong heading font
                textTransform: 'uppercase',
                // Optional: A little shadow to separate from background
                textShadow: '0 2px 5px rgba(0, 0, 0, 0.5)'
            }}>
                {isFinished ? 'The Show is Live!' : `Next Event: ${eventName}`}
            </h2>

            {/* Countdown Grid/Flex */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '20px' 
            }}>
                {isFinished ? (
                    <div style={{ fontSize: '2rem', color: '#ff2929' }}>GET READY TO PARTY!</div>
                ) : (
                    <>
                        <TimeSegment value={days} label="Days" />
                        <TimeSegment value={hours} label="Hours" />
                        <TimeSegment value={minutes} label="Minutes" />
                        <TimeSegment value={seconds} label="Seconds" />
                    </>
                )}
            </div>
        </div>
    );
};

export default Countdown;