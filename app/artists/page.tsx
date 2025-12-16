// app/about/page.tsx

'use client';

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WebsiteLoader from '@/components/WebsiteLoader';
import DotGrid from '@/components/DotGrid';
import EventsSection from '@/components/EventsSection';
import ArtistsSection from '@/components/ArtistsSection';

export default function ArtistsPage() {
    
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
                <ArtistsSection/>
                <Footer />
            </main>
        </div>
    );
}