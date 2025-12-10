// components/Header.tsx
'use client';
import React, { useState } from 'react';
import useWindowWidth from '../hooks/useWindowWidth'; // Assuming the hook is in ../hooks/useWindowWidth

// --- Types ---
interface NavLink {
    name: string;
    href: string;
}

const navLinks: NavLink[] = [
    { name: 'EVENTS', href: '#events' },
    { name: 'ARTISTS', href: '#artists' },
    { name: 'ABOUT', href: '#about' },
    { name: 'GALLERY', 'href': '#gallery' },
];
// --- End Types ---

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isMobile } = useWindowWidth(); 

    // --- Styles ---

    // Base header styles (adjust padding for mobile)
    const headerStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        padding: isMobile ? '15px 20px' : '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        // background: 'rgba(0, 0, 0, 0.4)',
        // backdropFilter: 'blur(10px)',
        // WebkitBackdropFilter: 'blur(10px)',
        // height: '70px',
    };

    // Mobile link style
    const mobileLinkStyle: React.CSSProperties = {
        padding: '20px 20px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        textDecoration: 'none',
        color: 'white',
        fontSize: '1.2rem',
        display: 'block',
        transition: 'background 0.3s',
        cursor: 'pointer',
    };

    // --- Component JSX ---

    return (
        <header style={headerStyle}>
            
            {/* 1. Logo/Brand Name */}
            <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: '900', 
                letterSpacing: '1px',
                cursor: 'pointer',
                background: 'linear-gradient(90deg, #FF9FFC, #ff2929)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                flexShrink: 0
            }}>
                SCIVVAS
            </div>

            {/* 2. Desktop Navigation Links (Conditional Rendering) */}
            {!isMobile && (
                <nav 
                    style={{ 
                        display: 'flex', 
                        gap: '30px', 
                        marginRight: '20px' 
                    }}
                >
                    {navLinks.map((link) => (
                        <a 
                            key={link.name}
                            href={link.href}
                            style={{
                                color: 'white',
                                textDecoration: 'none',
                                border: '2px solid transparent',
                                fontSize: '1.3rem',
                                padding: '5px 10px', // Added padding to contain the shadow/glow
                                borderRadius: '5px',
                                // Set up initial transition for smooth effect
                                transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
                                // Initial state: transparent shadow
                                boxShadow: '0 0 0 transparent',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.opacity = '1';
                                e.currentTarget.style.color = 'gray';
                                // The Neon Pop Effect: Use multiple shadows for depth and glow
                                e.currentTarget.style.boxShadow = `
                                0 0 5px #FF9FFC,   /* Inner soft glow */
                                0 0 10px #ff2929,  /* Outer harsh glow */
                                inset 0 0 5px #FF9FFC
                                `;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.opacity = '0.8';
                                e.currentTarget.style.color = 'white';
                                // Reset shadow
                                e.currentTarget.style.boxShadow = '0 0 0 transparent';
                            }}
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>
            )}

            {/* 3. CTA Button - HIDDEN ON MOBILE */}
            {!isMobile && ( // <-- Only show button if NOT mobile
                <button 
                    style={{ 
                        padding: '10px 25px', 
                        fontSize: '0.9rem', 
                        borderRadius: '50px', 
                        border: 'none', 
                        background: 'linear-gradient(90deg, #FF9FFC, #ff2929)',
                        color: 'black',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(255, 41, 41, 0.4)',
                        transition: 'transform 0.2s',
                        flexShrink: 0
                    }}
                >
                    Contact
                </button>
            )}

            {/* 4. Hamburger Menu Icon (Conditional Rendering) */}
            {isMobile && (
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.8rem',
                        color: 'white',
                        cursor: 'pointer',
                        // Remove marginLeft if it was meant to provide spacing next to the CTA button
                        marginLeft: '0px', 
                        padding: '5px',
                        flexShrink: 0,
                        lineHeight: 1
                    }}
                >
                    {isMenuOpen ? '\u2715' : '\u2630'}
                </button>
            )}

            {/* 5. Mobile Menu Overlay */}
            <div style={{
                position: 'fixed',
                top: '70px', 
                left: 0,
                width: '100%',
                height: isMenuOpen ? 'calc(100dvh - 70px)' : '0', 
                overflow: 'hidden', 
                background: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'height 0.3s ease-in-out', 
                zIndex: 99
            }}>
                {navLinks.map((link) => (
                    <a 
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)} 
                        style={mobileLinkStyle}
                        onTouchStart={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                        onTouchEnd={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        {link.name}
                    </a>
                ))}
            </div>

        </header>
    );
};

export default Header;