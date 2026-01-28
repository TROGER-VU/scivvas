'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

/* ===========================
   MOCK DATA
=========================== */
const MOCK_EVENT_DATA = [
  { 
    id: 1, 
    status: 'UPCOMING', 
    date: '2026-02-08', 
    title: 'Gulabi & Gabru Night',
    slug: 'gabru', 
    location: 'PAC Ground, Kanpur', 
    img: 'url("/gabru.jpeg")',
    description:
      <>SCIVVAS Entertainment & Food Chariot Crew proudly present an electrifying musical evening that blends glamour, energy, and pure desi swag — GULABI & GABRU NIGHT. <br/>
      Get ready for an unforgettable night as some of the most loved names in Punjabi, Haryanvi & Indie music come together on one massive stage.</>
  },
  { 
    id: 2, 
    status: 'PAST',
    slug: 'dandiya', 
    date: '2025-09-27', 
    title: 'Dandiya Glow Fest 2025', 
    location: 'Ganges Club, Kanpur', 
    img: 'url("/dandiya.jpeg")',
    description: 'The official debut of Scivvas Entertainment. Sold out in 2 hours.'
  },
//   { 
//     id: 3, 
//     status: 'PAST', 
//     date: '2025-08-01', 
//     title: 'PROJECT CHRONOS', 
//     location: 'Los Angeles, CA', 
//     img: 'url("https://images.unsplash.com/photo-1506148560824-2c4f1c1103c2?q=80&w=1000&auto=format&fit=crop")',
//     description: 'A secret warehouse rave with a 12-hour closing set.'
//   },
//   { 
//     id: 4, 
//     status: 'PAST', 
//     date: '2025-06-05', 
//     title: 'WAVELENGTH SERIES', 
//     location: 'Chicago, IL', 
//     img: 'url("https://images.unsplash.com/photo-1517457210988-782803b906a4?q=80&w=1000&auto=format&fit=crop")',
//     description: 'Experimental audio-visual performance with local artists.'
//   },
//   { 
//     id: 5, 
//     status: 'PAST', 
//     date: '2025-04-10', 
//     title: 'THE HIVE', 
//     location: 'Dallas, TX', 
//     img: 'url("https://images.unsplash.com/photo-1511585863261-0a618d72f10d?q=80&w=1000&auto=format&fit=crop")',
//     description: 'Intimate gathering showcasing deep house and techno.'
//   },
];

/* ===========================
   SSR-SAFE HOOK
=========================== */
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

/* ===========================
   UTILS
=========================== */
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
};

