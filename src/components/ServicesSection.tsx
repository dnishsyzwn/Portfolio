"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { Layers3, ArrowUpRight } from "lucide-react";
import TopographyBackground from "./TopographyBackground";

// ── SVG Visual Centerpieces ──────────────────────────────────────────
// Precomputed rounded halftone dots to guarantee 100% server/client float parity
const HALFTONE_DOTS = (() => {
  const dots = [];
  const rows = 13;
  const cols = 13;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = 16 + c * 16;
      const y = 16 + r * 16;
      const dist = Math.hypot(x - 36, y - 108);
      const maxDist = 175;
      const factor = Math.max(0, 1 - dist / maxDist);
      const radius = Math.round((1.2 + factor * 5.4) * 100) / 100;
      const opacity = Math.round((0.12 + factor * 0.82) * 100) / 100;
      dots.push({ x, y, radius, opacity });
    }
  }
  return dots;
})();

function HalftoneGraphic() {
  return (
    <svg viewBox="0 0 224 224" className="w-full h-44 sm:h-52 lg:h-60 overflow-visible">
      <defs>
        <radialGradient id="halftoneGlow" cx="20%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="36" cy="108" r="85" fill="url(#halftoneGlow)" />
      {HALFTONE_DOTS.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.radius}
          fill="#38bdf8"
          opacity={d.opacity}
        />
      ))}
    </svg>
  );
}

function TelemetryGraphic() {
  return (
    <svg viewBox="0 0 224 224" className="w-full h-44 sm:h-52 lg:h-60 overflow-visible">
      <defs>
        <linearGradient id="telemetryGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#6fa3d4" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Concentric telemetry rings */}
      <circle cx="112" cy="112" r="92" fill="none" stroke="#1e456d" strokeWidth="1" strokeDasharray="4 5" opacity="0.6" />
      <circle cx="112" cy="112" r="62" fill="none" stroke="#1e456d" strokeWidth="1" opacity="0.8" />
      <circle cx="112" cy="112" r="32" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.5" />
      {/* Telemetry vector axes */}
      <line x1="112" y1="12" x2="112" y2="212" stroke="#1e456d" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
      <line x1="12" y1="112" x2="212" y2="112" stroke="#1e456d" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
      {/* Dispatch route curve */}
      <path d="M 36 160 Q 82 52 186 86" fill="none" stroke="url(#telemetryGrad)" strokeWidth="2.5" />
      {/* Telemetry nodes */}
      <circle cx="36" cy="160" r="4" fill="#38bdf8" />
      <circle cx="112" cy="82" r="3.5" fill="#6fa3d4" />
      <circle cx="186" cy="86" r="4.5" fill="#38bdf8" />
      <circle cx="186" cy="86" r="10" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.5" />
      {/* Telemetry data labels */}
      <text x="24" y="184" fill="#6fa3d4" fontSize="9" fontFamily="monospace" opacity="0.8">FLOW // ACTIVE</text>
      <text x="124" y="48" fill="#38bdf8" fontSize="9" fontFamily="monospace" opacity="0.9">RELAY_COORDINATE</text>
    </svg>
  );
}

function KineticMeshGraphic() {
  return (
    <svg viewBox="0 0 224 224" className="w-full h-44 sm:h-52 lg:h-60 overflow-visible">
      <defs>
        <linearGradient id="meshGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6fa3d4" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6fa3d4" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Kinetic oscillation sine waves */}
      <path d="M 14 76 Q 64 6, 112 76 T 210 76" fill="none" stroke="url(#meshGrad)" strokeWidth="1.8" />
      <path d="M 14 100 Q 64 30, 112 100 T 210 100" fill="none" stroke="url(#meshGrad)" strokeWidth="2.2" opacity="0.9" />
      <path d="M 14 124 Q 64 54, 112 124 T 210 124" fill="none" stroke="url(#meshGrad)" strokeWidth="1.8" opacity="0.6" />
      <path d="M 14 148 Q 64 78, 112 148 T 210 148" fill="none" stroke="url(#meshGrad)" strokeWidth="1.2" opacity="0.3" />
      {/* Physics markers */}
      <line x1="24" y1="20" x2="24" y2="204" stroke="#1e456d" strokeWidth="1" opacity="0.4" />
      <line x1="24" y1="204" x2="204" y2="204" stroke="#1e456d" strokeWidth="1" opacity="0.4" />
      <circle cx="112" cy="100" r="4" fill="#38bdf8" />
      <circle cx="112" cy="100" r="10" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
      <text x="34" y="196" fill="#9dbfd9" fontSize="9" fontFamily="monospace" opacity="0.8">INTERACTION // 60 FPS</text>
    </svg>
  );
}

