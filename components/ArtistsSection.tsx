'use client';
import React, { useState, useEffect } from 'react';

// --- MOCK ARTIST DATA ---
const ARTISTS = [
    {
        id: 1,
        name: 'NEXUS',
        genre: 'Techno / Industrial',
        image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=800&auto=format&fit=crop',
        description: 'Pioneering the darker side of electronic soundscapes. Known for relentless basslines and immersive visual syncing.',
        socials: ['IG', 'SC', 'SP']
    },
    {
        id: 2,
        name: 'AURA',
        genre: 'Deep House / Melodic',
        image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop',
        description: 'Weaving ethereal melodies with driving rhythms. Aura creates atmospheres that feel like lucid dreams.',
        socials: ['IG', 'YT', 'SP']
    },
    {
        id: 3,
        name: 'KINETIC',
        genre: 'Drum & Bass',
        image: 'https://images.unsplash.com/photo-1563237023-b1e970526dcb?q=80&w=800&auto=format&fit=crop',
        description: 'High-energy precision beats. Kinetic brings a raw, physical energy to the stage that is impossible to ignore.',
        socials: ['IG', 'SC']
    },
    {
        id: 4,
        name: 'VOID WALKER',
        genre: 'Experimental / Ambient',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
        description: 'Exploring the spaces between sound. A sonic journey for the introspective mind.',
        socials: ['IG', 'BC', 'SP']
    }
];

// --- SSR-SAFE HOOK ---
const useWindowWidth = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return { isMobile };
};

