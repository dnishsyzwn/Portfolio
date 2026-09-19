"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  MotionValue,
} from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────
   Each project: label (small mono caps), an image/visual, and a serif title.
   Inspired by landonorris.com — stripped of all badge/metric chrome.
───────────────────────────────────────────────────────────────────────── */
interface ProjectItem {
  title: string;
  description: string;
  image?: string;
  bg?: string;
  visual?: string;
  overlay?: string;
}

const projects: ProjectItem[] = [
  {
    title: "Syncuid",
    description:
      "A collaborative project discovery network empowering game developers, artists, and creators to showcase builds, recruit contributors, and coordinate cross-disciplinary teams.",
    image: "/syncuid.png",
    bg: "#111215",
  },
  {
    title: "1Tusk",
    description:
      "An enterprise security operations and workforce management platform featuring real-time guard deployment tracking, incident logging, attendance analytics, and shift scheduling.",
    image: "/1tusk.png",
    bg: "#f8fafc",
  },
  {
    title: "GoCarry",
    description:
      "An on-demand freight logistics and lorry booking platform featuring real-time vehicle tier selection, automated route fare calculation, multi-stop pickup scheduling, and fleet dispatch.",
    image: "/gocarry.png",
    bg: "#ffffff",
  },
  {
    title: "Sabah Teachers Union (STU)",
    description:
      "The official web portal and digital services platform for Sabah's largest educators' union, featuring online membership registration, welfare claims tracking, news dispatch, and administrative resource management.",
    image: "/stu.png",
    bg: "#081b2e",
  },
];

const CARD_W      = 55;   // vw  (narrower, portrait-ish like the reference)
const GAP         = 5;    // vw
const TRACK_PAD   = 9;    // vw
const TRACK_SHIFT = (projects.length - 1) * (CARD_W + GAP);
const RUNWAY_VH   = 280;

interface WorkContentProps {
  theme: "light" | "dark";
  x: MotionValue<number>;
  trackOp: MotionValue<number>;
  trackY: MotionValue<string>;
  progressWidth: MotionValue<string>;
  headerY: MotionValue<string>;
  headerOp: MotionValue<number>;
  hoveredIdx: number | null;
  setHoveredIdx?: (idx: number | null) => void;
  trackRef?: React.RefObject<HTMLDivElement | null>;
}

