"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-[padding] duration-300 pointer-events-none bg-transparent ${
        isScrolled ? "py-3 sm:py-3.5" : "py-4 sm:py-5"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 md:px-12 flex items-center justify-between pointer-events-auto">
        {/* Name / Brand */}
        <div className="font-sans text-base sm:text-lg md:text-xl tracking-tight font-medium flex items-center">
          <a
            href="/"
            onClick={() => setMobileMenuOpen(false)}
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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 md:gap-3">
          {[
            { label: "Work", href: "/#work" },
            { label: "Services", href: "/#services" },
            { label: "Stack", href: "/#stack" },
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
            href="/contact"
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

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            style={{ color: "var(--nav-btn-text, #1b4c78)" }}
            className="p-2 -mr-2 rounded-lg hover:bg-black/5 active:scale-95 transition-all focus:outline-none"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden pointer-events-auto mt-2 mx-4 p-5 rounded-2xl bg-white/95 border border-[#1b4c78]/15 shadow-[0_20px_50px_rgba(27,76,120,0.2)] backdrop-blur-2xl text-[#1b4c78] animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col gap-2.5">
            {[
              { label: "Work", href: "/#work" },
              { label: "Services", href: "/#services" },
              { label: "Stack", href: "/#stack" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#1b4c78]/5 transition-colors font-sans text-base font-medium"
              >
                <span>{item.label}</span>
                <span className="font-mono text-xs text-[#3f6aa6]">[ ↗ ]</span>
              </a>
            ))}
            <a
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#1b4c78]/5 hover:bg-[#1b4c78]/10 transition-colors font-sans text-base font-semibold text-[#1b4c78]"
            >
              <span>Contact</span>
              <span className="font-mono text-xs text-[#38bdf8]">[ → ]</span>
            </a>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1b4c78]/10 flex items-center justify-between text-xs font-mono text-[#1b4c78]/60">
            <span>[ Full-Stack Dev ]</span>
            <a
              href="https://github.com/dnishsyzwn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1b4c78] underline"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
