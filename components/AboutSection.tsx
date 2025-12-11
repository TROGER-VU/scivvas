// components/AboutSection.tsx - mobile font/padding fixes so image is visible on tiny screens
'use client';
import React, { useEffect, useRef, useState } from 'react';

// --- CONFIGURATION ---
const AUTO_SLIDE_INTERVAL_MS = 5000;
const CARD_DATA = [
  { id: 0, subtitle: 'THE VISION', title: 'Igniting the Night', color: '#FF9FFC', img: 'url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop")' },
  { id: 1, subtitle: 'THE TEAM', title: 'The Architects', color: '#ff2929', img: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop")' },
];
const STICKY_HEADER_OFFSET = 50;

// simple hook
const useWindowWidth = () => {
  const isClient = typeof window !== 'undefined';
  const [isMobile, setIsMobile] = useState(isClient ? window.innerWidth < 768 : false);

  useEffect(() => {
    if (!isClient) return;
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isClient]);

  return { isMobile };
};

const AboutSection: React.FC = () => {
  const { isMobile } = useWindowWidth();
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const activeSubtitle = CARD_DATA[activeIndex].subtitle;
  const activeColor = CARD_DATA[activeIndex].color;

  // Auto slide
  useEffect(() => {
    const id = setInterval(
      () => setActiveIndex(prev => (prev + 1) % CARD_DATA.length),
      AUTO_SLIDE_INTERVAL_MS
    );
    return () => clearInterval(id);
  }, []);

  // --- Styles ---
  const ROOT_STYLE: React.CSSProperties = {
    position: 'relative',
    height: `calc(80vh - ${STICKY_HEADER_OFFSET}px + 100px)`,
    overflow: 'hidden',
    color: 'white'
  };

  const STICKY_SCENE_STYLE: React.CSSProperties = {
    position: 'relative',
    top: `${STICKY_HEADER_OFFSET}px`,
    height: `calc(100dvh - ${STICKY_HEADER_OFFSET}px)`,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '100px 12px' : '120px 40px', // reduced mobile padding
    boxSizing: 'border-box',
    overflow: 'hidden'
  };

  const TITLE_WRAPPER: React.CSSProperties = {
    position: 'absolute',
    top: '18px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2000,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    textAlign: 'center'
  };

  const TITLE_STYLE: React.CSSProperties = {
    fontFamily: 'var(--font-heading)',
    fontSize: isMobile ? '1.6rem' : 'clamp(2.2rem, 4.5vw, 3.6rem)', // smaller on mobile
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
    width: isMobile ? '94vw' : '90vw',
    height: '100%',
    maxWidth: '1500px',
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
    flexDirection: isMobile ? 'column' : 'row',   // ← MOBILE COLUMN LAYOUT
    transition: 'opacity 450ms ease, transform 450ms ease',
    overflow: 'hidden'
  };

  // TEXT SIDE: reduce padding and font sizes on mobile
  const TEXT_SIDE: React.CSSProperties = {
    flex: 1,
    padding: isMobile ? '16px' : '56px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  // IMAGE SIDE: on mobile give it a fixed visible height so it doesn't collapse
  const IMAGE_SIDE_COMMON: React.CSSProperties = isMobile
    ? {
        width: '100%',
        height: '29vh',         // visible portion on small devices (adjustable)
        minHeight: '160px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        flex: '0 0 auto',
      }
    : {
        flex: 1,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };

  // Font sizes for headings and paragraph adaptively smaller on mobile
  const CARD_TITLE_FONT = isMobile ? '1.4rem' : '2rem';
  const CARD_P_FONT = isMobile ? '0.95rem' : '1.05rem';

  return (
    <section style={ROOT_STYLE}>
      <div style={STICKY_SCENE_STYLE}>
        <div style={TITLE_WRAPPER}>
          <span style={TITLE_STYLE}>ABOUT</span>
          <span style={SUBTITLE_STYLE_BASE}>{activeSubtitle}</span>
        </div>

        <div ref={carouselRef} style={STACK_WRAPPER_STYLE}>
          {CARD_DATA.map((card, idx) => {
            const isActive = idx === activeIndex;

            const visibleStyle = isActive
              ? { opacity: 1, transform: 'scale(1)', zIndex: 100 }
              : { opacity: 0, transform: 'scale(0.97)', zIndex: 10 };

            // --- FLEX ORDERING ON MOBILE ---
            const imageOrder = isMobile
              ? card.id === 0 ? 1 : 2 // Card 0 → image first, Card 1 → image second
              : card.id % 2 === 1 ? 1 : 2;

            const textOrder = isMobile
              ? card.id === 0 ? 2 : 1 // Card 0 → text second, Card 1 → text first
              : card.id % 2 === 1 ? 2 : 1;

            return (
              <article key={card.id} style={{ ...CARD_BASE, ...visibleStyle }}>
                {/* IMAGE */}
                <div
                  style={{
                    ...IMAGE_SIDE_COMMON,
                    backgroundImage: card.img,
                    order: imageOrder
                  }}
                />

                {/* TEXT */}
                <div style={{ ...TEXT_SIDE, order: textOrder }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: CARD_TITLE_FONT, color: card.color, margin: 0 }}>
                    {card.title}
                  </h3>
                  <p style={{ color: '#ccc', marginTop: '10px', fontSize: CARD_P_FONT }}>
                    {card.id === 0
                      ? <>At Scivvas Entertainment, events become environments.<br/><br/>We craft immersive atmospheres where every detail, every beam of light, every shifting wavelength of sound is curated to perfection.</>
                      : <>We are a curated team of acoustic designers, visual craftsmen, and precision logistics experts delivering flawless experiences.<br/><br/>Our expertise ensures that each moment is orchestrated with intention, refinement, and unforgettable impact.</>}
                  </p>
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