function WorkContent({
  theme,
  x,
  trackOp,
  trackY,
  progressWidth,
  headerY,
  headerOp,
  hoveredIdx,
  setHoveredIdx,
  trackRef,
}: WorkContentProps) {
  const isDark = theme === "dark";

  const palette = isDark
    ? {
        bg: "bg-[#0b1c2e]",
        headerBorder: "rgba(200,225,245,0.07)",
        heading: "#cde3f4",
        subtitle: "rgba(180,210,238,0.60)",
        counter: "rgba(180,210,238,0.35)",
        cardBorder: "rgba(200,225,245,0.10)",
        title: "#f1f7fc",
        desc: "#cde2f5",
        progressTrack: "rgba(200,225,245,0.10)",
        progressFill: "rgba(157,200,232,0.65)",
        hint: "rgba(205,227,244,0.50)",
      }
    : {
        bg: "bg-white",
        headerBorder: "rgba(27,76,120,0.08)",
        heading: "#102d4a",
        subtitle: "rgba(27,76,120,0.60)",
        counter: "rgba(27,76,120,0.40)",
        cardBorder: "rgba(27,76,120,0.10)",
        title: "#102d4a",
        desc: "#1e3d5f",
        progressTrack: "rgba(27,76,120,0.10)",
        progressFill: "rgba(27,76,120,0.50)",
        hint: "rgba(27,76,120,0.50)",
      };

  return (
    <div className={`w-full h-full flex flex-col justify-between ${palette.bg}`}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <motion.header
        style={{ y: headerY, opacity: headerOp, borderBottomColor: palette.headerBorder }}
        className="flex-none flex items-end justify-between gap-6 px-8 md:px-14 pt-[72px] pb-4 border-b"
      >
        <div>
          <h2
            style={{ color: palette.heading }}
            className="font-serif font-bold text-4xl sm:text-5xl md:text-[52px] tracking-tight leading-none"
          >
            Work
          </h2>
          <p style={{ color: palette.subtitle }} className="font-sans text-sm mt-1.5">
            Selected projects — scroll to explore.
          </p>
        </div>
        <span
          style={{ color: palette.counter }}
          className="hidden md:block font-mono text-[10px] uppercase tracking-widest self-end pb-1"
        >
          01 / Selected
        </span>
      </motion.header>

      {/* ── Card track ─────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center min-h-0">
        <motion.div
          ref={trackRef}
          style={
            {
              x,
              y: trackY,
              opacity: trackOp,
              paddingLeft: `${TRACK_PAD}vw`,
              gap: `${GAP}vw`,
            } as unknown as React.CSSProperties
          }
          className="flex will-change-transform"
        >
          {projects.map((proj, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx?.(idx)}
                onMouseLeave={() => setHoveredIdx?.(null)}
                className="group flex-none flex flex-col justify-center cursor-pointer"
                style={{ width: `${CARD_W}vw`, maxWidth: "700px" }}
              >
                {/* Image / Visual */}
                <div
                  style={{
                    height: "calc(100vh - 290px)",
                    maxHeight: "430px",
                    borderColor: palette.cardBorder,
                    backgroundColor: proj.bg || "#111215",
                  }}
                  className="w-full overflow-hidden relative border"
                >
                  {proj.image ? (
                    <img
                      src={proj.image}
                      alt={proj.title}
                      loading={idx < 2 ? "eager" : "lazy"}
                      className={`w-full h-full object-cover object-left-top transition-transform duration-700 ease-out ${
                        isHovered ? "scale-[1.02]" : "scale-100"
                      }`}
                    />
                  ) : (
                    <div
                      className={`w-full h-full transition-transform duration-700 ease-out origin-center ${
                        isHovered ? "scale-[1.02]" : "scale-100"
                      }`}
                      style={{
                        background: proj.visual,
                        backgroundImage: [proj.overlay, proj.visual].join(", "),
                        backgroundSize: "cover, cover",
                        backgroundPosition: "center, center",
                      }}
                    />
                  )}
                </div>

                {/* Title */}
                <h3
                  style={{ color: palette.title }}
                  className="font-serif font-semibold text-2xl sm:text-3xl tracking-tight leading-tight mt-3.5 whitespace-pre-line"
                >
                  {proj.title}
                </h3>

                {/* Description */}
                <p
                  style={{ color: palette.desc }}
                  className="font-sans text-sm sm:text-base md:text-[16px] leading-relaxed mt-2.5 text-balance max-w-2xl font-normal"
                >
                  {proj.description}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ── Progress bar ────────────────────────────────────────────── */}
      <div className="flex-none px-8 md:px-14 pb-7 pt-3 flex items-center gap-5">
        <div
          style={{ backgroundColor: palette.progressTrack }}
          className="flex-1 h-px relative"
        >
          <motion.div
            style={{ width: progressWidth, backgroundColor: palette.progressFill }}
            className="absolute inset-y-0 left-0 origin-left"
          />
        </div>
        <motion.span
          style={{ color: palette.hint }}
          animate={{ opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="font-mono text-[10px] uppercase tracking-widest whitespace-nowrap select-none"
        >
          scroll to explore →
        </motion.span>
      </div>
    </div>
  );
}

export default function WorkSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const [maxShift, setMaxShift] = useState(() => {
    if (typeof window !== "undefined") {
      const vw = window.innerWidth;
      const cardW = Math.min(vw * (CARD_W / 100), 700);
      const gap = vw * (GAP / 100);
      const pad = vw * (TRACK_PAD / 100);
      const total = pad + projects.length * cardW + (projects.length - 1) * gap;
      return Math.max(0, total - vw + pad);
    }
    return 1200;
  });

  useEffect(() => {
    const updateShift = () => {
      if (!trackRef.current) return;
      const totalWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const pad = viewportWidth * (TRACK_PAD / 100);
      const shift = Math.max(0, totalWidth - viewportWidth + pad);
      setMaxShift(shift);
    };

    updateShift();
    window.addEventListener("resize", updateShift);
    return () => window.removeEventListener("resize", updateShift);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Horizontal drift — smoothly translates only by the exact distance needed to
  // bring Work 4 into view with matching padding, eliminating dead scroll space.
  const x = useTransform(scrollYProgress, (p) => {
    if (p <= 0.14) return 0;
    const progress = Math.min(1, Math.max(0, (p - 0.14) / (0.92 - 0.14)));
    return -progress * maxShift;
  });

  // Slow and smooth entrance fade-in
  const trackOp = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const trackY  = useTransform(scrollYProgress, [0, 0.15], ["28px", "0px"]);

  const progressWidth = useTransform(scrollYProgress, [0.14, 0.92], ["0%", "100%"]);
  const headerY       = useTransform(scrollYProgress, [0, 0.12], ["16px", "0px"]);
  const headerOp      = useTransform(scrollYProgress, [0, 0.10], [0, 1]);

  // ── Bubble trajectory and expansion ─────────────────────────────────
  // A solid blue bubble (#0b1c2e) enters slowly from the bottom-right as we scroll.
  // Starts offscreen and glides in gently after the works smoothly materialize.
  const bubbleX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.38, 0.66, 0.88, 1],
    [130, 112, 90, 68, 50, 50]
  );
  const bubbleY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.38, 0.66, 0.88, 1],
    [92, 85, 75, 60, 50, 50]
  );
  const bubbleR = useTransform(
    scrollYProgress,
    [0, 0.15, 0.38, 0.66, 0.88, 1],
    [15, 22, 38, 62, 125, 140]
  );
  const bubbleDiam = useTransform(bubbleR, (r) => r * 2);
  const bubbleBorderOp = useTransform(
    scrollYProgress,
    [0, 0.12, 0.20, 0.82, 0.90],
    [0, 0, 1, 1, 0]
  );

  const clipPath = useMotionTemplate`circle(${bubbleR}vmax at ${bubbleX}% ${bubbleY}%)`;

  return (
    <section id="work" className="relative">
      {/* ── Mobile Layout (Natural Vertical Scroll) ── */}
      <div className="block md:hidden bg-white text-[#102d4a] py-14 border-t border-[#1b4c78]/10">
        {/* Mobile Header */}
        <div className="px-6 sm:px-8 pb-6 border-b border-[#1b4c78]/10 flex items-end justify-between">
          <div>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#102d4a] tracking-tight leading-none">
              Work
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#1b4c78]/70 mt-1.5">
              Selected projects &amp; systems architecture.
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#1b4c78]/50 pb-0.5">
            01 / Selected
          </span>
        </div>

        {/* Mobile Project Cards List */}
        <div className="px-5 sm:px-8 pt-8 flex flex-col gap-8">
          {projects.map((proj, idx) => (
            <article
              key={idx}
              className="flex flex-col rounded-2xl overflow-hidden border border-[#1b4c78]/15 bg-white shadow-[0_10px_30px_-5px_rgba(27,76,120,0.1)]"
            >
              {/* Project Screenshot / Visual */}
              <div
                className="w-full aspect-[16/10] relative overflow-hidden bg-[#111215] border-b border-[#1b4c78]/10"
                style={{ backgroundColor: proj.bg || "#111215" }}
              >
                {proj.image ? (
                  <img
                    src={proj.image}
                    alt={proj.title}
                    loading={idx < 2 ? "eager" : "lazy"}
                    className="w-full h-full object-cover object-left-top"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{
                      background: proj.visual,
                      backgroundImage: [proj.overlay, proj.visual].join(", "),
                      backgroundSize: "cover, cover",
                      backgroundPosition: "center, center",
                    }}
                  />
                )}
                {/* Index Pill */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-md border border-white/20 font-mono text-[10px] font-semibold text-white tracking-wider">
                  0{idx + 1}
                </div>
              </div>

              {/* Title & Description */}
              <div className="p-5 sm:p-6 flex flex-col gap-2">
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#102d4a] tracking-tight leading-snug">
                  {proj.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#1e3d5f]/85 leading-relaxed">
                  {proj.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ── Desktop Layout (Cinematic Pinned Horizontal Runway) ── */}
      <div
        ref={containerRef}
        className="hidden md:block relative"
        style={{ height: `${RUNWAY_VH}vh` }}
      >
        {/* ── Sticky viewport ─────────────────────────────────────────── */}
        <div className="sticky top-0 h-screen w-full overflow-hidden will-change-transform">
          {/* Base Layer: White background with deep navy text */}
          <div className="absolute inset-0">
            <WorkContent
              theme="light"
              trackRef={trackRef}
              x={x}
              trackOp={trackOp}
              trackY={trackY}
              progressWidth={progressWidth}
              headerY={headerY}
              headerOp={headerOp}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
            />
          </div>

          {/* Clipped Top Layer: Solid blue (#0b1c2e) bubble with light text */}
          <motion.div
            aria-hidden="true"
            style={{ clipPath }}
            className="absolute inset-0 pointer-events-none will-change-transform"
          >
            <WorkContent
              theme="dark"
              x={x}
              trackOp={trackOp}
              trackY={trackY}
              progressWidth={progressWidth}
              headerY={headerY}
              headerOp={headerOp}
              hoveredIdx={hoveredIdx}
            />
          </motion.div>

          {/* Subtle luminous bubble perimeter highlight while sliding */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full border border-sky-400/30 shadow-[0_0_40px_rgba(56,189,248,0.2)]"
            style={{
              left: useMotionTemplate`${bubbleX}%`,
              top: useMotionTemplate`${bubbleY}%`,
              width: useMotionTemplate`${bubbleDiam}vmax`,
              height: useMotionTemplate`${bubbleDiam}vmax`,
              x: "-50%",
              y: "-50%",
              opacity: bubbleBorderOp,
            }}
          />
        </div>
      </div>
    </section>
  );
}
