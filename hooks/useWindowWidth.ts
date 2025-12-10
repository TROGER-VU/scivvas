// hooks/useWindowWidth.ts

import { useState, useEffect } from 'react';

// Define the breakpoint for switching between desktop and mobile view
const MOBILE_BREAKPOINT = 768; 

/**
 * Custom hook to get the current window width and a boolean
 * indicating if the screen is considered "mobile" (width < MOBILE_BREAKPOINT).
 */
const useWindowWidth = () => {
    const [width, setWidth] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Function to update state
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            setWidth(currentWidth);
            setIsMobile(currentWidth < MOBILE_BREAKPOINT);
        };

        // Initial setup
        handleResize(); 

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup function to remove event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty dependency array ensures this runs only once

    return { width, isMobile };
};

export default useWindowWidth;