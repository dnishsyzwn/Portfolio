"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Enable native iOS/Android momentum scrolling on mobile devices under 768px
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return;
    }

    // Highly-tuned Lenis smooth inertia configuration for 60-120fps fluid scrolling on desktop
    const lenis = new Lenis({
      lerp: 0.09, // Instant, buttery-smooth linear interpolation without heavy input lag
      wheelMultiplier: 0.9, // Balanced scroll distance per wheel click
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
