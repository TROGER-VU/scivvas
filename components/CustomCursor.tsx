'use client';
import { useEffect, useRef } from 'react';

const MAX_TRAILS = 8;

export default function TrebleClefCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const cursor = cursorRef.current!;
    const trailContainer = trailContainerRef.current!;
    let lastTime = 0;

    const move = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Main cursor (instant)
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      // Throttle trail creation
      const now = performance.now();
      if (now - lastTime < 40) return; // ~25fps trail
      lastTime = now;

      const ghost = document.createElement('img');
      ghost.src = '/cursor.svg';
      ghost.className = 'treble-trail';
      ghost.style.left = `${x}px`;
      ghost.style.top = `${y}px`;

      trailContainer.appendChild(ghost);

      // Cap number of trails
      if (trailContainer.children.length > MAX_TRAILS) {
        trailContainer.removeChild(trailContainer.firstChild!);
      }

      // Auto-remove after animation
      setTimeout(() => ghost.remove(), 600);
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      {/* Trail container */}
      <div ref={trailContainerRef} className="treble-trail-container" />

      {/* Main cursor */}
      <div ref={cursorRef} className="treble-cursor">
        <img src="/cursor.svg" alt="" draggable={false} />
      </div>
    </>
  );
}
