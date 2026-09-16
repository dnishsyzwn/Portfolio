"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────
   Each project: label (small mono caps), an image/visual, and a serif title.
   Inspired by landonorris.com — stripped of all badge/metric chrome.
───────────────────────────────────────────────────────────────────────── */
const projects = [
  {
    label: "Full-Stack Architecture, 2026",
    title: "Distributed Real-Time\nCollaborative Canvas",
    // CSS gradient that evokes a canvas / WebGL render surface
    visual: `
      radial-gradient(ellipse 80% 60% at 30% 40%, rgba(99,160,220,0.35) 0%, transparent 70%),
      radial-gradient(ellipse 60% 80% at 70% 70%, rgba(50,100,180,0.25) 0%, transparent 65%),
      linear-gradient(135deg, #0a1628 0%, #0e2040 40%, #122850 70%, #0d1c36 100%)
    `,
    // Subtle "nodes & lines" overlay drawn via SVG data URI
    overlay: `url("data:image/svg+xml,%3Csvg width='600' height='500' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='120' cy='180' r='4' fill='rgba(120,190,240,0.35)'/%3E%3Ccircle cx='300' cy='120' r='6' fill='rgba(120,190,240,0.3)'/%3E%3Ccircle cx='480' cy='200' r='4' fill='rgba(120,190,240,0.25)'/%3E%3Ccircle cx='200' cy='320' r='3' fill='rgba(120,190,240,0.2)'/%3E%3Ccircle cx='400' cy='360' r='5' fill='rgba(120,190,240,0.3)'/%3E%3Cline x1='120' y1='180' x2='300' y2='120' stroke='rgba(120,190,240,0.15)' stroke-width='1'/%3E%3Cline x1='300' y1='120' x2='480' y2='200' stroke='rgba(120,190,240,0.15)' stroke-width='1'/%3E%3Cline x1='200' y1='320' x2='400' y2='360' stroke='rgba(120,190,240,0.12)' stroke-width='1'/%3E%3Cline x1='120' y1='180' x2='200' y2='320' stroke='rgba(120,190,240,0.10)' stroke-width='1'/%3E%3Cline x1='480' y1='200' x2='400' y2='360' stroke='rgba(120,190,240,0.10)' stroke-width='1'/%3E%3C/svg%3E")`,
  },
  {
    label: "Cloud & Distributed Systems, 2025",
    title: "Autonomous Microservices\nOrchestrator",
    visual: `
      radial-gradient(ellipse 70% 50% at 60% 35%, rgba(70,140,200,0.3) 0%, transparent 65%),
      radial-gradient(ellipse 50% 70% at 25% 65%, rgba(30,80,160,0.22) 0%, transparent 60%),
      linear-gradient(160deg, #071520 0%, #0c2035 45%, #0f2845 75%, #091828 100%)
    `,
    overlay: `url("data:image/svg+xml,%3Csvg width='600' height='500' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='60' y='80' width='90' height='55' rx='4' fill='none' stroke='rgba(100,170,230,0.2)' stroke-width='1'/%3E%3Crect x='240' y='60' width='90' height='55' rx='4' fill='none' stroke='rgba(100,170,230,0.18)' stroke-width='1'/%3E%3Crect x='420' y='90' width='90' height='55' rx='4' fill='none' stroke='rgba(100,170,230,0.15)' stroke-width='1'/%3E%3Crect x='160' y='260' width='90' height='55' rx='4' fill='none' stroke='rgba(100,170,230,0.18)' stroke-width='1'/%3E%3Crect x='340' y='270' width='90' height='55' rx='4' fill='none' stroke='rgba(100,170,230,0.15)' stroke-width='1'/%3E%3Cline x1='105' y1='135' x2='240' y2='115' stroke='rgba(100,170,230,0.12)' stroke-width='1'/%3E%3Cline x1='330' y1='115' x2='420' y2='118' stroke='rgba(100,170,230,0.10)' stroke-width='1'/%3E%3Cline x1='285' y1='115' x2='205' y2='260' stroke='rgba(100,170,230,0.10)' stroke-width='1'/%3E%3Cline x1='285' y1='115' x2='385' y2='270' stroke='rgba(100,170,230,0.08)' stroke-width='1'/%3E%3C/svg%3E")`,
  },
  {
    label: "High-Volume Transaction Engine, 2025",
    title: "Fintech Real-Time\nAudit Ledger",
    visual: `
      radial-gradient(ellipse 65% 55% at 50% 30%, rgba(40,120,180,0.28) 0%, transparent 65%),
      radial-gradient(ellipse 80% 40% at 20% 80%, rgba(20,70,140,0.2) 0%, transparent 60%),
      linear-gradient(150deg, #060f1e 0%, #091828 40%, #0d2238 70%, #071220 100%)
    `,
    overlay: `url("data:image/svg+xml,%3Csvg width='600' height='500' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='40,380 120,280 200,310 280,200 360,240 440,140 560,180' fill='none' stroke='rgba(100,200,180,0.25)' stroke-width='1.5'/%3E%3Cpolyline points='40,420 120,360 200,380 280,300 360,330 440,250 560,270' fill='none' stroke='rgba(100,180,200,0.15)' stroke-width='1'/%3E%3Ccircle cx='280' cy='200' r='5' fill='rgba(100,220,180,0.4)'/%3E%3Ccircle cx='440' cy='140' r='4' fill='rgba(100,220,180,0.3)'/%3E%3C/svg%3E")`,
  },
  {
    label: "Creative Frontend & DevTools, 2026",
    title: "Generative UI & Design\nEngineering Studio",
    visual: `
      radial-gradient(ellipse 75% 60% at 40% 45%, rgba(110,80,200,0.22) 0%, transparent 65%),
      radial-gradient(ellipse 55% 75% at 75% 60%, rgba(60,100,200,0.2) 0%, transparent 60%),
      linear-gradient(140deg, #09101e 0%, #0d1830 45%, #121f3e 70%, #080f1c 100%)
    `,
    overlay: `url("data:image/svg+xml,%3Csvg width='600' height='500' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='50' y='100' width='200' height='140' rx='6' fill='none' stroke='rgba(150,120,240,0.2)' stroke-width='1'/%3E%3Crect x='290' y='80' width='160' height='100' rx='6' fill='none' stroke='rgba(120,150,240,0.18)' stroke-width='1'/%3E%3Crect x='290' y='210' width='160' height='80' rx='6' fill='none' stroke='rgba(120,150,240,0.15)' stroke-width='1'/%3E%3Crect x='80' y='300' width='120' height='80' rx='4' fill='none' stroke='rgba(150,120,240,0.15)' stroke-width='1'/%3E%3Crect x='220' y='310' width='40' height='40' rx='4' fill='rgba(150,120,240,0.08)'/%3E%3C/svg%3E")`,
  },
];

