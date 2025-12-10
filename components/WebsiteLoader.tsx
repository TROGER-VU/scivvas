// components/WebsiteLoader.tsx

import React, { useState, useEffect } from 'react';

// --- Constants (remain the same) ---
const FADE_OUT_DURATION_MS = 700;
const LOADING_SIMULATION_TIME_MS = 1500; 
const RADIUS = 120; 
const STROKE_WIDTH = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; 
// ------------------------------------

const WebsiteLoader: React.FC = () => {
    const [progress, setProgress] = useState(0); 
    const [isVisible, setIsVisible] = useState(true);
    const [isRemoved, setIsRemoved] = useState(false); 

    useEffect(() => {
        const intervalDuration = LOADING_SIMULATION_TIME_MS / 100;
        let currentProgress = 0;

        const progressInterval = setInterval(() => {
            currentProgress += 1;
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                clearInterval(progressInterval);
                
                setTimeout(() => {
                    setIsVisible(false);
                }, 100); 

                const removalTimer = setTimeout(() => {
                    setIsRemoved(true); 
                }, 100 + FADE_OUT_DURATION_MS); 

                return () => clearTimeout(removalTimer);
            }
        }, intervalDuration);

        return () => clearInterval(progressInterval);
    }, []);

    if (isRemoved) {
        return null;
    }

    const strokeDashoffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

    // --- Styles ---

    const containerStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        zIndex: 9999,
        opacity: isVisible ? 1 : 0, 
        transition: `opacity ${FADE_OUT_DURATION_MS / 1000}s ease`,
    };

    const loaderWrapperStyle: React.CSSProperties = {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: `${RADIUS * 2 + STROKE_WIDTH}px`,
        height: `${RADIUS * 2 + STROKE_WIDTH}px`,
    };

    // --- UPDATED STYLE FOR TEXT INSIDE THE CIRCLE ---
    const centerTextStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: '#ff2929',
        textShadow: '0 0 5px rgba(255, 159, 252, 0.5)',
    };

    const titleStyle: React.CSSProperties = {
        fontFamily: 'var(--font-heading)',
        fontSize: '1.5rem', // Smaller text for the title
        fontWeight: '600',
        letterSpacing: '1px',
        marginBottom: '5px',
        opacity: 0.8,
    };

    const percentageStyle: React.CSSProperties = {
        fontFamily: 'var(--font-heading)',
        fontSize: '1.8rem', // Larger text for the percentage
        fontWeight: '700',
        lineHeight: 1, // Ensures tight vertical spacing
    };
    // --- END UPDATED STYLES ---

    return (
        <div style={containerStyle}>
            
            {/* Removed the "LOADING NEON PULSE..." text outside the circle */}
            
            <div style={loaderWrapperStyle}>
                {/* SVG implementation remains the same */}
                <svg
                    width={RADIUS * 2 + STROKE_WIDTH}
                    height={RADIUS * 2 + STROKE_WIDTH}
                    viewBox={`0 0 ${RADIUS * 2 + STROKE_WIDTH} ${RADIUS * 2 + STROKE_WIDTH}`}
                >
                    {/* Background Track */}
                    <circle
                        cx={RADIUS + STROKE_WIDTH / 2}
                        cy={RADIUS + STROKE_WIDTH / 2}
                        r={RADIUS}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth={STROKE_WIDTH}
                    />

                    {/* Foreground Fill */}
                    <circle
                        cx={RADIUS + STROKE_WIDTH / 2}
                        cy={RADIUS + STROKE_WIDTH / 2}
                        r={RADIUS}
                        fill="none"
                        stroke="#ff2929" 
                        strokeWidth={STROKE_WIDTH}
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={strokeDashoffset}
                        style={{
                            transformOrigin: 'center',
                            transform: 'rotate(-90deg)',
                            transition: 'stroke-dashoffset 0.1s linear',
                            filter: 'drop-shadow(0 0 5px #ff2929)',
                        }}
                    />
                </svg>

                {/* --- NEW CENTRAL TEXT WRAPPER --- */}
                <div style={centerTextStyle}>
                    <div style={titleStyle}>
                        LOADING SCIVVAS
                    </div>
                    <div style={percentageStyle}>
                        {Math.round(progress)}%
                    </div>
                </div>
                {/* --- END NEW CENTRAL TEXT WRAPPER --- */}
            </div>
        </div>
    );
};

export default WebsiteLoader;