"use client";
import Countdown from "@/components/Countdown";
import Footer from "@/components/Footer";
import GradientBlinds from "@/components/GradientBlinds";
import Header from "@/components/Header";
import SwipeButton from "@/components/SwipeButton";
import WebsiteLoader from "@/components/WebsiteLoader";
import { useEffect, useState } from "react";

export default function Home() {
  const NEXT_EVENT_DATE = "2026-02-08T00:00:00";
  const EVENT_NAME = "Reveal Soon ";

  return (
    // 1. Use 'dvh' for mobile browser bar compatibility
    <div
      style={{
        width: "100dvw",
        height: "100dvh", // Changed from 100vh to 100dvh
        minHeight: "-webkit-fill-available", // Fix for iOS Safari
        position: "relative",
        // overflow: 'hidden',
        backgroundColor: "#000",
      }}
    >
      <WebsiteLoader />
      <Header />

      {/* Background Layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <GradientBlinds
          gradientColors={["#FF9FFC", "#ff2929"]}
          angle={20}
          noise={0.2}
          blindCount={12}
          blindMinWidth={50}
          spotlightRadius={0.5}
          spotlightSoftness={1}
          spotlightOpacity={1}
          mouseDampening={0.15}
          distortAmount={0}
          shineDirection="left"
          mixBlendMode="lighten"
        />
      </div>

      {/* Content Layer */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          padding: "20px", // Added padding to prevent edge touching
          boxSizing: "border-box", // Ensures padding doesn't break width
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            pointerEvents: "auto",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          {/* 2. Responsive Typography using clamp() */}
          <h1
            style={{
              // Scale between 2.5rem (mobile) and 5rem (desktop)
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              lineHeight: "1.1",
              fontWeight: "bold",
              margin: 0,
              marginTop: "130px",
              textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            }}
          >
            SCIVVAS ENTERTAINMENT
          </h1>

          <p
            style={{
              // Scale between 1rem and 1.5rem
              fontSize: "clamp(1rem, 4vw, 1.5rem)",
              marginTop: "1rem",
              opacity: 0.9,
              padding: "0 10px", // Extra breathing room for text
              textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            }}
          >
            Experience the Unforgettable
          </p>

          <div style={{ margin: "0px 0 0px 0" }}>
            <Countdown targetDate={NEXT_EVENT_DATE} eventName={EVENT_NAME} />
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <SwipeButton
              text="SWIPE TO KNOW MORE"
              destination="/events" // Where it goes after swipe
              mainColor="#990000" // Neon Pink
            />
          </div>

          {/* <button style={{ 
                  // marginTop: '2.5rem', 
                  padding: '16px 40px', // Larger touch target for thumbs
                  fontSize: '1.1rem', 
                  borderRadius: '50px', 
                  border: 'none', 
                  background: 'white', 
                  color: 'black',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)', // Subtle shadow
                  transition: 'transform 0.2s'
              }}>
                  Get Tickets
              </button> */}
        </div>
        <Footer />
      </div>
    </div>
  );
}
