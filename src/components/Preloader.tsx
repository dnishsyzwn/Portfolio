"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const duration = 1400; // 1.4 seconds - snappy, minimalist
    const startTime = performance.now();

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / duration);
      // Subtle easing curve
      const current = Math.floor(rawProgress * 100);
      setProgress(current);

      if (rawProgress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setTimeout(() => {
          setIsDone(true);
          document.body.style.overflow = "";
        }, 220);
      }
    };

    const frameId = requestAnimationFrame(updateCounter);

    return () => {
      cancelAnimationFrame(frameId);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="minimal-preloader"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.8,
              ease: [0.85, 0, 0.15, 1], // Pure cinematic curtain wipe
            },
          }}
          className="fixed inset-0 z-[99999] bg-[#090e15] text-[#f0f4f8] flex flex-col justify-between p-8 md:p-14 select-none pointer-events-auto"
        >
          {/* Top minimal header */}
          <div className="flex items-center justify-between font-mono text-xs tracking-widest text-white/40 uppercase">
            <span className="text-white/80 font-medium">DANISH SYAZWAN</span>
            <span>PORTFOLIO © 2026</span>
          </div>

          {/* Center / Subtle focus */}
          <div className="flex flex-col items-center justify-center my-auto">
            <div className="font-mono text-xs tracking-[0.25em] text-white/30 uppercase mb-4">
              {progress < 100 ? "LOADING" : "INITIALIZED"}
            </div>
            {/* Giant Minimalist Counter */}
            <div className="font-serif text-8xl sm:text-9xl md:text-[140px] lg:text-[180px] font-normal tracking-tighter text-white tabular-nums leading-none">
              {String(progress).padStart(2, "0")}
            </div>
          </div>

          {/* Bottom hairline progress indicator */}
          <div className="w-full">
            <div className="flex items-center justify-between font-mono text-[11px] text-white/30 tracking-widest uppercase mb-3">
              <span>SYSTEM CALIBRATION</span>
              <span className="text-white/60">{progress}%</span>
            </div>
            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-white transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
