'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use Next.js router for redirection

interface SwipeButtonProps {
    destination: string; // URL to go to on success
    text?: string;
    mainColor?: string; // Neon accent color
}

const SwipeButton: React.FC<SwipeButtonProps> = ({ 
    destination, 
    text = "SWIPE TO ACCESS", 
    mainColor = "#FF9FFC" 
}) => {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    
    const [isDragging, setIsDragging] = useState(false);
    const [dragWidth, setDragWidth] = useState(0); // Width of the filled area
    const [isUnlocked, setIsUnlocked] = useState(false);

    // --- LOGIC ---

    const handleStart = (clientX: number) => {
        if (isUnlocked) return;
        setIsDragging(true);
    };

    const handleMove = (clientX: number) => {
        if (!isDragging || !containerRef.current || isUnlocked) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const startX = containerRect.left;
        const containerWidth = containerRect.width;
        
        // Calculate new width relative to mouse position
        // We subtract a small buffer (e.g. 50px) so the handle stays inside
        const maxDrag = containerWidth; 
        let newWidth = clientX - startX;

        // Constrain width
        if (newWidth < 50) newWidth = 50; // Minimum handle size
        if (newWidth > maxDrag) newWidth = maxDrag;

        setDragWidth(newWidth);

        // Check for unlock threshold (e.g., 95% of the way)
        if (newWidth >= containerWidth - 5) {
            handleUnlock();
        }
    };

    const handleEnd = () => {
        if (isUnlocked) return;
        setIsDragging(false);
        // Snap back if not unlocked
        setDragWidth(0); 
    };

    const handleUnlock = () => {
        setIsUnlocked(true);
        setIsDragging(false);
        setDragWidth(containerRef.current ? containerRef.current.clientWidth : 1000);
        
        // Redirect after a short "Success" animation
        setTimeout(() => {
            router.push(destination);
        }, 800); 
    };

    // --- EVENT LISTENERS ---

    // Mouse
    const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
    
    // Touch
    const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);

    // Global Move/Up listeners to catch dragging outside the box
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
        const onMouseUp = () => handleEnd();
        const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
        const onTouchEnd = () => handleEnd();

        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('touchmove', onTouchMove);
            window.addEventListener('touchend', onTouchEnd);
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [isDragging, isUnlocked]);


    // --- STYLES ---

    const CONTAINER_STYLE: React.CSSProperties = {
        position: 'relative',
        width: '100%',
        maxWidth: '320px',
        height: '60px',
        backgroundColor: 'rgba(0,0,0,0.6)',
        border: `1px solid ${isUnlocked ? '#fff' : '#333'}`,
        borderRadius: '60px',
        overflow: 'hidden',
        // cursor: isUnlocked ? 'default' : 'grab',
        boxShadow: isUnlocked 
            ? `0 0 30px ${mainColor}, inset 0 0 20px ${mainColor}` 
            : '0 0 10px rgba(0,0,0,0.5)',
        transition: 'border 0.3s ease, box-shadow 0.3s ease',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
    };

    const FILL_STYLE: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: isDragging || isUnlocked ? `${dragWidth}px` : '60px', // Start with handle width
        backgroundColor: isUnlocked ? '#fff' : `${mainColor}20`, // Dim fill when dragging, White when unlocked
        transition: isDragging ? 'none' : 'width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Snap back animation
        borderRight: isUnlocked ? 'none' : `1px solid ${mainColor}`,
        boxShadow: `inset 0 0 15px ${mainColor}`,
    };

    // The glowing handle knob
    const HANDLE_STYLE: React.CSSProperties = {
        position: 'absolute',
        right: '0',
        top: '0',
        height: '100%',
        width: '60px',
        borderRadius: '50%',
        backgroundColor: isUnlocked ? mainColor : mainColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        fontSize: '1.2rem',
        boxShadow: `0 0 20px ${mainColor}`,
        zIndex: 20
    };

    const TEXT_STYLE: React.CSSProperties = {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        pointerEvents: 'none',
        fontFamily: 'var(--font-heading)',
        fontSize: '1rem',
        fontWeight: 700,
        letterSpacing: '2px',
        color: isUnlocked ? 'black' : 'white',
        opacity: isUnlocked ? 1 : (1 - (dragWidth / 300) * 1.5), // Fade out as you drag
        textTransform: 'uppercase',
        zIndex: 10,
        transition: 'opacity 0.2s',
    };

    return (
        <div ref={containerRef} style={CONTAINER_STYLE}>
            
            {/* Background Text */}
            <div style={TEXT_STYLE}>
                {isUnlocked ? "ACCESS GRANTED" : text}
            </div>

            {/* Draggable Fill & Handle */}
            <div ref={sliderRef} style={FILL_STYLE}>
                <div 
                    style={HANDLE_STYLE}
                    onMouseDown={onMouseDown}
                    onTouchStart={onTouchStart}
                >
                    {/* Arrow Icon */}
                    {isUnlocked ? '✓' : '»'}
                </div>
            </div>

        </div>
    );
};

export default SwipeButton;