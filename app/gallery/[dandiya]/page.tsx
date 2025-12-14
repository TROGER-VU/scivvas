// app/gallery/[slug]/page.tsx
import React from 'react';
import Link from 'next/link';
import DomeGallery from '@/components/DomeGallery'; // Adjust path if needed
import DotGrid from '@/components/DotGrid';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function EventGalleryPage({ params }: PageProps) {
  // The 'slug' corresponds to the ID from your GALLERY_EVENTS array
  // e.g., "neon-eclipse-2026"
  const eventId = params.slug;

  return (
    <div style={{ 
        position: 'relative', 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden', // Prevent scrolling for immersive experience
        backgroundColor: '#000' 
    }}>
        <div style={{ position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                zIndex: 0, }}>
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
      
      {/* 1. Navigation Overlay (Back Button) */}
      <div style={{
        position: 'absolute',
        top: '30px',    
        left: '30px',
        zIndex: 100, // Ensure it sits on top of the Dome
      }}>
        <Link href="/gallery" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '50px',
            cursor: 'pointer',
            backdropFilter: 'blur(5px)',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            ← Back to Archives
          </button>
        </Link>
      </div>

      {/* 2. Your Dome Gallery Component */}
      {/* We pass the eventId so the component knows which images to load */}
      {/* 2. Dome Gallery – Full Screen */}
        <div
        style={{
            position: 'absolute',
            inset: 0,          // top:0 left:0 right:0 bottom:0
            width: '100vw',
            height: '100vh',
            zIndex: 1
        }}
        >
        <DomeGallery />
        </div>

    </div>
  );
}