const ArtistsSection: React.FC = () => {
    const { isMobile } = useWindowWidth();
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    // --- CONFIG ---
    const HEADER_OFFSET = 0; // Clearance for fixed header
    const PRIMARY_COLOR = '#FF9FFC';
    const ACCENT_COLOR = '#ff2929';

    // --- STYLES ---
    const SECTION_STYLE: React.CSSProperties = {
        padding: isMobile 
            ? `${80 + HEADER_OFFSET}px 16px 80px 16px` 
            : `${120 + HEADER_OFFSET}px 80px 150px 80px`,
        color: 'white',
        minHeight: '100vh',
    };

    const HEADER_TITLE_STYLE: React.CSSProperties = {
        fontFamily: 'var(--font-heading)',
        fontSize: isMobile ? '2.5rem' : '4.5rem',
        fontWeight: 900,
        textTransform: 'uppercase',
        marginBottom: '10px',
        textAlign: 'center',
        lineHeight: 0.9,
    };

    const HEADER_SUBTITLE_STYLE: React.CSSProperties = {
        textAlign: 'center',
        color: '#888',
        fontSize: isMobile ? '0.9rem' : '1.1rem',
        maxWidth: '600px',
        margin: '0 auto 60px auto',
        fontFamily: 'monospace',
    };

    // --- GRID ---
    const GRID_STYLE: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
    };

    // --- CARD ---
    const CARD_STYLE: React.CSSProperties = {
        position: 'relative',
        height: '450px',
        backgroundColor: '#0a0a0a',
        borderRadius: '12px',
        overflow: 'hidden',
        // cursor: 'pointer',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#1a1a1a',
        transition: 'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
    };

    const CARD_HOVER_STYLE = {
        transform: 'translateY(-10px)',
        boxShadow: `0 20px 40px rgba(0,0,0,0.8), 0 0 20px ${PRIMARY_COLOR}20`,
        borderColor: PRIMARY_COLOR,
    };

    // --- IMAGE LAYER ---
    const IMAGE_CONTAINER_STYLE: React.CSSProperties = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    };

    // --- TEXT OVERLAY ---
    const CONTENT_OVERLAY_STYLE: React.CSSProperties = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: '25px',
        background: 'linear-gradient(to top, #000 10%, rgba(0,0,0,0.8) 40%, transparent 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: '100%', // Full height to allow text to slide up
        transition: 'all 0.4s ease',
    };

    const ARTIST_NAME_STYLE: React.CSSProperties = {
        fontFamily: 'var(--font-heading)',
        fontSize: '2.5rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        margin: 0,
        lineHeight: 0.9,
        color: 'white',
        // Text Outline Effect
        WebkitTextStroke: isMobile ? 'none' : '1px rgba(255,255,255,0.2)',
        transition: 'color 0.3s ease, -webkit-text-stroke 0.3s ease',
    };

    const GENRE_TAG_STYLE: React.CSSProperties = {
        color: ACCENT_COLOR,
        fontSize: '0.8rem',
        fontWeight: 'bold',
        letterSpacing: '2px',
        marginBottom: '10px',
        textTransform: 'uppercase',
    };

    const DESCRIPTION_STYLE: React.CSSProperties = {
        color: '#ccc',
        fontSize: '0.9rem',
        lineHeight: 1.5,
        marginTop: '15px',
        marginBottom: '20px',
        maxHeight: '0px', // Hidden by default on desktop
        opacity: 0,
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        // On mobile, we might want to show a snippet, but let's keep it clean for now
    };

    // --- PLAY BUTTON (Visual Only) ---
    const PLAY_BTN_STYLE: React.CSSProperties = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        border: `1px solid ${PRIMARY_COLOR}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: PRIMARY_COLOR,
        fontSize: '1.2rem',
        position: 'absolute',
        top: '20px',
        right: '20px',
        backdropFilter: 'blur(5px)',
        transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.3s',
        zIndex: 10,
    };

    return (
        <section style={SECTION_STYLE}>
            {/* Header Area */}
            <div>
                <h1 style={HEADER_TITLE_STYLE}>
                    Sonic <span style={{ color: PRIMARY_COLOR }}>Architects</span>
                </h1>
                <p style={HEADER_SUBTITLE_STYLE}>
                    The visionaries shaping the soundscape of our events.
                </p>
            </div>

            {/* Artist Grid */}
            <div style={GRID_STYLE}>
                {ARTISTS.map(artist => {
                    const isHovered = hoveredId === artist.id;
                    const finalCardStyle = isHovered ? { ...CARD_STYLE, ...CARD_HOVER_STYLE } : CARD_STYLE;

                    return (
                        <div 
                            key={artist.id}
                            style={finalCardStyle}
                            onMouseEnter={() => setHoveredId(artist.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* 1. Artist Image (B&W to Color) */}
                            <div style={{
                                ...IMAGE_CONTAINER_STYLE,
                                backgroundImage: `url(${artist.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)', // Effect: B&W -> Color
                                transition: 'filter 0.5s ease, transform 0.5s ease',
                                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                            }} />

                            {/* 2. Floating Play Button */}
                            <div style={{
                                ...PLAY_BTN_STYLE,
                                transform: isHovered ? 'scale(1.1) rotate(90deg)' : 'scale(1)',
                                backgroundColor: isHovered ? PRIMARY_COLOR : 'rgba(255,255,255,0.1)',
                                color: isHovered ? 'black' : PRIMARY_COLOR,
                            }}>
                                ▶
                            </div>

                            {/* 3. Text Content */}
                            <div style={{
                                ...CONTENT_OVERLAY_STYLE,
                                transform: isHovered ? 'translateY(0)' : 'translateY(15px)', // Subtle slide up
                            }}>
                                <div style={GENRE_TAG_STYLE}>{artist.genre}</div>
                                
                                <h2 style={{
                                    ...ARTIST_NAME_STYLE,
                                    color: isHovered ? 'white' : 'transparent', // Filled on hover
                                    WebkitTextStroke: isHovered ? '0px' : '1px rgba(255,255,255,0.5)',
                                }}>
                                    {artist.name}
                                </h2>

                                {/* Description (Reveals on Hover) */}
                                <div style={{
                                    ...DESCRIPTION_STYLE,
                                    maxHeight: isHovered || isMobile ? '200px' : '0px', // Always show on mobile, hover on desktop
                                    opacity: isHovered || isMobile ? 1 : 0,
                                    marginTop: isHovered || isMobile ? '15px' : '0px',
                                }}>
                                    {artist.description}
                                    
                                    {/* Socials Row */}
                                    <div style={{ marginTop: '15px', display: 'flex', gap: '15px' }}>
                                        {artist.socials.map(social => (
                                            <span key={social} style={{ 
                                                fontSize: '0.8rem', 
                                                border: '1px solid #333', 
                                                padding: '2px 8px', 
                                                borderRadius: '4px',
                                                color: '#aaa',
                                                cursor: 'pointer'
                                            }}>
                                                {social}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ArtistsSection;