const CARD_W      = 55;   // vw  (narrower, portrait-ish like the reference)
const GAP         = 5;    // vw
const TRACK_PAD   = 9;    // vw
const TRACK_SHIFT = (projects.length - 1) * (CARD_W + GAP); // 240vw
const RUNWAY_VH   = 420;

export default function WorkSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Horizontal slide — burst in from right, then drift left
  const x = useTransform(
    scrollYProgress,
    [0,      0.12,   0.95],
    ["75vw", "0vw",  `-${TRACK_SHIFT}vw`]
  );

  // ── Color inversion (10% → 75% of runway) ──────────────────────────
  const cp = useTransform(scrollYProgress, [0.08, 0.72], [0, 1]);

  const sectionBg    = useTransform(cp, [0, 1], ["#ffffff",               "#0b1c2e"]);
  const borderColor  = useTransform(cp, [0, 1], ["rgba(27,76,120,0.08)",  "rgba(200,225,245,0.07)"]);
  const headingColor = useTransform(cp, [0, 1], ["#1b4c78",               "#cde3f4"]);
  const subtitleCol  = useTransform(cp, [0, 1], ["rgba(27,76,120,0.50)",  "rgba(180,210,238,0.45)"]);
  const counterCol   = useTransform(cp, [0, 1], ["rgba(27,76,120,0.32)",  "rgba(180,210,238,0.28)"]);

  const labelColor   = useTransform(cp, [0, 1], ["rgba(27,76,120,0.45)",  "rgba(180,210,238,0.45)"]);
  const titleColor   = useTransform(cp, [0, 1], ["#1b4c78",               "#ddeaf5"]);

  const progressTrack = useTransform(cp, [0, 1], ["rgba(27,76,120,0.10)", "rgba(200,225,245,0.08)"]);
  const progressFill  = useTransform(cp, [0, 1], ["rgba(27,76,120,0.40)", "rgba(157,200,232,0.55)"]);
  const hintColor     = useTransform(cp, [0, 1], ["rgba(27,76,120,0.38)", "rgba(180,210,238,0.35)"]);

  const progressWidth = useTransform(scrollYProgress, [0.12, 0.95], ["0%", "100%"]);
  const headerY       = useTransform(scrollYProgress, [0, 0.1],  ["12px", "0px"]);
  const headerOp      = useTransform(scrollYProgress, [0, 0.08], [0, 1]);

  return (
    <div
      ref={containerRef}
      id="work"
      className="relative"
      style={{ height: `${RUNWAY_VH}vh` }}
    >
      {/* ── Sticky viewport ─────────────────────────────────────────── */}
      <motion.div
        style={{ backgroundColor: sectionBg }}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col will-change-transform"
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.header
          style={{ y: headerY, opacity: headerOp, borderBottomColor: borderColor }}
          className="flex-none flex items-end justify-between gap-6
                     px-8 md:px-14 pt-[72px] pb-4 border-b"
        >
          <div>
            <motion.h2
              style={{ color: headingColor }}
              className="font-serif text-4xl sm:text-5xl md:text-[52px] tracking-tight leading-none"
            >
              Work
            </motion.h2>
            <motion.p style={{ color: subtitleCol }} className="font-sans text-sm mt-1.5">
              Selected projects — scroll to explore.
            </motion.p>
          </div>
          <motion.span
            style={{ color: counterCol }}
            className="hidden md:block font-mono text-[10px] uppercase tracking-widest self-end pb-1"
          >
            01 / Selected
          </motion.span>
        </motion.header>

        {/* ── Card track ─────────────────────────────────────────────── */}
        <div className="flex-1 flex items-center min-h-0">
          <motion.div
            style={
              {
                x,
                paddingLeft: `${TRACK_PAD}vw`,
                gap: `${GAP}vw`,
              } as unknown as React.CSSProperties
            }
            className="flex will-change-transform"
          >
            {projects.map((proj, idx) => (
              <div
                key={idx}
                className="group flex-none flex flex-col"
                style={{ width: `${CARD_W}vw`, maxWidth: "700px" }}
              >
                {/* Label */}
                <motion.span
                  style={{ color: labelColor }}
                  className="font-mono text-[10px] uppercase tracking-[0.18em] mb-3 block"
                >
                  {proj.label}
                </motion.span>

                {/* Image / Visual */}
                <div
                  className="w-full overflow-hidden"
                  style={{ height: "calc(100vh - 260px)", maxHeight: "480px" }}
                >
                  <div
                    className="w-full h-full transition-transform duration-700 ease-out
                               group-hover:scale-[1.02] origin-center"
                    style={{
                      background: proj.visual,
                      backgroundImage: [proj.overlay, proj.visual].join(", "),
                      backgroundSize: "cover, cover",
                      backgroundPosition: "center, center",
                    }}
                  />
                </div>

                {/* Title */}
                <motion.h3
                  style={{ color: titleColor }}
                  className="font-serif text-2xl sm:text-3xl tracking-tight leading-tight mt-4
                             whitespace-pre-line"
                >
                  {proj.title}
                </motion.h3>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Progress bar ────────────────────────────────────────────── */}
        <div className="flex-none px-8 md:px-14 pb-7 pt-3 flex items-center gap-5">
          <motion.div
            style={{ backgroundColor: progressTrack }}
            className="flex-1 h-px relative"
          >
            <motion.div
              style={{ width: progressWidth, backgroundColor: progressFill }}
              className="absolute inset-y-0 left-0 origin-left"
            />
          </motion.div>
          <motion.span
            style={{ color: hintColor }}
            animate={{ opacity: [0.4, 0.85, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="font-mono text-[10px] uppercase tracking-widest whitespace-nowrap select-none"
          >
            scroll to explore →
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}
