"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import LogoIcon from "@/components/LogoIcon";

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
  const a = +lerp(c1[3], c2[3], t).toFixed(3);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: "/#top" },
  { id: "work", label: "Projects", href: "/#work" },
  { id: "catalogue", label: "3D Catalogue", href: "/catalogue" },
  { id: "services", label: "Services", href: "/#services" },
  { id: "stack", label: "Stack", href: "/#stack" },
  { id: "pricing", label: "Pricing", href: "/pricing" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export default function Topbar() {
  const headerRef = useRef<HTMLElement | null>(null);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [darknessRatio, setDarknessRatio] = useState(0);
  const darknessRef = useRef(0);
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [openHeight, setOpenHeight] = useState<number>(440);

  // Track window width for responsive sizing
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Measure exact content height once to prevent layout thrashing
  useEffect(() => {
    if (contentRef.current) {
      setOpenHeight(contentRef.current.scrollHeight + 42);
    }
  }, [windowWidth]);

  // Dynamic scroll listener with debounced re-renders & direct CSS variable injection
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const scrolled = scrollY > 30;
        setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));

        let darkness = 0;

        const hero = document.getElementById("hero") || document.getElementById("top");
        const work = document.getElementById("work");
        const services = document.getElementById("services") || document.getElementById("curriculum");
        const stack = document.getElementById("stack");

        // 1. Hero Section: SilkHero is light ice-blue/white, darkness = 0
        if (hero) {
          const heroRect = hero.getBoundingClientRect();
          if (heroRect.top <= 0 && heroRect.bottom > 80) {
            darkness = 0;
          }
        }

        // 2. Work section
        if (work) {
          const rect = work.getBoundingClientRect();
          if (rect.top <= 0 && rect.bottom > 0) {
            const scrollableDist = rect.height - window.innerHeight;
            if (scrollableDist > 0) {
              const progress = Math.min(1, Math.max(0, -rect.top / scrollableDist));
              if (progress < 0.35) darkness = 0;
              else if (progress <= 0.75) darkness = (progress - 0.35) / 0.4;
              else darkness = 1;
            }
          }
        }

        // 3. Services section
        if (services) {
          const cRect = services.getBoundingClientRect();
          if (cRect.top <= 60 && cRect.bottom > 0) {
            darkness = 1;
          }
        }

        // 4. Stack section
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

        // Throttled state updates to prevent re-render thrashing
        const roundedDarkness = Math.round(darkness * 5) / 5;
        if (Math.abs(roundedDarkness - darknessRef.current) >= 0.2) {
          darknessRef.current = roundedDarkness;
          setDarknessRatio(roundedDarkness);
        }

        if (headerRef.current) {
          const titleColor = lerpColor([13, 39, 68, 1], [255, 255, 255, 1], darkness);
          headerRef.current.style.setProperty("--nav-title-color", titleColor);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleNavClick = useCallback((href: string, e: React.MouseEvent) => {
    setIsOpen(false);
    if (href.startsWith("/#") && typeof window !== "undefined") {
      const targetId = href.replace("/#", "");
      if (window.location.pathname === "/") {
        e.preventDefault();
        if (targetId === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          window.history.pushState(null, "", "/");
        } else {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            window.history.pushState(null, "", `#${targetId}`);
          }
        }
      }
    }
  }, []);

  const isMobile = windowWidth < 640;
  // Constant width matching the card
  const menuWidth = isMobile ? Math.min(310, windowWidth - 32) : 310;

  return (
    <header
      ref={headerRef}
      style={{ "--nav-title-color": darknessRatio > 0.5 ? "#ffffff" : "#0d2744" } as React.CSSProperties}
      className={`fixed top-0 left-0 right-0 z-50 transition-[padding] duration-300 pointer-events-none bg-transparent ${
        isScrolled ? "py-2.5 sm:py-3.5" : "py-4 sm:py-5"
      }`}
    >
      {/* Hardware-accelerated backdrop overlay */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-black/25 backdrop-blur-[1px] transition-opacity duration-200 ease-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div className="max-w-[1320px] mx-auto px-5 sm:px-6 md:px-12 flex items-center justify-between pointer-events-auto relative">
        {/* Left: Brand Logo */}
        <div className="flex-1 flex items-center justify-start z-40">
          <a
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
              setIsOpen(false);
            }}
            className="flex items-center gap-2 group select-none cursor-pointer"
            aria-label="Danish Syazwan Portfolio Home"
          >
            <LogoIcon className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-200 group-hover:scale-105 active:scale-95 drop-shadow-sm shrink-0" />
            <span
              style={{ color: "var(--nav-title-color, #0d2744)" }}
              className="hidden xs:inline font-mono text-xs sm:text-sm md:text-[15px] font-medium tracking-tight hover:opacity-80 transition-colors drop-shadow-sm select-none"
            >
              .Syazwan
            </span>
          </a>
        </div>

        {/* Center: GPU-Accelerated Straight-Down Accordion Menu */}
        <div
          ref={menuContainerRef}
          style={{ width: menuWidth }}
          className="flex-none relative flex justify-center h-[42px] z-40"
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: isOpen ? `${openHeight}px` : "42px",
              backgroundColor: isOpen
                ? "#0b1c2e"
                : darknessRatio > 0.5
                ? "rgba(11, 28, 46, 0.75)"
                : "#eef3f9",
              borderRadius: 12,
              border: isOpen
                ? "1px solid rgba(56, 189, 248, 0.25)"
                : darknessRatio > 0.5
                ? "1px solid rgba(255, 255, 255, 0.15)"
                : "1px solid rgba(27, 76, 120, 0.15)",
              boxShadow: isOpen
                ? "0 25px 60px -15px rgba(4, 15, 28, 0.7), 0 0 20px rgba(56, 189, 248, 0.08)"
                : darknessRatio > 0.5
                ? "0 4px 20px rgba(0, 0, 0, 0.35)"
                : "0 1px 4px rgba(27, 76, 120, 0.05), 0 0 0 1px rgba(27, 76, 120, 0.08)",
              transition:
                "height 0.32s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease-out, border-color 0.2s ease, box-shadow 0.25s ease",
              willChange: "height",
              transform: "translateZ(0)",
            }}
            className="overflow-hidden backdrop-blur-md select-none"
          >
            {/* Top Row: Fixed 42px header */}
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="w-full h-[42px] px-5 sm:px-6 flex items-center justify-between cursor-pointer focus:outline-none transition-colors"
            >
              <span
                className={`font-sans text-[13px] sm:text-[14px] font-medium tracking-tight transition-colors duration-200 ${
                  isOpen
                    ? "text-[#ddeaf5]"
                    : darknessRatio > 0.5
                    ? "text-white"
                    : "text-[#0d2744]"
                }`}
              >
                Menu
              </span>

              {/* Two Lines: 100% GPU transform rotation */}
              <div className="w-6 h-5 relative flex items-center justify-center pointer-events-none">
                <span
                  style={{
                    transform: isOpen ? "rotate(45deg) translateY(0)" : "rotate(0deg) translateY(-3.5px)",
                    backgroundColor: isOpen
                      ? "#38bdf8"
                      : darknessRatio > 0.5
                      ? "#ffffff"
                      : "#0d2744",
                    transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease",
                  }}
                  className="absolute w-5 h-[1.5px] rounded-full will-change-transform"
                />
                <span
                  style={{
                    transform: isOpen ? "rotate(-45deg) translateY(0)" : "rotate(0deg) translateY(3.5px)",
                    backgroundColor: isOpen
                      ? "#38bdf8"
                      : darknessRatio > 0.5
                      ? "#ffffff"
                      : "#0d2744",
                  }}
                  className="absolute w-5 h-[1.5px] rounded-full will-change-transform"
                />
              </div>
            </button>

            {/* Expanded Content: Hardware-accelerated reveal */}
            <div
              ref={contentRef}
              className={`transition-opacity duration-200 border-t border-[#1e456d]/50 ${
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Navigation Links: Flushed left to vertically align with "Menu" */}
              <div className="flex flex-col py-1">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(item.href, e)}
                    className="group relative flex items-center px-5 sm:px-6 py-3.5 sm:py-4 border-b border-[#1e456d]/30 hover:bg-[#102d4a]/40 transition-colors duration-150"
                  >
                    {/* 3D Spinning Cube: 0 width when idle (aligned with Menu), expands & pushes text on hover */}
                    <div className="w-0 opacity-0 group-hover:w-3.5 group-hover:mr-2 group-hover:opacity-100 overflow-visible flex items-center justify-center transition-all duration-200 ease-out shrink-0 pointer-events-none">
                      <div className="w-2.5 h-2.5 relative [perspective:140px]">
                        <div className="w-2.5 h-2.5 relative cube-3d-spin">
                          {/* 6 faces of the 3D rotating cube */}
                          <span className="absolute inset-0 border border-[#38bdf8] bg-[#38bdf8]/30 shadow-[0_0_6px_rgba(56,189,248,0.4)] [transform:translateZ(5px)]" />
                          <span className="absolute inset-0 border border-[#38bdf8] bg-[#38bdf8]/30 shadow-[0_0_6px_rgba(56,189,248,0.4)] [transform:rotateY(180deg)_translateZ(5px)]" />
                          <span className="absolute inset-0 border border-[#38bdf8] bg-[#38bdf8]/30 shadow-[0_0_6px_rgba(56,189,248,0.4)] [transform:rotateY(90deg)_translateZ(5px)]" />
                          <span className="absolute inset-0 border border-[#38bdf8] bg-[#38bdf8]/30 shadow-[0_0_6px_rgba(56,189,248,0.4)] [transform:rotateY(-90deg)_translateZ(5px)]" />
                          <span className="absolute inset-0 border border-[#38bdf8] bg-[#38bdf8]/30 shadow-[0_0_6px_rgba(56,189,248,0.4)] [transform:rotateX(90deg)_translateZ(5px)]" />
                          <span className="absolute inset-0 border border-[#38bdf8] bg-[#38bdf8]/30 shadow-[0_0_6px_rgba(56,189,248,0.4)] [transform:rotateX(-90deg)_translateZ(5px)]" />
                        </div>
                      </div>
                    </div>

                    {/* Navigation text starts flush with Menu when idle, pushed right when cube appears */}
                    <span className="font-sans text-[14.5px] sm:text-[15px] tracking-tight text-[#ddeaf5]/90 group-hover:text-white font-normal group-hover:font-medium transition-colors duration-150">
                      {item.label}
                    </span>
                  </a>
                ))}
              </div>

              {/* Secondary info & contact links: aligned flush on px-5 sm:px-6 */}
              <div className="px-5 sm:px-6 pt-3.5 pb-4 flex flex-col gap-2 border-t border-[#1e456d]/40">
                <a
                  href="mailto:danish.syazwan2005@gmail.com"
                  className="font-sans text-[12.5px] text-[#ddeaf5]/70 hover:text-white flex items-center justify-between transition-colors group"
                >
                  <span>danish.syazwan2005@gmail.com</span>
                  <ArrowUpRight className="w-3 h-3 text-[#38bdf8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href="https://github.com/dnishsyzwn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[12.5px] text-[#ddeaf5]/70 hover:text-white flex items-center justify-between transition-colors group"
                >
                  <span>github.com/dnishsyzwn</span>
                  <ArrowUpRight className="w-3 h-3 text-[#38bdf8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Let's Talk CTA */}
        <div className="flex-1 flex items-center justify-end z-40">
          <a
            href="/contact"
            onClick={() => setIsOpen(false)}
            style={{ color: "var(--nav-title-color, #0d2744)" }}
            className="font-sans text-xs sm:text-sm font-medium tracking-tight hover:opacity-80 transition-colors flex items-center gap-1 group drop-shadow-sm select-none"
          >
            <span>Let&apos;s Talk</span>
          </a>
        </div>
      </div>
    </header>
  );
}
