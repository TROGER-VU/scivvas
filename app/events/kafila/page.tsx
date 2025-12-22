"use client";
import EventMap from "@/components/EventMap";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import React, { useState } from "react";

export const EVENT_DATA = {
  title: "BAN KAFILA",
  slug: "kafila",
  date: "2026-01-03T00:00:00",
  location: "PAC Ground, Kanpur",
  description:
    "A convergence of light and sound. The city's largest industrial techno gathering returns.",
  coverImage:
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop",
  lineup: ["MASOOM SHARMA"],
  tickets: [
    {
      id: "silver",
      name: "SILVER",
      price: "₹1200",
      status: "SELLING FAST",
      features: ["₹200 Food Voucher", "Silver Stand Access"],
      accentColor: "#C0C0C0",
    },
    {
      id: "gold",
      name: "GOLD",
      price: "₹2200",
      status: "SELLING FAST",
      features: ["₹200 Food Voucher", "Gold Stand Access"],
      accentColor: "#FFD700",
    },
    {
      id: "fanpit",
      name: "FANPIT",
      price: "₹5000",
      status: "SELLING FAST",
      features: ["₹200 Food Voucher", "Fanpit Stand Access"],
      accentColor: "#A020F0",
    },
    {
      id: "vip",
      name: "VIP PRIME TABLE",
      price: "₹30000",
      status: "AVAILABLE",
      features: [
        "Limited for 4 people",
        "Elevated Area",
        "Unlimited Fooding",
        "2 Bottles Premium Whisky",
        "4 Bottles Beer",
        "Unlimited Energy Drink",
      ],
      accentColor: "#FFE5B4",
    },
    {
      id: "vvip",
      name: "VVIP ROYAL TABLE",
      price: "₹40000",
      status: "AVAILABLE",
      features: [
        "Limited for 6 people",
        "Elevated Area",
        "Unlimited Fooding",
        "2 Bottles Premium Whisky",
        "6 Bottles Beer",
        "Unlimited Energy Drink",
      ],
      accentColor: "#00FFFF",
    },
  ],
};

// --- COMPONENTS ---

// 1. COUNTDOWN TIMER COMPONENT
// const Countdown = ({ targetDate }: { targetDate: string }) => {
//     const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

//     useEffect(() => {
//         const interval = setInterval(() => {
//             const now = new Date().getTime();
//             const target = new Date(targetDate).getTime();
//             const distance = target - now;

//             if (distance < 0) {
//                 clearInterval(interval);
//                 return;
//             }

//             setTimeLeft({
//                 days: Math.floor(distance / (1000 * 60 * 60 * 24)),
//                 hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
//                 minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
//                 seconds: Math.floor((distance % (1000 * 60)) / 1000),
//             });
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [targetDate]);

//     const BOX_STYLE: React.CSSProperties = {
//         display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 15px'
//     };
//     const NUMBER_STYLE: React.CSSProperties = {
//         fontSize: '3rem', fontWeight: 900, fontFamily: 'monospace', color: 'white', lineHeight: 1
//     };
//     const LABEL_STYLE: React.CSSProperties = {
//         fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '5px'
//     };

//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: '40px' }}>
//             <div style={BOX_STYLE}><span style={NUMBER_STYLE}>{timeLeft.days}</span><span style={LABEL_STYLE}>Days</span></div>
//             <div style={BOX_STYLE}><span style={NUMBER_STYLE}>{timeLeft.hours}</span><span style={LABEL_STYLE}>Hrs</span></div>
//             <div style={BOX_STYLE}><span style={NUMBER_STYLE}>{timeLeft.minutes}</span><span style={LABEL_STYLE}>Mins</span></div>
//             <div style={BOX_STYLE}><span style={{...NUMBER_STYLE, color: '#ff2929'}}>{timeLeft.seconds}</span><span style={LABEL_STYLE}>Secs</span></div>
//         </div>
//     );
// };

// 2. TICKET CARD COMPONENT
interface TicketTier {
  name: string;
  price: string;
  status: string;
  features: string[];
  accentColor: string;
}

