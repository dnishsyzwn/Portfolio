"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import RollingButtonLabel from "@/components/RollingButtonLabel";

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
    title: "AutoDetail",
    description:
      "A luxury car detailing website with a refined monochrome design, premium service presentation, and a clear booking call to action.",
    image: "/autodetail.png",
    bg: "#000000",
  },
  {
    title: "Car Rental",
    description:
      "A car rental website with a bold black-and-gold design, a prominent vehicle showcase, and clear navigation to services and contact information.",
    image: "/car-rental.png",
    bg: "#000000",
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
  catalogueActive: boolean;
  onCatalogueActive: (active: boolean) => void;
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
  catalogueActive,
  onCatalogueActive,
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
          className="hidden md:block font-sans text-xs uppercase tracking-widest self-end pb-1 font-medium"
          style={{ color: palette.subtitle }}
        >
          Featured Case Studies
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
            return (
              <div
                key={idx}
                className="group flex-none flex flex-col justify-center cursor-default"
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
                  className="w-full overflow-hidden relative border cursor-default"
                >
                  {proj.image ? (
                    <img
                      src={proj.image}
                      alt={`${proj.title} — ${proj.description}`}
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

          {/* ── 5th Item: Full Catalogue CTA Card ────────────────────────────────────── */}
          <div
            className="group flex-none flex flex-col justify-center"
            style={{ width: `${CARD_W}vw`, maxWidth: "700px" }}
          >
            <div
              style={{
                height: "calc(100vh - 290px)",
                maxHeight: "430px",
              }}
              className="w-full relative flex flex-col items-center justify-center p-8 text-center"
            >
              <h3
                style={{ color: palette.title }}
                className="font-serif font-semibold text-3xl sm:text-4xl tracking-tight mb-6"
              >
                Want to see my full catalogue?
              </h3>
              <a
                href="/catalogue"
                onMouseEnter={() => onCatalogueActive(true)}
                onMouseLeave={() => onCatalogueActive(false)}
                onFocus={() => onCatalogueActive(true)}
                onBlur={() => onCatalogueActive(false)}
                style={{ backgroundColor: catalogueActive ? (isDark ? "#a4cff0" : "#2e5189") : undefined }}
                className={`group/roll inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-sans text-sm font-medium tracking-wide transition-colors duration-300 shadow-md active:scale-[0.98] ${
                  isDark
                    ? "bg-sky-400 text-[#0b1c2e] hover:bg-[#a4cff0] focus-visible:bg-[#a4cff0] shadow-sky-400/20"
                    : "bg-[#102d4a] text-white hover:bg-[#2e5189] focus-visible:bg-[#2e5189] shadow-[#102d4a]/20"
                }`}
              >
                <RollingButtonLabel text="Click here" active={catalogueActive} />
              </a>
            </div>
            {/* Spacer title/desc for alignment with project cards */}
            <div className="h-[70px] mt-3.5" />
          </div>
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
  const reduceMotion = useReducedMotion();
  const [catalogueActive, setCatalogueActive] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
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

  // "Scroll to start" indicator at start of the work section (fades out as runway moves)
  const scrollStartOp = useTransform(scrollYProgress, [0, 0.02, 0.12, 0.18], [0.95, 1, 1, 0]);
  const scrollStartY  = useTransform(scrollYProgress, [0, 0.12, 0.18], ["0px", "0px", "-10px"]);

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
      <div className="block md:hidden bg-[#eef1f3] text-[#102d4a] py-14 border-t border-[#1b4c78]/10">
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
        <div className="px-4 sm:px-8 pt-8 flex flex-col gap-6">
          {projects.map((proj, idx) => (
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 24, filter: reduceMotion ? "blur(0px)" : "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: reduceMotion ? 0 : 0.95,
                delay: reduceMotion ? 0 : idx * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative isolate flex aspect-[16/11] min-h-[250px] flex-col justify-end overflow-hidden rounded-[4px] bg-[#102d4a] p-3 text-white shadow-[0_8px_32px_rgba(16,45,74,0.12)]"
            >
              {/* Project Screenshot / Visual */}
              <div
                className="absolute inset-0 -z-20 overflow-hidden bg-[#111215]"
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
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[65%] bg-gradient-to-t from-[#07121e]/75 via-[#07121e]/25 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[45%] [mask-image:linear-gradient(to_top,black_50%,transparent)] backdrop-blur-sm" />

              {/* Title & Description */}
              <div className="px-1 pt-12 pb-3 sm:px-3 flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-sans font-semibold text-base sm:text-xl text-white tracking-tight leading-snug">
                    {proj.title}
                  </h3>
                </div>
              </div>

            </motion.article>
          ))}

          {/* Mobile Full Catalogue CTA */}
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <h3 className="font-serif font-bold text-2xl text-[#102d4a] tracking-tight mb-4">
              Want to see my full catalogue?
            </h3>
            <a
              href="/catalogue"
              className="group/roll inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#102d4a] hover:bg-[#2e5189] focus-visible:bg-[#2e5189] text-white font-sans text-xs font-medium tracking-wide shadow-md active:scale-95 transition-colors duration-300"
            >
              <RollingButtonLabel text="Click here" />
            </a>
          </div>
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
              catalogueActive={catalogueActive}
              onCatalogueActive={setCatalogueActive}
              trackRef={trackRef}
              x={x}
              trackOp={trackOp}
              trackY={trackY}
              progressWidth={progressWidth}
              headerY={headerY}
              headerOp={headerOp}
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
              catalogueActive={catalogueActive}
              onCatalogueActive={setCatalogueActive}
              x={x}
              trackOp={trackOp}
              trackY={trackY}
              progressWidth={progressWidth}
              headerY={headerY}
              headerOp={headerOp}
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

          {/* ── "Scroll to start" Prompt (visible at start of section, fades as runway moves) ── */}
          <motion.div
            style={{ opacity: scrollStartOp, y: scrollStartY }}
            className="pointer-events-none absolute bottom-14 md:bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0b1c2e]/90 text-[#ddeaf5] backdrop-blur-md border border-sky-400/35 shadow-[0_8px_30px_rgba(4,15,28,0.35)] select-none will-change-transform"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
            </span>
            <span className="font-mono text-xs font-semibold tracking-wider uppercase text-white">
              Scroll to start
            </span>
            <span className="text-sky-300 font-sans text-xs animate-bounce">
              ↓
            </span>
          </motion.div>


        </div>
      </div>
    </section>
  );
}
