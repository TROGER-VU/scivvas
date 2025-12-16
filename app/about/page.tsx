// app/about/page.tsx

'use client';

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import WebsiteLoader from '@/components/WebsiteLoader';
import DotGrid from '@/components/DotGrid';
import PixelTransition from '@/components/PixelTransition';

export default function AboutPage() {
    const PIXEL_CARDS = [
        {
            id: 1,
            img: './team/arpan.png',
            name: 'Arpan Shukla',
            text: <>Director</>
        },
        {
            id: 2,
            img: './logomain.png',
            name: 'Nidhish Gupta',
            text: <>Director</>
        },
        {
            id: 3,
            img: './team/aryan_singh.jpeg',
            name: 'Aryan Singh',
            text: <>Director</>
        },
        {
            id: 4,
            img: './team/satvik.jpeg',
            name: 'Satvik Singh Chauhan',
            text: <>Director</>
        },
        {
            id: 5,
            img: './team/ankan.jpeg',
            name: 'Ankan Verma',
            text: <>Director</>
        },
        {
            id: 6,
            img: './team/aryan_gupta.jpeg',
            name: 'Aryan Gupta',
            text: <>Director</>
        },
        {
            id: 7,
            img: './team/ayush_verma.jpeg',
            name: 'Ayush Verma',
            text: <>Director</>
        }
    ];

    const SECTION_STYLE: React.CSSProperties = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 1.5rem 8rem', // Increased padding for separation
        alignContent: 'center',
        color: 'white', // Ensure heading is white
        textAlign: 'center'
    };
    
    const HEADING_STYLE: React.CSSProperties = {
        fontFamily: 'var(--font-heading)', // Use your heading font
        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
        fontWeight: 900,
        textTransform: 'uppercase',
        marginBottom: '1rem',
        color: '#ff2929', // Neon Pink accent for the heading
        letterSpacing: '5px'
    };

    const GRID_STYLE: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2rem',
        justifyItems: 'center'
    };

    // Style for the text content that appears on hover
    const HOVER_TEXT_STYLE: React.CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        backgroundColor: '#111',
        padding: '20px',
        boxSizing: 'border-box'
    };

    const CARD_CONTENT_STYLE: React.CSSProperties = {
        fontWeight: 900,
        textAlign: 'center',
        color: '#fff',
        lineHeight: 1.1,
    };

    const CARD_NAME_STYLE: React.CSSProperties = {
        fontFamily: 'var(--font-heading)', // Use the main heading font for the Name
        fontSize: '2rem',
        textTransform: 'uppercase',
        marginBottom: '0.5rem',
        display: 'block'
    };

    const CARD_TEXT_STYLE: React.CSSProperties = {
        fontFamily: 'monospace', // Use a monospaced font for the Role/Text
        fontSize: '1.5rem',
        textTransform: 'uppercase',
        color: '#ff2929', // Use neon accent color for the role
        letterSpacing: '2px',
        display: 'block'
    };

    // const CARD_GLOW_WRAPPER: React.CSSProperties = {
    //     position: 'relative',
    //     borderRadius: '18px',
    // };

    // const CARD_GLOW_BG: React.CSSProperties = {
    //     position: 'absolute',
    //     inset: '-18px',
    //     background:
    //         'radial-gradient(circle at center, rgba(255,41,41,0.35), transparent 65%)',
    //     filter: 'blur(30px)',
    //     zIndex: 0,
    //     pointerEvents: 'none'
    // };


    
    return (
        // 1. Root Container: 
        // - Allow height to grow based on content (`minHeight: '100vh'`).
        // - **REMOVE `height: '100dvh'` and `overflow: 'hidden'`** from the root to enable scrolling.
        // - Apply the scrollbar hiding styles here.
        <div style={{ 
            width: '100dvw', 
            position: 'relative', 
            minHeight: '100dvh', 
            backgroundColor: '#000',
            // overflow: 'hidden'
        }}>
            <WebsiteLoader/>
            
            <Header/>
            
            {/* 2. Background Layer: Use 'fixed' so it stays put when the page scrolls. */}
            <div style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                zIndex: 0, 
                // overflow: 'hidden', 
            }}>
                <DotGrid
                    dotSize={5}
                    gap={24}
                    baseColor="#271e37"
                    activeColor="#FF9FFC"
                    proximity={120}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1.5}
                    style={{}}
                />
            </div>

            {/* 3. Content Layer: Sits above the background */}
            <main style={{ 
                position: 'relative', 
                zIndex: 10, 
                // Restore top padding to clear the fixed header (80px tall)
                // paddingTop: '80px', 
            }}>
                
                <AboutSection /> 
                <section
                    style={SECTION_STYLE}
                    >
                        <h2 style={HEADING_STYLE}>OUR TEAM</h2>
                    <div
                        style={GRID_STYLE}
                    >
                        {PIXEL_CARDS.map(card => (
                        <PixelTransition
                            key={card.id}
                            gridSize={12}
                            pixelColor="#ffffff"
                            animationStepDuration={0.4}
                            aspectRatio="120%"
                            once={false}
                            firstContent={
                            <div style={{ width: '100%', height: '100%' }}>
                                <img
                                    src={card.img}
                                    alt={`Profile of ${card.name}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            }
                            secondContent={
                            <div style={HOVER_TEXT_STYLE}>
                                <p style={CARD_CONTENT_STYLE}>
                                    {/* 2. Apply font style to Name */}
                                    <span style={CARD_NAME_STYLE}>
                                        {card.name} 
                                    </span>
                                    
                                    {/* 3. Apply font style to Text (Role) */}
                                    <span style={CARD_TEXT_STYLE}>
                                        {card.text}
                                    </span>
                                </p>
                            </div>
                            }
                        />
                        ))}
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}