// app/gallery/page.tsx
'use client';
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DotGrid from '@/components/DotGrid';
import GallerySection from '@/components/GallerySection';
import WebsiteLoader from '@/components/WebsiteLoader';

export default function GalleryPage() {
  return (
    <div style={{ 
        width: '100%', 
        position: 'relative', 
        minHeight: '100vh', 
        backgroundColor: '#000' 
    }}>
        <WebsiteLoader/>
      
        <Header/>
      {/* Background */}
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

      
      <main style={{ position: 'relative', zIndex: 10 }}>
          <GallerySection />
          <Footer />
      </main>
    </div>
  );
}