"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { SCROLL_LOCK_EVENT } from "@/lib/scroll-lock";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/catalogue") return;
    const eligible = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    let dispose: (() => void) | undefined;
    const configure = () => {
      dispose?.();
      dispose = undefined;
      if (!eligible.matches) return;
      const lenis = new Lenis({
        lerp: pathname === "/" ? 0.1 : 0.07,
        wheelMultiplier: pathname === "/" ? 0.8 : 0.5,
        smoothWheel: true,
      });
      let frame: number | null = null;
      const raf = (time: number) => {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      };
      const sync = () => {
        if (frame !== null) { cancelAnimationFrame(frame); frame = null; }
        if (document.documentElement.dataset.scrollLocked === "true") lenis.stop();
        else lenis.start();
        if (!document.hidden && !lenis.isStopped) frame = requestAnimationFrame(raf);
      };
      sync();
      document.addEventListener("visibilitychange", sync);
      window.addEventListener(SCROLL_LOCK_EVENT, sync);
      dispose = () => {
        if (frame !== null) cancelAnimationFrame(frame);
        document.removeEventListener("visibilitychange", sync);
        window.removeEventListener(SCROLL_LOCK_EVENT, sync);
        lenis.destroy();
      };
    };
    configure();
    eligible.addEventListener("change", configure);
    return () => { eligible.removeEventListener("change", configure); dispose?.(); };
  }, [pathname]);

  return <>{children}</>;
}