/* ===========================
   COMPONENT
=========================== */
const EventsSection: React.FC = () => {
  const { isMobile } = useWindowWidth();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const upcomingEvents = MOCK_EVENT_DATA.filter(e => e.status === 'UPCOMING');
  const pastEvents = MOCK_EVENT_DATA.filter(e => e.status === 'PAST');

  /* ===========================
     STYLES
  =========================== */
  const SECTION_STYLE: React.CSSProperties = {
    padding: isMobile ? '80px 16px' : '100px 80px',
    color: 'white',
    minHeight: '100vh',
  };

  const HEADER_TITLE_STYLE: React.CSSProperties = {
    fontFamily: 'var(--font-heading)',
    fontSize: isMobile ? '2.5rem' : '4rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: isMobile ? '20px' : '0px',
    textAlign: 'center',
  };

  const SUBSECTION_HEADER: React.CSSProperties = {
    fontFamily: 'var(--font-heading)',
    fontSize: isMobile ? '1.8rem' : '2.5rem',
    textTransform: 'uppercase',
    marginBottom: isMobile ? '10px' : '20px',
    borderBottom: '2px solid rgba(255,255,255,0.1)',
    paddingBottom: '5px',
  };

  const CARD_BASE: React.CSSProperties = {
    borderRadius: '12px',
    backgroundColor: '#111',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  const UPCOMING_CARD_STYLE: React.CSSProperties = {
    ...CARD_BASE,
    border: '1px solid #ff2929',
    boxShadow: '0 0 40px rgba(255,159,252,0.35)',
    display: isMobile ? 'block' : 'flex',
    maxWidth: '1200px',
    margin: '0 auto 60px',
  };

  const UPCOMING_IMAGE_STYLE: React.CSSProperties = {
    width: isMobile ? '100%' : '50%',
    height: isMobile ? '400px' : '450px',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };

  const UPCOMING_TEXT_STYLE: React.CSSProperties = {
    padding: isMobile ? '16px' : '40px',
    width: isMobile ? '100%' : '50%',
  };

  const PAST_GRID_STYLE: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: '30px',
    marginTop: '30px',
  };

  const BUTTON_STYLE: React.CSSProperties = {
    padding: '10px 25px',
    backgroundColor: '#ff2929', // Strong red for CTA
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    // cursor: 'pointer',
    marginTop: '20px', // Spacing above button
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    transition: 'background-color 0.2s, transform 0.1s',
  } as React.CSSProperties; // Assert to allow hover simulation

  const PAST_CARD_STYLE: React.CSSProperties = {
    ...CARD_BASE,
    border: '1px solid rgba(255,255,255,0.08)',
  };

  const PAST_IMAGE_STYLE: React.CSSProperties = {
    height: '400px',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    flexShrink: 0
  };

  const PAST_TEXT_STYLE: React.CSSProperties = {
    padding: '16px 18px 22px',
  };

  return (
    <section style={SECTION_STYLE}>
      <h1 style={HEADER_TITLE_STYLE}>
        Our <span style={{ color: '#ff2929' }}>Events</span>
      </h1>

      {/* UPCOMING */}
      <h2 style={SUBSECTION_HEADER}>Upcoming</h2>
      {upcomingEvents.map(event => (
        <div key={event.id} style={UPCOMING_CARD_STYLE}>
          <div
            style={{ ...UPCOMING_IMAGE_STYLE, backgroundImage: event.img }}
          />
          <div style={UPCOMING_TEXT_STYLE}>
            <h3 style={{ color: '#ff2929', fontSize: '2rem' }}>
              {event.title}
            </h3>
            <p style={{ color: '#ccc', margin: '6px 0', fontSize: '0.85rem' }}>
              {/* TBD | {event.location} */}
              {formatDate(event.date)} | {event.location}
            </p>
            <p style={{ color: '#999', lineHeight: 1.6 }}>
              {event.description}
            </p>
            <Link href={'/events/gabru'}>
            <button
                style={BUTTON_STYLE}
                // Inline pseudo-classes for a simple hover effect since we are using inline styles
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#cc2323')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ff2929')}
                // onClick={() => alert(`Redirecting to tickets for ${event.title}!`)}
            >
                GET TICKETS
            </button>
            </Link>
          </div>
        </div>
      ))}

      {/* PAST */}
      <h2 style={SUBSECTION_HEADER}>Past Events</h2>
      <div style={PAST_GRID_STYLE}>
        {pastEvents.map(event => (
          <Link
            key={event.id}
            href={`/gallery/${event.slug}`}
            style={{
              ...PAST_CARD_STYLE,
              transform: hoveredId === event.id ? 'translateY(-5px)' : 'none',
              boxShadow:
                hoveredId === event.id
                  ? '0 10px 30px rgba(0,0,0,0.5)'
                  : 'none',
            }}
            onMouseEnter={() => setHoveredId(event.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              style={{ ...PAST_IMAGE_STYLE, backgroundImage: event.img }}
            />
            <div style={PAST_TEXT_STYLE}>
              <h4 style={{ marginBottom: '4px', fontSize: '1.5rem' }}>{event.title}</h4>
              <p style={{ color: '#ccc', fontSize: '0.85rem' }}>
                {formatDate(event.date)} | {event.location}
              </p>
              <p style={{ color: '#999', lineHeight: 1.6 }}>
              {event.description}
            </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default EventsSection;