interface ServiceCardData {
  number: string;
  tag: string;
  title: string;
  description: string;
  capabilities: string[];
  graphic: React.ReactNode;
}

const serviceCards: ServiceCardData[] = [
  {
    number: "01",
    tag: "Web Apps & SaaS",
    title: "Full-Stack Web Applications & SaaS Platforms",
    description:
      "Architecting end-to-end web applications, scalable SaaS platforms, and reactive user interfaces designed for mission-critical reliability, seamless user experiences, and sustainable growth.",
    capabilities: ["SaaS Architecture", "Custom Web Apps", "API Integrations", "Database Modeling"],
    graphic: <HalftoneGraphic />,
  },
  {
    number: "02",
    tag: "Enterprise & Operations",
    title: "Operational Dashboards & Logistics Systems",
    description:
      "Engineering centralized operations portals, fleet booking engines, and logistics management platforms designed to coordinate live deployments, dispatch routing, and high-concurrency workflows.",
    capabilities: ["Operations Portals", "Fleet Dispatch", "Live Telemetry", "Workflow Automation"],
    graphic: <TelemetryGraphic />,
  },
  {
    number: "03",
    tag: "Editorial & Interaction",
    title: "High-Performance Landing Pages & Portals",
    description:
      "Crafting bespoke digital showcases, interactive web experiences, and high-impact landing pages engineered with fluid motion physics, responsive layout systems, and sub-second load speeds.",
    capabilities: ["Interactive Design", "Editorial Portals", "Kinetic Animation", "Speed & SEO"],
    graphic: <KineticMeshGraphic />,
  },
];