const TicketCard = ({ tier }: { tier: TicketTier }) => {
  const [isHovered, setIsHovered] = useState(false);
  // const PRIMARY_COLOR = '#FF9FFC';
  const isSoldOut = tier.status === "SOLD OUT";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        padding: "32px",
        borderRadius: "16px",
        background: "linear-gradient(180deg, #0c0c0c, #050505)",
        border: `1px solid ${isHovered ? tier.accentColor : "#1f1f1f"}`,
        boxShadow: isHovered
          ? `0 0 30px ${tier.accentColor}40`
          : "0 10px 30px rgba(0,0,0,0.6)",
        transform: isHovered ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.35s ease",
        opacity: isSoldOut ? 0.5 : 1,
        // cursor: isSoldOut ? 'not-allowed' : 'pointer',
        overflow: "hidden",
      }}
    >
      {/* Accent Top Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "4px",
          width: "100%",
          background: tier.accentColor,
        }}
      />

      {/* Status Badge */}
      <div
        style={{
          display: "inline-block",
          padding: "6px 12px",
          fontSize: "0.7rem",
          letterSpacing: "1px",
          fontWeight: 700,
          textTransform: "uppercase",
          color: isSoldOut ? "#ff2929" : tier.accentColor,
          border: `1px solid ${isSoldOut ? "#ff2929" : tier.accentColor}`,
          borderRadius: "999px",
          marginBottom: "18px",
        }}
      >
        {tier.status}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: "2rem",
          fontFamily: "var(--font-heading)",
          color: "white",
          marginBottom: "8px",
          textTransform: "uppercase",
        }}
      >
        {tier.name}
      </h3>

      {/* Price */}
      <div
        style={{
          fontSize: "2.8rem",
          fontWeight: 900,
          color: tier.accentColor,
          marginBottom: "24px",
        }}
      >
        {tier.price}
      </div>

      {/* Features */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {tier.features.map((feat, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "0.95rem",
              color: "#ccc",
              marginBottom: "10px",
            }}
          >
            <span style={{ color: tier.accentColor }}>✦</span>
            {feat}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={"https://link.district.in/DSTRKT/enqwgwzr"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button
          disabled={isSoldOut}
          style={{
            marginTop: "28px",
            width: "100%",
            padding: "16px",
            fontWeight: 800,
            letterSpacing: "1px",
            textTransform: "uppercase",
            borderRadius: "12px",
            background: isSoldOut
              ? "#222"
              : isHovered
              ? tier.accentColor
              : "transparent",
            color: isHovered && !isSoldOut ? "#000" : "white",
            border: `1px solid ${isSoldOut ? "#333" : tier.accentColor}`,
            // cursor: isSoldOut ? 'not-allowed' : '',
            transition: "all 0.25s ease",
            boxShadow:
              isHovered && !isSoldOut
                ? `0 0 20px ${tier.accentColor}80`
                : "none",
          }}
        >
          {isSoldOut ? "Unavailable" : "Select Access"}
        </button>
      </Link>
    </div>
  );
};

const SeatingLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Preview */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2.2rem",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Seating Layout
        </h3>

        <p
          style={{
            color: "#777",
            fontFamily: "monospace",
            marginBottom: "25px",
          }}
        >
          Tap to zoom & understand your access zone
        </p>

        <div
          onClick={() => setOpen(true)}
          style={{
            cursor: "zoom-in",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #222",
            maxWidth: "900px",
            margin: "0 auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          <img
            src="/stage.jpeg"
            alt="Event Seating Layout"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* Fullscreen Modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            cursor: "zoom-out",
          }}
        >
          <img
            src="/stage.jpeg"
            alt="Seating Layout Full View"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              borderRadius: "12px",
            }}
          />
        </div>
      )}
    </>
  );
};


// --- MAIN PAGE COMPONENT ---

