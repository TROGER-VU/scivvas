'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link for navigation

// --- MOCK EVENT ALBUMS ---
// These represent the "Folders" or "Albums" of your gallery.
const GALLERY_EVENTS = [
    { 
        id: 'dandiya', // This will be the URL slug
        title: 'DANDIYA GLOW FEST 2025', 
        date: 'SEP 2025',
        category: 'FESTIVAL',
        cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop', 
        span: 'col-span-2 row-span-2' // Large Feature
    }, 
    // { 
    //     id: 'zenith-launch', 
    //     title: 'ZENITH LAUNCH', 
    //     date: 'OCT 2025',
    //     category: 'PARTY',
    //     cover: 'https://images.unsplash.com/photo-1598440947619-2c3498b0be30?q=80&w=1000&auto=format&fit=crop', 
    //     span: '' 
    // },
    // { 
    //     id: 'project-chronos', 
    //     title: 'PROJECT CHRONOS', 
    //     date: 'AUG 2025',
    //     category: 'RAVE',
    //     cover: 'https://images.unsplash.com/photo-1506148560824-2c4f1c1103c2?q=80&w=1000&auto=format&fit=crop', 
    //     span: 'col-span-1 row-span-2' // Tall Feature
    // },
    // { 
    //     id: 'wavelength', 
    //     title: 'WAVELENGTH', 
    //     date: 'JUN 2025',
    //     category: 'AUDIO-VISUAL',
    //     cover: 'https://images.unsplash.com/photo-1517457210988-782803b906a4?q=80&w=1000&auto=format&fit=crop', 
    //     span: '' 
    // },
    // { 
    //     id: 'the-hive', 
    //     title: 'THE HIVE', 
    //     date: 'APR 2025',
    //     category: 'CLUB',
    //     cover: 'https://images.unsplash.com/photo-1511585863261-0a618d72f10d?q=80&w=1000&auto=format&fit=crop', 
    //     span: 'col-span-2' // Wide Feature
    // },
    // { 
    //     id: 'backstage-pass', 
    //     title: 'BTS: ORIGINS', 
    //     date: '2024',
    //     category: 'DOCUMENTARY',
    //     cover: 'https://images.unsplash.com/photo-1571266028243-e4733b090bb1?q=80&w=1000&auto=format&fit=crop', 
    //     span: '' 
    // },
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

const GallerySection: React.FC = () => {
    const { isMobile } = useWindowWidth();
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // --- STYLES ---
    const HEADER_OFFSET = 40;
    const PRIMARY_COLOR = '#FF9FFC';
    const SECONDARY_COLOR = '#ff2929';

    const SECTION_STYLE: React.CSSProperties = {
        padding: isMobile 
            ? `${80 + HEADER_OFFSET}px 16px 80px 16px` 
            : `${50 + HEADER_OFFSET}px 80px 150px 80px`,
        color: 'white',
        minHeight: '100vh',
    };

    const HEADER_TITLE_STYLE: React.CSSProperties = {
        fontFamily: 'var(--font-heading)',
        fontSize: isMobile ? '2.5rem' : '4rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        marginBottom: '20px',
        textAlign: 'center'
    };

    // --- GRID LAYOUT ---
    const GRID_STYLE: React.CSSProperties = {
        display: 'grid',
        // Desktop: 4 columns. Mobile: 1 column.
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
        gridAutoRows: '280px', 
        gap: '24px',
        gridAutoFlow: 'dense',
    };

    // --- CARD STYLES ---
    const getCardStyle = (span: string, id: string): React.CSSProperties => {
        const isHovered = hoveredId === id;
        
        // Reset span on mobile to ensure single column flow
        const gridColumn = (!isMobile && span.includes('col-span-2')) ? 'span 2' : 'span 1';
        const gridRow = (!isMobile && span.includes('row-span-2')) ? 'span 2' : 'span 1';

        return {
            position: 'relative',
            gridColumn,
            gridRow,
            borderRadius: '16px',
            overflow: 'hidden',
            cursor: 'pointer',
            border: `1px solid ${isHovered ? PRIMARY_COLOR : 'rgba(255,255,255,0.1)'}`,
            transition: 'border-color 0.4s ease, transform 0.4s ease',
            transform: isHovered && !isMobile ? 'translateY(-5px)' : 'none',
            boxShadow: isHovered ? `0 10px 40px rgba(0,0,0,0.5)` : 'none'
        };
    };

    const BACKGROUND_IMAGE_STYLE = (src: string, id: string): React.CSSProperties => ({
        width: '100%',
        height: '100%',
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'transform 0.6s cubic-bezier(0.25, 0.45, 0.45, 0.95)',
        transform: hoveredId === id ? 'scale(1.08)' : 'scale(1)',
        filter: hoveredId === id ? 'brightness(1.1)' : 'brightness(0.9)',
    });

    const OVERLAY_STYLE: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '30px',
        transition: 'opacity 0.3s ease',
    };

    return (
        <section style={SECTION_STYLE}>
            <h1 style={HEADER_TITLE_STYLE}>
                Visual <span style={{ color: SECONDARY_COLOR }}>Archives</span>
            </h1>

            <div style={GRID_STYLE}>
                {GALLERY_EVENTS.map(event => (
                    <Link 
                        key={event.id} 
                        href={`/gallery/${event.id}`} // LINKS TO: app/gallery/[slug]/page.tsx
                        style={{ display: 'contents' }} // Ensure Link doesn't break grid layout
                    >
                        <div
                            style={getCardStyle(event.span, event.id)}
                            onMouseEnter={() => setHoveredId(event.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Background Image Layer */}
                            <div style={BACKGROUND_IMAGE_STYLE(event.cover, event.id)} />

                            {/* Content Overlay */}
                            <div style={OVERLAY_STYLE}>
                                {/* Category Tag */}
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    marginBottom: '10px' 
                                }}>
                                    <span style={{ 
                                        color: SECONDARY_COLOR, 
                                        fontSize: '0.75rem', 
                                        fontWeight: 'bold', 
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {event.category}
                                    </span>
                                    <span style={{ color: '#aaa', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                        {event.date}
                                    </span>
                                </div>

                                {/* Title */}
                                <h2 style={{ 
                                    fontFamily: 'var(--font-heading)', 
                                    fontSize: '1.8rem', 
                                    color: 'white', 
                                    margin: 0,
                                    lineHeight: 1,
                                    textTransform: 'uppercase'
                                }}>
                                    {event.title}
                                </h2>

                                {/* "View Gallery" Indicator (Visible on Hover/Mobile) */}
                                <div style={{
                                    marginTop: '15px',
                                    height: hoveredId === event.id || isMobile ? '20px' : '0px',
                                    opacity: hoveredId === event.id || isMobile ? 1 : 0,
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: PRIMARY_COLOR }}>
                                        EXPLORE DOME
                                    </span>
                                    <span style={{ fontSize: '1rem', color: PRIMARY_COLOR }}>→</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default GallerySection;