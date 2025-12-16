// components/Header.tsx
'use client';
import React, { useEffect, useState } from 'react';
import useWindowWidth from '../hooks/useWindowWidth'; // Assuming the hook is in ../hooks/useWindowWidth
import Link from 'next/link';

// --- Types ---
interface NavLink {
    name: string;
    href: string;
}

const navLinks: NavLink[] = [
    { name: 'EVENTS', href: '/events' },
    // { name: 'ARTISTS', href: '/artists' },
    { name: 'ABOUT', href: '/about' },
    { name: 'GALLERY', href: '/gallery' },
];
// --- End Types ---

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isMobile } = useWindowWidth(); 
    const [showContact, setShowContact] = useState(false);

    const CONTACT_CARD_STYLE: React.CSSProperties = {
    position: 'absolute',
    top: '120%',
    right: 0,
    width: '260px',
    background: '#0b0b0b',
    borderRadius: '14px',
    padding: '16px',
    boxShadow: `
        0 0 20px rgba(255, 41, 41, 0.35),
        0 0 40px rgba(255, 159, 252, 0.2)
    `,
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'white',
    transform: showContact ? 'scale(1)' : 'scale(0.95)',
    opacity: showContact ? 1 : 0,
    transition: 'all 0.2s ease',
    zIndex: 999,
    };

    const CONTACT_TITLE: React.CSSProperties = {
    fontWeight: 800,
    letterSpacing: '1px',
    marginBottom: '10px',
    color: '#ff2929',
    textTransform: 'uppercase',
    };

    const CONTACT_ITEM: React.CSSProperties = {
    fontSize: '0.9rem',
    marginBottom: '6px',
    };

    const CONTACT_MAIL: React.CSSProperties = {
    fontSize: '0.9rem',
    marginTop: '10px',
    display: 'block',
    color: '#FF9FFC',
    textDecoration: 'none',
    };

    const mobileCTAStyle: React.CSSProperties = {
    marginTop: 'auto',
    marginBottom: '2rem',
    padding: '14px 28px',
    fontSize: '1rem',
    borderRadius: '999px',
    border: 'none',
    background: 'linear-gradient(90deg, #FF9FFC, #ff2929)',
    color: '#000',
    fontWeight: 800,
    letterSpacing: '1px',
    // cursor: 'pointer',
    boxShadow: '0 6px 25px rgba(255, 41, 41, 0.45)',
    width: '85%',
    alignSelf: 'center',
    };


    useEffect(() => {
    const close = () => setShowContact(false);
    if (showContact) document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
    }, [showContact]);


    // const [isMounted, setIsMounted] = useState(false);

    // useEffect(() => {
    //     setIsMounted(true);
    // }, []);

    // const showDesktopNav = isMounted ? !isMobile : true;

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
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        borderRadius: '120px',
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
        // cursor: 'pointer',
    };

    const [showMobileContact, setShowMobileContact] = useState(false);

    const mobileContactCardStyle: React.CSSProperties = {
    width: '90%',
    margin: '0 auto 1.2rem',
    padding: '16px',
    borderRadius: '16px',
    background: '#0b0b0b',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: `
        0 0 25px rgba(255, 41, 41, 0.35),
        0 0 45px rgba(255, 159, 252, 0.25)
    `,
    color: '#fff',
    };


    const mobileContactTitle: React.CSSProperties = {
    fontWeight: 900,
    marginBottom: '10px',
    letterSpacing: '1px',
    color: '#ff2929',
    textTransform: 'uppercase',
    textAlign: 'center',
    };

    const mobileContactItem: React.CSSProperties = {
    display: 'block',
    padding: '8px 0',
    fontSize: '0.95rem',
    textAlign: 'center',
    color: '#fff',
    textDecoration: 'none',
    };

    const mobileContactMail: React.CSSProperties = {
    ...mobileContactItem,
    color: '#FF9FFC',
    };



    // --- Component JSX ---

    return (
        <header style={headerStyle}>
            
            {/* 1. Logo / Brand Name */}
            <Link href="/" style={{ textDecoration: 'none' }}>
            <div
                style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1px',
                // cursor: 'pointer',
                flexShrink: 0
                }}
            >
                {/* Logo */}
                <img
                src="/logo.png"     // put logo in /public/logo.png
                alt="Logo"
                style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'contain'
                }}
                />

                {/* Brand Text */}
                <div
                style={{
                    fontSize: '1.5rem',
                    fontWeight: '900',
                    letterSpacing: '1px',
                    background: 'linear-gradient(90deg, #FF9FFC, #ff2929)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}
                >
                SCIVVAS
                </div>
            </div>
            </Link>


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
                            <Link 
                                key={link.name}
                                href={link.href}
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                    // border: '2px solid transparent',
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
                            </Link>
                        ))}
                    </nav>
                )}

                {/* CTA Button - Desktop Only */}
                {!isMobile && (
                <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                    
                    <button
                    onClick={() => setShowContact(prev => !prev)}
                    style={{
                        padding: '10px 25px',
                        fontSize: '0.9rem',
                        borderRadius: '50px',
                        border: 'none',
                        background: 'linear-gradient(90deg, #FF9FFC, #ff2929)',
                        color: 'black',
                        fontWeight: 'bold',
                        // cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(255, 41, 41, 0.4)',
                        transition: 'transform 0.2s',
                        flexShrink: 0
                    }}
                    >
                    Contact
                    </button>

                    {/* Contact Popover */}
                    {showContact && (
                    <div style={CONTACT_CARD_STYLE}>
                        <div style={CONTACT_TITLE}>Contact</div>

                        <div style={CONTACT_ITEM}>📞 +91 63933 07577</div>
                        <div style={CONTACT_ITEM}>📞 +91 83183 21065</div>

                        <a
                        href="mailto:management@scivvas.com"
                        style={CONTACT_MAIL}
                        >
                        ✉️ management@scivvas.com
                        </a>
                    </div>
                    )}
                </div>
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
                            // cursor: 'pointer',
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

                {/* Mobile Menu Overlay */}
                <div
                style={{
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
                    zIndex: 99,

                    display: 'flex',
                    flexDirection: 'column',
                    // paddingTop: '2rem',
                }}
                >
                {navLinks.map((link) => (
                    <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    style={mobileLinkStyle}
                    >
                    {link.name}
                    </Link>
                ))}

                {/* Contact Card (Mobile) */}
                {showMobileContact && (
                    <div style={mobileContactCardStyle}>
                    <div style={mobileContactTitle}>Contact</div>

                    <a href="tel:+916393307577" style={mobileContactItem}>
                        📞 +91 63933 07577
                    </a>

                    <a href="tel:+918318321065" style={mobileContactItem}>
                        📞 +91 83183 21065
                    </a>

                    <a
                        href="mailto:management@scivvas.com"
                        style={mobileContactMail}
                    >
                        ✉️ management@scivvas.com
                    </a>
                    </div>
                )}

                {/* Mobile CTA Button */}
                <button
                    style={mobileCTAStyle}
                    onClick={() => setShowMobileContact((prev) => !prev)}
                >
                    {showMobileContact ? 'Close Contact' : 'Contact Us'}
                </button>
                </div>


        </header>
    );
};

export default Header;