export default function EventPage() {
  // In a real app, use params.slug to fetch data
  // const event = fetchEvent(params.slug);
  const event = EVENT_DATA;

  // --- STYLES ---
  // const PRIMARY_COLOR = '#FF9FFC';

  // const HERO_STYLE: React.CSSProperties = {
  //     minHeight: '100vh',
  //     width: '100%',
  //     position: 'relative',
  //     display: 'flex',
  //     flexDirection: 'column',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     textAlign: 'center',
  //     padding: '20px',
  //     overflow: 'hidden',
  // };

  // const BACKGROUND_IMG: React.CSSProperties = {
  //     position: 'absolute',
  //     top: 0, left: 0, width: '100%', height: '100%',
  //     backgroundImage: `url(${event.coverImage})`,
  //     backgroundSize: 'cover',
  //     backgroundPosition: 'center',
  //     zIndex: -2,
  //     filter: 'grayscale(20%) brightness(0.8)', // Dark aesthetic
  // };

  // const GRADIENT_OVERLAY: React.CSSProperties = {
  //     position: 'absolute',
  //     top: 0, left: 0, width: '100%', height: '100%',
  //     background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), #000)',
  //     zIndex: -1
  // };

  const SECTION_STYLE: React.CSSProperties = {
    padding: "100px 5%",
    backgroundColor: "black",
    color: "white",
  };

  const SECTION_LOCATION_STYLE: React.CSSProperties = {
    padding: "50px 5%",
    backgroundColor: "black",
    color: "white",
  };

  const GRID_STYLE: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "50px",
  };

  // const formattedDate = new Intl.DateTimeFormat('en-US', {
  //     weekday: 'long',
  //     month: 'long',
  //     day: 'numeric',
  //     }).format(new Date(event.date));

  return (
    <main>
      {/* --- HERO SECTION --- */}
      <Header />
      {/* <section style={HERO_STYLE}> */}
      {/* <div style={BACKGROUND_IMG} />
               <div style={GRADIENT_OVERLAY} />
               
               <h2 style={{ letterSpacing: '5px', fontSize: '1rem', color: 'white', textTransform: 'uppercase', marginBottom: '20px' }}>
                   Upcoming Event
               </h2>
               
               <h1 style={{ 
                   fontFamily: 'var(--font-heading)', 
                   fontSize: 'clamp(3rem, 8vw, 6rem)', 
                   fontWeight: 900, 
                   lineHeight: 0.9,
                   color: '#ff2929',
                   textTransform: 'uppercase',
                   marginBottom: '10px'
               }}>
                   {event.title}
               </h1>

               <p style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: '#ccc' }}>
                   {formattedDate}
               </p> */}

      {/* Countdown Timer */}
      {/* <Countdown targetDate={event.date} /> */}

      {/* Scroll Down Hint */}
      {/* <div style={{ position: 'absolute', bottom: '40px', animation: 'bounce 2s infinite' }}>
                   <span style={{ color: '#555', fontSize: '0.8rem' }}>SCROLL TO ACQUIRE ACCESS</span>
               </div> */}
      {/* </section> */}

      {/* --- INFO & LINEUP --- */}
      {/* <section style={SECTION_STYLE}>
               <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '60px' }}> */}

      {/* Event Description */}
      {/* <div style={{ flex: '1 1 400px' }}>
                       <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '20px', color: 'white' }}>
                           THE TRANSMISSION
                       </h3>
                       <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#aaa', marginBottom: '30px' }}>
                           {event.description}
                       </p>
                       <div style={{ fontFamily: 'monospace', color: PRIMARY_COLOR, borderLeft: `2px solid ${PRIMARY_COLOR}`, paddingLeft: '20px', fontSize: '1.2rem' }}>
                           <div style={{ marginBottom: '10px' }}>LOCATION: {event.location}</div>
                           <div>DOORS: 18:00 - 23:00</div>
                       </div>
                   </div> */}

      {/* Lineup List */}
      {/* <div style={{ flex: '1 1 300px' }}>
                       <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '20px', color: 'white', textAlign: 'right' }}>
                           LINEUP
                       </h3>
                       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
                           {event.lineup.map((artist, i) => (
                               <div key={i} style={{ 
                                   fontSize: i === 0 ? '2.5rem' : '1.5rem', // Headliner is bigger
                                   fontWeight: 900, 
                                   color: i === 0 ? 'white' : '#666',
                                   textTransform: 'uppercase',
                                   // cursor: 'pointer',
                                   transition: 'color 0.2s',
                                   fontFamily: 'var(--font-heading)'
                               }}
                               onMouseEnter={(e) => e.currentTarget.style.color = '#ff2929'}
                               onMouseLeave={(e) => e.currentTarget.style.color = i === 0 ? 'white' : '#666'}
                               >
                                   {artist}
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
           </section> */}

      {/* --- TICKETS SECTION --- */}
      <section
        style={{
          ...SECTION_STYLE,
          backgroundColor: "#050505",
          borderTop: "1px solid #222",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "3rem",
              fontFamily: "var(--font-heading)",
              marginBottom: "10px",
              textTransform: "uppercase",
            }}
          >
            Secure Access
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: "60px",
              fontFamily: "monospace",
            }}
          >
            Capacity is strictly limited.
          </p>

          <div style={GRID_STYLE}>
            {event.tickets.map((tier, index) => (
              <TicketCard key={index} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      <SeatingLayout/>

      <section style={{ ...SECTION_LOCATION_STYLE, backgroundColor: "#000" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "2.5rem",
            fontFamily: "var(--font-heading)",
            marginBottom: "10px",
            textTransform: "uppercase",
          }}
        >
          Venue Location
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "10px",
            fontFamily: "monospace",
            fontSize: "2rem",
          }}
        >
          PAC Ground, Kanpur
        </p>

        <EventMap />
      </section>
      <Footer />
    </main>
  );
}
