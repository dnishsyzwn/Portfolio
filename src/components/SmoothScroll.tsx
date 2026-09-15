"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Highly-tuned Lenis smooth inertia configuration for 60-120fps fluid scrolling
    const lenis = new Lenis({
      lerp: 0.09, // Instant, buttery-smooth linear interpolation without heavy input lag
      wheelMultiplier: 0.9, // Balanced scroll distance per wheel click
      touchMultiplier: 1.5,
      smoothWheel: true,
      syncTouch: false,
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
