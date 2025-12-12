// hooks/useWindowWidth.ts
import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;
const SERVER_DEFAULT_WIDTH = 1200; // Assume Desktop on Server

export default function useWindowWidth() {
  const width = useSyncExternalStore(
    // 1. Subscribe function: React calls this to listen for changes
    (callback) => {
      window.addEventListener('resize', callback);
      return () => window.removeEventListener('resize', callback);
    },
    // 2. Get Client Snapshot: Real browser width
    () => window.innerWidth,
    // 3. Get Server Snapshot: Safe default for SSR
    () => SERVER_DEFAULT_WIDTH
  );

  // We can derive isMobile directly from the width
  const isMobile = width < MOBILE_BREAKPOINT;

  // We return isMounted as true because useSyncExternalStore handles the
  // initial "server vs client" pass for us safely.
  return { width, isMobile, isMounted: true };
}