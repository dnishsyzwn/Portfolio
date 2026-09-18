"use client";

import { useEffect, useRef, useState } from "react";

// Linear interpolation helper
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Color interpolation helper returning rgba(...)
function lerpColor(
  c1: [number, number, number, number],
  c2: [number, number, number, number],
  t: number
): string {
  const r = Math.round(lerp(c1[0], c2[0], t));
  const g = Math.round(lerp(c1[1], c2[1], t));
  const b = Math.round(lerp(c1[2], c2[2], t));
  const a = +(lerp(c1[3], c2[3], t)).toFixed(3);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export default function Topbar() {
  const headerRef = useRef<HTMLElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darknessRatio, setDarknessRatio] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const scrolled = scrollY > 30;
        setIsScrolled(scrolled);

        let darkness = 0;

        const work = document.getElementById("work");
        const services = document.getElementById("services") || document.getElementById("curriculum");

        // 1. Calculate darkness in Work section during its color inversion scroll
        if (work) {
          const rect = work.getBoundingClientRect();
          if (rect.top <= 0 && rect.bottom > 0) {
            const scrollableDist = rect.height - window.innerHeight;
            if (scrollableDist > 0) {
              const progress = Math.min(1, Math.max(0, -rect.top / scrollableDist));
              // In WorkSection.tsx: background inverts between progress 0.08 and 0.72
              if (progress >= 0.08 && progress <= 0.72) {
                darkness = (progress - 0.08) / (0.72 - 0.08);
              } else if (progress > 0.72) {
                darkness = 1;
              }
            }
          }
        }

        // 2. Calculate darkness in Services section (pure #0b1c2e)
        if (services) {
          const cRect = services.getBoundingClientRect();
          if (cRect.top <= 60 && cRect.bottom > 0) {
            darkness = 1;
          }
        }

        // 3. Calculate darkness in Stack section (solid #0b1c2e)
        const stack = document.getElementById("stack");
        if (stack) {
          const sRect = stack.getBoundingClientRect();
          if (sRect.top <= 60 && sRect.bottom > 0) {
            if (sRect.bottom <= 120) {
              const exitRatio = Math.max(0, (sRect.bottom - 20) / 100);
              darkness = Math.max(darkness, exitRatio);
            } else {
              darkness = 1;
            }
          }
        }

        setDarknessRatio(darkness);

        // Apply dynamic CSS variables directly to header for instant 120 FPS reaction
        if (headerRef.current) {
          const t = darkness;

          // Header background: Completely invisible (transparent)
          const bg = "transparent";
          const border = "transparent";

          // Brand gradient stops
          const titleStart = lerpColor([90, 127, 181, 1], [255, 255, 255, 1], t);
          const titleEnd = lerpColor([40, 72, 117, 1], [157, 200, 232, 1], t);

          // Subtitle
          const subtitle = lerpColor([27, 76, 120, 0.55], [157, 200, 232, 0.70], t);

          // Nav button text & brackets
          const btnText = lerpColor([27, 76, 120, 0.9], [221, 234, 245, 0.95], t);
          const btnBracket = lerpColor([63, 106, 166, 1], [56, 189, 248, 1], t);
          const btnBg = "transparent";
          const btnBorder = "transparent";

          const style = headerRef.current.style;
          style.setProperty("--nav-bg", bg);
          style.setProperty("--nav-border", border);
          style.setProperty("--nav-title-start", titleStart);
          style.setProperty("--nav-title-end", titleEnd);
          style.setProperty("--nav-subtitle", subtitle);
          style.setProperty("--nav-btn-text", btnText);
          style.setProperty("--nav-btn-bracket", btnBracket);
          style.setProperty("--nav-btn-bg", btnBg);
          style.setProperty("--nav-btn-border", btnBorder);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-[padding] duration-300 pointer-events-none bg-transparent ${
        isScrolled ? "py-3.5" : "py-5"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 flex items-center justify-between pointer-events-auto">
        {/* Name / Brand */}
        <div className="font-sans text-lg md:text-xl tracking-tight font-medium flex items-center">
          <a
            href="#top"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, var(--nav-title-start, #5a7fb5), var(--nav-title-end, #284875))",
            }}
            className="bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            Danish Syazwan
          </a>
          <span
            style={{ color: "var(--nav-subtitle, rgba(27, 76, 120, 0.5))" }}
            className="hidden sm:inline-block ml-3 text-xs font-mono tracking-normal font-normal transition-colors"
          >
            [ Full-Stack Developer ]
          </span>
        </div>

        {/* Center / Navigation Links with Dynamic Bracket Adaptation */}
        <nav className="flex items-center gap-2 md:gap-3">
          {[
            { label: "Work", href: "#work" },
            { label: "Services", href: "#services" },
            { label: "Stack", href: "#stack" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={
                {
                  "--btn-text": "var(--nav-btn-text, #1b4c78)",
                  "--btn-bracket": "var(--nav-btn-bracket, #3f6aa6)",
                  "--btn-bg": "transparent",
                  "--btn-border": "transparent",
                } as React.CSSProperties
              }
              className="bracket-adaptive-btn text-sm"
            >
              {item.label}
            </a>
          ))}

          <a
            href="mailto:contact@danishsyazwan.dev"
            style={
              {
                "--btn-text": "var(--nav-btn-text, #1b4c78)",
                "--btn-bracket": "var(--nav-btn-bracket, #3f6aa6)",
                "--btn-bg": "transparent",
                "--btn-border": "transparent",
              } as React.CSSProperties
            }
            className="bracket-adaptive-btn text-sm font-medium"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
