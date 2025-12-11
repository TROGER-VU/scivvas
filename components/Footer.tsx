// components/Footer.tsx
'use client';
import React from 'react';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa6'; 
import useWindowWidth from '../hooks/useWindowWidth'; // Assuming the hook is in ../hooks/useWindowWidth

// --- Types and socialLinks array remain the same ---

interface SocialLink {
    name: string;
    IconComponent: React.ElementType;
    href: string;
}

const socialLinks: SocialLink[] = [
    { name: 'Instagram', IconComponent: FaInstagram, href: 'https://www.instagram.com/scivvas_entertainment/' },
    { name: 'Facebook', IconComponent: FaFacebook, href: 'https://www.instagram.com/scivvas_entertainment/' },
    { name: 'YouTube', IconComponent: FaYoutube, href: 'https://www.instagram.com/scivvas_entertainment/' },
];

// --- End Types and socialLinks array ---

const Footer: React.FC = () => {
    const { isMobile } = useWindowWidth(); // <-- Get the mobile state

    // Define shared styles for the social icons wrapper
    const iconBaseStyle: React.CSSProperties = {
        fontSize: '2rem',
        margin: isMobile ? '0 12px' : '0 15px', // Slightly less margin on mobile
        color: 'white',
        textDecoration: 'none',
        transition: 'transform 0.2s ease, color 0.2s ease, filter 0.2s ease',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    };

    return (
        <footer style={{
            width: '100%',
            pointerEvents: 'auto',
            backgroundColor: 'transparent', 
            color: 'rgba(255, 255, 255, 0.7)', 
            padding: isMobile ? '30px 20px' : '30px 40px', // Less horizontal padding on mobile
            // marginTop: '100px', 
            // --- CRITICAL FLEX STYLES FOR MOBILE ---
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row', // Stack vertically on mobile
            justifyContent: isMobile ? 'center' : 'space-between', // Center everything when stacked
            alignItems: isMobile ? 'center' : 'center', 
            // --- END CRITICAL STYLES ---
            minHeight: '70px',
            fontFamily: 'var(--font-body)', 
        }}>

            {/* 1. Placeholder / Left-Side Content (Hidden on Mobile) */}
            {!isMobile && (
                <div style={{ flex: 1, textAlign: 'left', minWidth: '100px' }}>
                    {/* Placeholder content only visible on desktop */}
                </div>
            )}
            
            {/* 2. Center Section: Social Media Icons */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                // We don't need flex: 1 on mobile, but keep it on desktop
                flex: isMobile ? 'none' : 1, 
                width: isMobile ? '100%' : 'auto', // Takes full width to center icons on mobile
                padding: isMobile ? '10px 0' : '0', // Vertical padding on mobile
                order: isMobile ? 1 : 2, // Order 1 on mobile to appear above copyright
            }}>
                {socialLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={iconBaseStyle}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.color = 'black';
                            e.currentTarget.style.filter = 'drop-shadow(0 0 5px rgba(255, 159, 252, 0.7))';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.filter = 'none';
                        }}
                    >
                        <link.IconComponent />
                    </a>
                ))}
            </div>

            {/* 3. Right Corner Section: Copyright */}
            <div style={{ 
                flex: isMobile ? 'none' : 1, // Don't take up full flex space on mobile
                textAlign: isMobile ? 'center' : 'right', // Center text on mobile
                fontSize: '0.9rem',
                minWidth: '100px',
                marginTop: isMobile ? '15px' : '0', // Add space above copyright on mobile
                order: isMobile ? 2 : 3, // Order 2 on mobile to appear below icons
            }}>
                &copy; {new Date().getFullYear()} Scivvas Entertainment Pvt. Ltd.
            </div>
        </footer>
    );
};

export default Footer;