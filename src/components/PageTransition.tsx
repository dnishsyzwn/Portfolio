"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Letters } from "@kumailnanji/letters";
import { Loader2 } from "lucide-react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [phase, setPhase] = useState<"idle" | "entering" | "writing" | "exiting">("idle");
  const isFirstMount = useRef(true);
  const phaseRef = useRef(phase);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // When pathname changes (route loaded on destination), wipe out from right to left
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    setPhase("exiting");
    const timer = setTimeout(() => {
      setPhase("idle");
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Intercept internal page navigation clicks to run the full Apple-style sequence
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (phaseRef.current !== "idle") return;

      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external links, mailto, tel, target="_blank", or modifier keys
      if (
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        anchor.getAttribute("target") === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      try {
        const dest = new URL(anchor.href);
        // Ignore same-page anchors
        if (dest.pathname === pathname) {
          return;
        }

        e.preventDefault();
        // Phase 1: Wipe in from left to right
        setPhase("entering");

        // Phase 2: Screen covered, write Apple "hello" in center
        setTimeout(() => {
          setPhase("writing");
        }, 400);

        // Phase 3: Push route after handwriting finishes
        setTimeout(() => {
          router.push(href);
        }, 1450);
      } catch {
        // Fallback to default navigation
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [pathname, router]);

  const showCurtain = phase !== "idle";
  const showWriting = phase === "writing";

  return (
    <div className="relative w-full min-h-screen">
      {/* ── Screen Swipe Curtains ───────────────────────────────────── */}
      <AnimatePresence>
        {showCurtain && (
          <>
            {/* Secondary Accent Layer: Deep Navy */}
            <motion.div
              key="swipe-accent"
              initial={{ x: phase === "entering" || phase === "writing" ? "-100%" : "0%" }}
              animate={{ x: phase === "exiting" ? "-100%" : "0%" }}
              transition={{
                duration: 0.44,
                delay: phase === "entering" ? 0.03 : 0,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="fixed inset-0 z-[9998] pointer-events-none bg-[#132f4c] transform-gpu will-change-transform"
            />

            {/* Primary Layer: Solid Dark Blue (#0b1c2e) */}
            <motion.div
              key="swipe-main"
              initial={{ x: phase === "entering" || phase === "writing" ? "-100%" : "0%" }}
              animate={{ x: phase === "exiting" ? "-100%" : "0%" }}
              transition={{
                duration: 0.42,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="fixed inset-0 z-[9999] pointer-events-none bg-[#0b1c2e] transform-gpu will-change-transform"
            />
          </>
        )}
      </AnimatePresence>

      {/* ── Centered Apple "hello" Handwriting Animation & Loading Indicator ── */}
      <AnimatePresence>
        {showWriting && (
          <motion.div
            key="hello-writing-stage"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
            className="fixed inset-0 z-[10000] pointer-events-none flex flex-col items-center justify-center select-none"
          >
            <div className="relative flex flex-col items-center justify-center p-6">
              <Letters
                text="hello"
                autoPlay
                color="#ffffff"
                strokeWidth={2.5}
                animation={{ type: "tween", duration: 0.95, ease: "easeInOut" }}
                className="h-20 sm:h-24 md:h-28 w-auto text-white drop-shadow-none"
              />

              {/* Minimalist Apple-style Loading Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.35, ease: "easeOut" }}
                className="mt-6 sm:mt-8 flex items-center justify-center"
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  {/* Subtle circular track */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/20" />
                  {/* Active spinner */}
                  <Loader2 className="w-6 h-6 text-white animate-spin stroke-[2.2] relative z-10" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page Content ────────────────────────────────────────────── */}
      <div className="w-full">{children}</div>
    </div>
  );
}
