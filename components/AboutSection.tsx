// components/AboutSection.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import useWindowWidth from '../hooks/useWindowWidth';

// --- CONFIGURATION ---
const AUTO_SLIDE_INTERVAL_MS = 5000;
const STICKY_HEADER_OFFSET = 90; // Space for the fixed header

const CARD_DATA = [
  { 
    id: 0, 
    subtitle: 'THE VISION', 
    title: 'Igniting the Night', 
    color: '#FF9FFC', 
    img: 'url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop")',
    text: <>At Scivvas Entertainment, events become environments.<br/><br/>We craft immersive atmospheres where every detail, every beam of light, and every shifting wavelength of sound is curated to perfection.</>
  },
  { 
    id: 1, 
    subtitle: 'THE TEAM', 
    title: 'The Architects', 
    color: '#ff2929', 
    img: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop")',
    text: <>We are a curated team of acoustic designers, visual craftsmen, and precision logistics experts delivering flawless experiences.<br/><br/>Our expertise ensures that each moment is orchestrated with intention, refinement, and unforgettable impact.</>
  },
];

const AboutSection: React.FC = () => {
  // The hook now safely handles SSR, so we can trust isMobile directly
  const { isMobile } = useWindowWidth(); 
  
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const activeSubtitle = CARD_DATA[activeIndex].subtitle;
  const activeColor = CARD_DATA[activeIndex].color;

  // Auto slide logic
  useEffect(() => {
    const id = setInterval(
      () => setActiveIndex(prev => (prev + 1) % CARD_DATA.length),
      AUTO_SLIDE_INTERVAL_MS
    );
    return () => clearInterval(id);
  }, []);

  // --- Responsive viewport tracking (client only) ---
  const [vw, setVw] = useState<number>(0);
  const [vh, setVh] = useState<number>(0);

  useEffect(() => {
    // Initialize only on client
    const setSizes = () => {
      setVw(typeof window !== 'undefined' ? window.innerWidth : 0);
      setVh(typeof window !== 'undefined' ? window.innerHeight : 0);
    };

    setSizes();
    window.addEventListener('resize', setSizes);
    window.addEventListener('orientationchange', setSizes);

    return () => {
      window.removeEventListener('resize', setSizes);
      window.removeEventListener('orientationchange', setSizes);
    };
  }, []);

  // --- Dynamic sizing logic ---
  // Safe defaults in case vw/vh are not yet measured on first render
  const safeVw = vw || 375; // assume a small mobile width initially
  const safeVh = vh || 667; // assume a small mobile height initially

  // Card height: on mobile, use viewport height minus sticky header and small padding,
  // but clamp between 360 and 900 so it's never too short or huge.
  const mobileCardHeight = Math.max(
    360,
    Math.min(
      Math.round(safeVh - STICKY_HEADER_OFFSET - 120),
      900
    )
  );

  // Desktop card height: keep existing 480 but still allow slight scaling with vh
  const desktopCardHeight = Math.max(420, Math.min(620, Math.round(Math.max(480, safeVh * 0.45))));

  const cardHeight = isMobile ? mobileCardHeight : desktopCardHeight;

  // Image height: on mobile it's a portion of the card; on desktop it fills container
  const imageHeight = isMobile ? Math.round(cardHeight * 0.42) + 'px' : '100%';

  // Font sizes computed from viewport width but clamped to reasonable ranges
  const H3_FONT = isMobile
    ? `${Math.max(18, Math.min(26, Math.round(safeVw * 0.055)))}px`
    : '2rem';

  const P_FONT = isMobile
    ? `${Math.max(13, Math.min(16, Math.round(safeVw * 0.038)))}px`
    : '1.05rem';

  // --- STYLES ---

  const ROOT_STYLE: React.CSSProperties = {
    position: 'relative',
    height: 'auto',
    overflow: 'hidden',
    color: 'white',
    width: '100%',
  };

  const STICKY_SCENE_STYLE: React.CSSProperties = {
    position: 'relative',
    top: `${STICKY_HEADER_OFFSET}px`,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '18px 12px' : '90px 40px',
    boxSizing: 'border-box',
    overflow: 'hidden'
  };

  const TITLE_WRAPPER: React.CSSProperties = {
    position: 'absolute',
    top: isMobile ? '-10px' : '0',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2000,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    textAlign: 'center'
  };

  const TITLE_STYLE: React.CSSProperties = {
    fontFamily: 'var(--font-heading)',
    fontSize: isMobile ? '1.8rem' : 'clamp(2.2rem, 4.5vw, 3.6rem)',
    fontWeight: 700,
    textTransform: 'uppercase'
  };

  const SUBTITLE_STYLE_BASE: React.CSSProperties = {
    ...TITLE_STYLE,
    color: 'transparent',
    WebkitTextStroke: `1px ${activeColor}`,
    marginLeft: '12px'
  };

  const STACK_WRAPPER_STYLE: React.CSSProperties = {
    position: 'relative',
    width: isMobile ? '100%' : '90vw',
    maxWidth: '1500px',
    height: `${cardHeight}px`, // <-- dynamic card height used here
    marginTop: isMobile ? '50px' : '0',
    overflow: 'hidden'
  };

  const CARD_BASE: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    borderRadius: '18px',
    backgroundColor: '#111',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    transition: 'opacity 600ms ease, transform 600ms ease',
    overflow: 'hidden',
  };

  const IMAGE_STYLE_COMMON: React.CSSProperties = {
    width: isMobile ? '100%' : '50%',
    height: imageHeight, // dynamic
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    flexShrink: 0,
  };

  const TEXT_STYLE: React.CSSProperties = {
    // flex: 1,
    padding: isMobile ? vh > 750 ? '50px 30px':  '6px 12px' : '56px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  return (
    <section style={ROOT_STYLE}>
      <div style={STICKY_SCENE_STYLE}>
        
        {/* Title Area */}
        <div style={TITLE_WRAPPER}>
          <span style={TITLE_STYLE}>ABOUT</span>
          <span style={SUBTITLE_STYLE_BASE}>{activeSubtitle}</span>
        </div>

        {/* Card Stack */}
        <div ref={carouselRef} style={STACK_WRAPPER_STYLE}>
          
          {/* Spacer to make the parent container have the right height on mobile */}
          {isMobile && (
            <div style={{ visibility: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
               <div style={{ ...IMAGE_STYLE_COMMON }} />
               <div style={{ ...TEXT_STYLE }}>
                  <h3 style={{ fontSize: H3_FONT, margin: '0 0 0.5rem 0' }}>Spacer</h3>
                  <p style={{ fontSize: P_FONT }}>{CARD_DATA[0].text}</p>
               </div>
            </div>
          )}

          {CARD_DATA.map((card, idx) => {
            const isActive = idx === activeIndex;
            
            // Desktop Flex Ordering (Alternating)
            const desktopOrderImg = card.id % 2 === 1 ? 2 : 1;
            const desktopOrderTxt = card.id % 2 === 1 ? 1 : 2;

            const visibleStyle = isActive
              ? { opacity: 1, transform: 'scale(1)', zIndex: 100 }
              : { opacity: 0, transform: 'scale(0.95)', zIndex: 10 };

            return (
              <article key={card.id} style={{ ...CARD_BASE, ...visibleStyle }}>
                
                {/* IMAGE */}
                <div
                  style={{
                    ...IMAGE_STYLE_COMMON,
                    backgroundImage: card.img,
                    order: isMobile ? 0 : desktopOrderImg 
                  }}
                />

                {/* TEXT */}
                <div style={{ ...TEXT_STYLE, order: isMobile ? 1 : desktopOrderTxt }}>
                  <h3 style={{ 
                      fontFamily: 'var(--font-heading)', 
                      fontSize: H3_FONT, 
                      color: card.color, 
                      margin: '0 0 0.5rem 0' 
                  }}>
                    {card.title}
                  </h3>
                  <div style={{ 
                      color: '#ccc', 
                      fontSize: P_FONT, 
                      lineHeight: '1.5' 
                  }}>
                    {card.text}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