const RUNWAY_VH = 185;

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ── Hint Badge Opacity (fades as cards deal) ───────────────────────
  const hintOpacity = useTransform(scrollYProgress, [0.03, 0.18], [1, 0]);
  const hintY       = useTransform(scrollYProgress, [0.03, 0.18], [0, -12]);

  // ── Card Break Transforms (0.08 → 0.68) ───────────────────────────
  // Card 1: Translates right from center (calc(100% + 24px)) to left (0%), subtle -2.2deg tilt
  const x1Val = useTransform(scrollYProgress, [0.08, 0.68], [100, 0]);
  const x1Px  = useTransform(scrollYProgress, [0.08, 0.68], [24, 0]);
  const card1X = useMotionTemplate`calc(${x1Val}% + ${x1Px}px)`;
  const card1Rotate = useTransform(scrollYProgress, [0.08, 0.68], [-2.2, 0]);

  // Card 2: Remains in center column, subtle +1deg tilt
  const card2Rotate = useTransform(scrollYProgress, [0.08, 0.68], [1.0, 0]);

  // Card 3: Translates left from center (calc(-100% - 24px)) to right (0%), subtle +2.8deg tilt
  const x3Val = useTransform(scrollYProgress, [0.08, 0.68], [-100, 0]);
  const x3Px  = useTransform(scrollYProgress, [0.08, 0.68], [-24, 0]);
  const card3X = useMotionTemplate`calc(${x3Val}% + ${x3Px}px)`;
  const card3Rotate = useTransform(scrollYProgress, [0.08, 0.68], [2.8, 0]);

  // Mobile vertical cascade
  const card1YMobile = useTransform(scrollYProgress, [0.08, 0.68], [140, 0]);
  const card3YMobile = useTransform(scrollYProgress, [0.08, 0.68], [-140, 0]);

  // Hairline progress bar: fills to 100% at 0.85
  const progressWidth = useTransform(scrollYProgress, [0.05, 0.85], ["0%", "100%"]);

  return (
    <div
      ref={containerRef}
      id="services"
      className="relative bg-[#0b1c2e]"
      style={{ height: `${RUNWAY_VH}vh` }}
    >
      {/* Anchor alias so previous #curriculum or #services both scroll here */}
      <div id="curriculum" className="absolute top-0 left-0" aria-hidden="true" />

      {/* ── Sticky Viewport ─────────────────────────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between bg-[#0b1c2e] text-[#ddeaf5] border-t border-[#1e456d]/40">
        
        {/* Subtle Topography Contour Background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-screen scale-110">
          <TopographyBackground />
        </div>

        {/* ── STAGE CONTAINER: Left Editorial Column + Right 3-Card Stage ─── */}
        <div className="relative z-10 flex-1 max-w-[1560px] mx-auto w-full px-6 md:px-10 lg:px-12 pt-[68px] pb-3 flex flex-col lg:flex-row gap-6 lg:gap-10 xl:gap-12 items-center justify-between min-h-0">
          
          {/* ── LEFT EDITORIAL COLUMN ───────────────────────────────────── */}
          <div className="w-full lg:w-[300px] xl:w-[340px] shrink-0 flex flex-col justify-between self-stretch py-3">
            {/* Top Area: Clearly Highlighting Services */}
            <div>
              <div className="mb-3.5">
                <span className="font-mono font-bold text-base sm:text-lg lg:text-xl text-[#38bdf8] tracking-[0.14em] uppercase block">
                  MY SERVICES &amp; CAPABILITIES
                </span>
              </div>

              <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] text-[#ddeaf5] tracking-tight leading-[1.08]">
                From system<br />
                architecture<br />
                to production
              </h2>

              {/* Deal Prompt Micro-Badge */}
              <motion.div
                style={{ opacity: hintOpacity, y: hintY }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#132f4c]/80 border border-[#38bdf8]/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md mt-6"
              >
                <Layers3 className="w-3.5 h-3.5 text-[#38bdf8] animate-pulse" />
                <span className="font-mono text-[10px] text-[#9dbfd9] tracking-widest uppercase">
                  3 Core Services • Scroll To Deal
                </span>
              </motion.div>

              {/* Mobile CTA Button */}
              <div className="mt-4 lg:hidden">
                <a
                  href="/contact"
                  className="group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#132f4c]/90 hover:bg-[#193c62] border border-[#38bdf8]/40 hover:border-[#38bdf8] text-[#ddeaf5] hover:text-white font-sans text-xs font-medium transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                >
                  <span>Need a system built? contact me</span>
                  <span className="w-4 h-4 rounded-full bg-[#38bdf8]/15 group-hover:bg-[#38bdf8] flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-3 h-3 text-[#38bdf8] group-hover:text-[#0b1c2e] transition-colors" />
                  </span>
                </a>
              </div>
            </div>

            {/* Bottom Descriptor & Desktop CTA Button */}
            <div className="hidden lg:flex flex-col gap-4 pt-6 border-t border-[#1e456d]/30">
              <p className="font-sans text-xs sm:text-[13px] text-[#9dbfd9]/80 leading-relaxed max-w-[260px]">
                A comprehensive suite of engineering services to take your product from architectural blueprint to production-grade deployment.
              </p>
              <div>
                <a
                  href="/contact"
                  className="group relative inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#132f4c]/80 hover:bg-[#193c62] border border-[#38bdf8]/40 hover:border-[#38bdf8] text-[#ddeaf5] hover:text-white font-sans text-xs sm:text-[13px] font-medium tracking-wide transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.35),0_0_15px_rgba(56,189,248,0.1)] hover:shadow-[0_4px_25px_rgba(56,189,248,0.25)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Need a system built? contact me</span>
                  <span className="w-5 h-5 rounded-full bg-[#38bdf8]/15 group-hover:bg-[#38bdf8] flex items-center justify-center transition-all duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#38bdf8] group-hover:text-[#0b1c2e] transition-colors duration-300" />
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* ── RIGHT CARDS STAGE: Larger 3-Card Deck with Scroll Break ── */}
          <div className="flex-1 min-w-0 w-full h-full flex items-center justify-center relative">
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch relative">
              
              {/* ── CARD 01 (Web Applications & SaaS) ──────────────────── */}
              <motion.div
                style={{
                  x: isMounted && isMobile ? 0 : card1X,
                  y: isMounted && isMobile ? card1YMobile : 0,
                  rotate: card1Rotate,
                }}
                className="z-30 will-change-transform transform-gpu group relative rounded-[32px] bg-gradient-to-b from-[#132f4e]/95 via-[#0e243a]/95 to-[#091a2b] border border-[#1e456d]/75 hover:border-[#38bdf8]/60 p-7 sm:p-8 lg:p-8 flex flex-col justify-between transition-[border-color,box-shadow] duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_30px_rgba(56,189,248,0.1)] h-[70vh] min-h-[540px] max-h-[660px]"
              >
                {/* Top: Clear Service Number & Category */}
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#163a5f]/60 border border-[#38bdf8]/30">
                    <span className="font-mono text-[9px] text-[#6fa3d4] uppercase tracking-wider">SERVICE</span>
                    <span className="font-mono text-xs font-bold text-[#38bdf8]">/{serviceCards[0].number}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#9dbfd9]/70 uppercase tracking-widest font-medium">
                    {serviceCards[0].tag}
                  </span>
                </div>

                {/* Middle: Halftone Graphic */}
                <div className="my-auto py-4 flex items-center justify-center">
                  {serviceCards[0].graphic}
                </div>

                {/* Bottom: Title, Description & Capabilities */}
                <div>
                  <h3 className="font-sans font-bold text-xl lg:text-[22px] text-[#ddeaf5] tracking-tight group-hover:text-white transition-colors leading-snug mb-2.5">
                    {serviceCards[0].title}
                  </h3>
                  <p className="font-sans text-xs sm:text-[13px] text-[#9dbfd9]/85 leading-relaxed">
                    {serviceCards[0].description}
                  </p>
                  <div className="mt-4 pt-3.5 border-t border-[#1e456d]/40 flex flex-wrap gap-1.5">
                    {serviceCards[0].capabilities.map((item) => (
                      <span
                        key={item}
                        className="font-mono text-[10px] px-2.5 py-0.5 rounded bg-[#163554]/70 text-[#9dbfd9] border border-[#1e456d]/50"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ── CARD 02 (Operational Dashboards & Logistics) ────────── */}
              <motion.div
                style={{
                  rotate: card2Rotate,
                }}
                className="z-20 will-change-transform transform-gpu group relative rounded-[32px] bg-gradient-to-b from-[#112946]/95 via-[#0d2136]/95 to-[#081827] border border-[#1e456d]/75 hover:border-[#38bdf8]/60 p-7 sm:p-8 lg:p-8 flex flex-col justify-between transition-[border-color,box-shadow] duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_30px_rgba(56,189,248,0.1)] h-[70vh] min-h-[540px] max-h-[660px]"
              >
                {/* Top: Clear Service Number & Category */}
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#163a5f]/60 border border-[#38bdf8]/30">
                    <span className="font-mono text-[9px] text-[#6fa3d4] uppercase tracking-wider">SERVICE</span>
                    <span className="font-mono text-xs font-bold text-[#38bdf8]">/{serviceCards[1].number}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#9dbfd9]/70 uppercase tracking-widest font-medium">
                    {serviceCards[1].tag}
                  </span>
                </div>

                {/* Middle: Telemetry Graphic */}
                <div className="my-auto py-4 flex items-center justify-center">
                  {serviceCards[1].graphic}
                </div>

                {/* Bottom: Title, Description & Capabilities */}
                <div>
                  <h3 className="font-sans font-bold text-xl lg:text-[22px] text-[#ddeaf5] tracking-tight group-hover:text-white transition-colors leading-snug mb-2.5">
                    {serviceCards[1].title}
                  </h3>
                  <p className="font-sans text-xs sm:text-[13px] text-[#9dbfd9]/85 leading-relaxed">
                    {serviceCards[1].description}
                  </p>
                  <div className="mt-4 pt-3.5 border-t border-[#1e456d]/40 flex flex-wrap gap-1.5">
                    {serviceCards[1].capabilities.map((item) => (
                      <span
                        key={item}
                        className="font-mono text-[10px] px-2.5 py-0.5 rounded bg-[#163554]/70 text-[#9dbfd9] border border-[#1e456d]/50"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ── CARD 03 (High-Performance Landing Pages & Portals) ───── */}
              <motion.div
                style={{
                  x: isMounted && isMobile ? 0 : card3X,
                  y: isMounted && isMobile ? card3YMobile : 0,
                  rotate: card3Rotate,
                }}
                className="z-10 will-change-transform transform-gpu group relative rounded-[32px] bg-gradient-to-b from-[#0f243d]/95 via-[#0b1c2d]/95 to-[#071523] border border-[#1e456d]/75 hover:border-[#38bdf8]/60 p-7 sm:p-8 lg:p-8 flex flex-col justify-between transition-[border-color,box-shadow] duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_30px_rgba(56,189,248,0.1)] h-[70vh] min-h-[540px] max-h-[660px]"
              >
                {/* Top: Clear Service Number & Category */}
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#163a5f]/60 border border-[#38bdf8]/30">
                    <span className="font-mono text-[9px] text-[#6fa3d4] uppercase tracking-wider">SERVICE</span>
                    <span className="font-mono text-xs font-bold text-[#38bdf8]">/{serviceCards[2].number}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#9dbfd9]/70 uppercase tracking-widest font-medium">
                    {serviceCards[2].tag}
                  </span>
                </div>

                {/* Middle: Kinetic Mesh Graphic */}
                <div className="my-auto py-4 flex items-center justify-center">
                  {serviceCards[2].graphic}
                </div>

                {/* Bottom: Title, Description & Capabilities */}
                <div>
                  <h3 className="font-sans font-bold text-xl lg:text-[22px] text-[#ddeaf5] tracking-tight group-hover:text-white transition-colors leading-snug mb-2.5">
                    {serviceCards[2].title}
                  </h3>
                  <p className="font-sans text-xs sm:text-[13px] text-[#9dbfd9]/85 leading-relaxed">
                    {serviceCards[2].description}
                  </p>
                  <div className="mt-4 pt-3.5 border-t border-[#1e456d]/40 flex flex-wrap gap-1.5">
                    {serviceCards[2].capabilities.map((item) => (
                      <span
                        key={item}
                        className="font-mono text-[10px] px-2.5 py-0.5 rounded bg-[#163554]/70 text-[#9dbfd9] border border-[#1e456d]/50"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

        </div>

        {/* ── FOOTER / PROGRESS BAR ──────────────────────────────────── */}
        <footer className="relative z-20 flex-none px-6 md:px-10 lg:px-12 py-3 max-w-[1560px] mx-auto w-full flex items-center justify-between gap-4 border-t border-[#1e456d]/30 bg-[#0b1c2e]/90 backdrop-blur-sm">
          <span className="font-mono text-[10px] text-[#6fa3d4]/80 uppercase tracking-widest">
            02 // SERVICES OVERVIEW
          </span>

          {/* Hairline Progress Bar */}
          <div className="flex items-center gap-4 w-full sm:w-auto flex-1 sm:max-w-xs justify-end">
            <div className="flex-1 h-px bg-[#1e456d]/50 relative overflow-hidden rounded-full max-w-[160px]">
              <motion.div
                style={{ width: progressWidth }}
                className="h-full bg-gradient-to-r from-[#6fa3d4] to-[#38bdf8] origin-left"
              />
            </div>
            <span className="font-mono text-[9px] text-[#6fa3d4] uppercase tracking-widest whitespace-nowrap">
              scroll to explore →
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
