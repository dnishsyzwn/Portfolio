"use client";

import { useEffect, useRef, useState, forwardRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import TopographyBackground from "./TopographyBackground";

const WaterWave = dynamic(() => import("react-water-wave"), { ssr: false });

// Helper for shortest angle interpolation
function lerpAngle(from: number, to: number, step: number): number {
  let diff = (to - from) % 360;
  if (diff < -180) diff += 360;
  if (diff > 180) diff -= 360;
  return from + diff * step;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export default function PondHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heroViewportRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Mouse tracking inside pond viewport
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  // Scroll runway: 240vh total scroll distance
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Wavy topography contour lines reveal dynamically as hero zooms out
  const topoOpacity = useTransform(scrollYProgress, [0, 0.2, 0.75, 0.96], [0.15, 0.9, 0.8, 0.35]);
  const topoScale = useTransform(scrollYProgress, [0, 1], [0.96, 1.06]);

  // Entire hero section zooms out into the white grid background
  const heroScale = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.44, 0.38]);
  const heroRadius = useTransform(scrollYProgress, [0, 0.3], ["0px", "32px"]);
  const heroBorder = useTransform(
    scrollYProgress,
    [0, 0.25],
    ["1px solid rgba(190, 215, 235, 0)", "1px solid rgba(190, 215, 235, 0.65)"]
  );
  const heroShadow = useTransform(
    scrollYProgress,
    [0, 0.3],
    ["0 0 0 rgba(0,0,0,0)", "0 35px 90px -15px rgba(27, 76, 120, 0.25)"]
  );
  const heroOpacity = useTransform(scrollYProgress, [0, 0.68, 0.92, 1], [1, 1, 0, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.96]);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className={`relative ${isMobile ? "min-h-[100svh]" : "h-[240vh]"} w-full bg-white z-10 hidden-scrollbar`}
    >
      <div
        className={`${
          isMobile ? "relative min-h-[100svh] w-full" : "sticky top-0 h-screen w-full"
        } flex items-center justify-center overflow-hidden bg-white`}
      >
        {/* Topographic contour background — reveals as hero zooms out on desktop */}
        {!isMobile && (
          <motion.div
            style={{ opacity: topoOpacity, scale: topoScale }}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 will-change-transform"
          >
            <TopographyBackground scrollYProgress={scrollYProgress} />
          </motion.div>
        )}

        {/* The Entire Pond Hero Capsule that zooms out on scroll on desktop */}
        <motion.div
          ref={heroViewportRef}
          style={
            isMobile
              ? { scale: 1, opacity: 1 }
              : {
                  scale: heroScale,
                  borderRadius: heroRadius,
                  border: heroBorder,
                  boxShadow: heroShadow,
                  opacity: heroOpacity,
                }
          }
          className={`relative w-full ${
            isMobile ? "min-h-[100svh] bg-[#1e88e5]" : "h-full max-w-[100vw] max-h-[100vh] bg-white"
          } flex items-center justify-center overflow-hidden origin-center will-change-transform z-10`}
        >
          {/* Water Wave interactive background with toned down ripples */}
          {isMounted && (
            <WaterWave
              imageUrl="/cartoon_pond_bg.jpg"
              dropRadius={25}
              perturbance={0.01}
              resolution={isMobile ? 256 : 384}
              className="absolute inset-0 w-full h-full bg-cover bg-center filter contrast-[1.05] brightness-[1.02] saturate-[1.2]"
            >
              {() => (
                <>
                  {/* Top Atmospheric Vivid Cerulean Water Fade (Matches Reference Screenshot) */}
                  <div
                    className="absolute inset-x-0 top-0 h-[40%] pointer-events-none z-15"
                    style={{
                      background:
                        "linear-gradient(to bottom, #2581c4 0%, #2581c4 26%, rgba(37, 129, 196, 0.85) 46%, rgba(37, 129, 196, 0) 100%)",
                    }}
                  />

                  <PondInteractiveLayer
                    mouseRef={mouseRef}
                    isMobile={isMobile}
                    textScale={textScale}
                  />
                </>
              )}
            </WaterWave>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Pond Simulation Layer (Fishes + Static Natural Lily Pads + Text)
// ─────────────────────────────────────────────────────────────────────────────

interface PondInteractiveLayerProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number; active: boolean }>;
  isMobile: boolean;
  textScale: any;
}

function PondInteractiveLayer({ mouseRef, isMobile, textScale }: PondInteractiveLayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // References for live fish DOM elements (8 fishes total)
  const fishRefs = [
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
  ];

  // Mouse interaction handler on pond surface
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
  };

  const handlePointerLeave = () => {
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
    mouseRef.current.active = false;
  };

  // Run 60-120 FPS physics loop for Koi Fishes ONLY (lily pads are static)
  useEffect(() => {
    let animId: number;

    const width = containerRef.current?.clientWidth || window.innerWidth;
    const height = containerRef.current?.clientHeight || window.innerHeight;

    // 8 Koi Fishes state
    const fishes = [
      {
        id: 0,
        type: "kohaku", // Red/white classic
        x: width * 0.25,
        y: height * 0.35,
        angle: 45,
        targetAngle: 45,
        speed: 1.6,
        baseSpeed: 1.6,
        maxSpeed: 7.2,
        isFleeing: false,
        lastFleeing: false,
        fleeCooldown: 0,
        scale: 0.95,
      },
      {
        id: 1,
        type: "showa", // Calico / Tricolor
        x: width * 0.72,
        y: height * 0.28,
        angle: 210,
        targetAngle: 210,
        speed: 1.4,
        baseSpeed: 1.4,
        maxSpeed: 6.8,
        isFleeing: false,
        lastFleeing: false,
        fleeCooldown: 0,
        scale: 0.88,
      },
      {
        id: 2,
        type: "ogon", // Golden yellow
        x: width * 0.45,
        y: height * 0.65,
        angle: 320,
        targetAngle: 320,
        speed: 1.8,
        baseSpeed: 1.8,
        maxSpeed: 7.5,
        isFleeing: false,
        lastFleeing: false,
        fleeCooldown: 0,
        scale: 1.05,
      },
      {
        id: 3,
        type: "tancho", // White with red crown
        x: width * 0.15,
        y: height * 0.78,
        angle: 80,
        targetAngle: 80,
        speed: 1.5,
        baseSpeed: 1.5,
        maxSpeed: 7.0,
        isFleeing: false,
        lastFleeing: false,
        fleeCooldown: 0,
        scale: 0.82,
      },
      {
        id: 4,
        type: "kohaku",
        x: width * 0.82,
        y: height * 0.75,
        angle: 160,
        targetAngle: 160,
        speed: 1.7,
        baseSpeed: 1.7,
        maxSpeed: 7.4,
        isFleeing: false,
        lastFleeing: false,
        fleeCooldown: 0,
        scale: 0.92,
      },
      {
        id: 5,
        type: "calico",
        x: width * 0.58,
        y: height * 0.42,
        angle: 260,
        targetAngle: 260,
        speed: 1.5,
        baseSpeed: 1.5,
        maxSpeed: 6.9,
        isFleeing: false,
        lastFleeing: false,
        fleeCooldown: 0,
        scale: 0.85,
      },
      {
        id: 6,
        type: "ogon", // Golden Ogon
        x: width * 0.35,
        y: height * 0.82,
        angle: 120,
        targetAngle: 120,
        speed: 1.6,
        baseSpeed: 1.6,
        maxSpeed: 7.1,
        isFleeing: false,
        lastFleeing: false,
        fleeCooldown: 0,
        scale: 1.0,
      },
      {
        id: 7,
        type: "showa", // Sanke/Showa
        x: width * 0.62,
        y: height * 0.18,
        angle: 190,
        targetAngle: 190,
        speed: 1.45,
        baseSpeed: 1.45,
        maxSpeed: 6.8,
        isFleeing: false,
        lastFleeing: false,
        fleeCooldown: 0,
        scale: 0.9,
      },
    ];

    // Cache element references and sub-elements once mounted
    const fishElements = fishRefs.map((ref) => {
      const el = ref.current;
      return {
        el,
        tailEl: el?.querySelector(".koi-tail"),
        finLEl: el?.querySelector(".koi-fin-l"),
        finREl: el?.querySelector(".koi-fin-r"),
      };
    });

    const loop = () => {
      const currentW = containerRef.current?.clientWidth || width;
      const currentH = containerRef.current?.clientHeight || height;
      const mouse = mouseRef.current;

      // ── UPDATE KOI FISH PHYSICS & EVASION ──
      fishes.forEach((fish, idx) => {
        const item = fishElements[idx];
        if (!item || !item.el) return;

        // Vector to cursor
        const dx = fish.x - mouse.x;
        const dy = fish.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        // Danger detection zone (approx 190px)
        const isNearCursor = dist < 190;

        if (isNearCursor) {
          // Fish is scared! Turn directly AWAY from cursor path
          const fleeAngleRad = Math.atan2(dy, dx);
          fish.targetAngle = (fleeAngleRad * 180) / Math.PI;

          // Accelerate rapidly away
          fish.speed = Math.min(fish.maxSpeed, fish.speed + 0.9);
          fish.isFleeing = true;
          fish.fleeCooldown = 32; // stay panicked for ~0.5s to dash away
        } else {
          if (fish.fleeCooldown > 0) {
            fish.fleeCooldown--;
          } else {
            // Calm down and return smoothly to base cruising speed
            fish.isFleeing = false;
            fish.speed = lerp(fish.speed, fish.baseSpeed, 0.04);

            // Natural organic wandering
            if (Math.random() < 0.018) {
              fish.targetAngle += (Math.random() - 0.5) * 55;
            }
          }
        }

        // Soft screen border avoidance (steers back into pond smoothly)
        const margin = 80;
        if (fish.x < margin) {
          fish.targetAngle = lerpAngle(fish.targetAngle, 10, 0.15);
        } else if (fish.x > currentW - margin) {
          fish.targetAngle = lerpAngle(fish.targetAngle, 190, 0.15);
        }
        if (fish.y < margin) {
          fish.targetAngle = lerpAngle(fish.targetAngle, 100, 0.15);
        } else if (fish.y > currentH - margin) {
          fish.targetAngle = lerpAngle(fish.targetAngle, 280, 0.15);
        }

        // Steer angle smoothly
        const turnRate = fish.isFleeing ? 0.18 : 0.04;
        fish.angle = lerpAngle(fish.angle, fish.targetAngle, turnRate);

        // Advance position along heading
        const rad = (fish.angle * Math.PI) / 180;
        fish.x += Math.cos(rad) * fish.speed;
        fish.y += Math.sin(rad) * fish.speed;

        // Keep inside bounds strictly
        fish.x = Math.max(10, Math.min(currentW - 10, fish.x));
        fish.y = Math.max(10, Math.min(currentH - 10, fish.y));

        // Render DOM transform:
        item.el.style.transform = `translate3d(${fish.x - 35}px, ${fish.y - 65}px, 0) rotate(${fish.angle + 90}deg) scale(${fish.scale})`;

        // Toggle tail & fin wagging speed ONLY when fleeing state changes
        if (fish.lastFleeing !== fish.isFleeing) {
          fish.lastFleeing = fish.isFleeing;
          if (fish.isFleeing) {
            item.tailEl?.classList.remove("koi-tail-normal");
            item.tailEl?.classList.add("koi-tail-fast");
            item.finLEl?.classList.remove("koi-fin-left");
            item.finLEl?.classList.add("koi-fin-left-fast");
            item.finREl?.classList.remove("koi-fin-right");
            item.finREl?.classList.add("koi-fin-right-fast");
          } else {
            item.tailEl?.classList.remove("koi-tail-fast");
            item.tailEl?.classList.add("koi-tail-normal");
            item.finLEl?.classList.remove("koi-fin-left-fast");
            item.finLEl?.classList.add("koi-fin-left");
            item.finREl?.classList.remove("koi-fin-right-fast");
            item.finREl?.classList.add("koi-fin-right");
          }
        }
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="absolute inset-0 w-full h-full overflow-hidden select-none"
    >
      {/* ── CSS KOI FISHES (8 FISHES) ── */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <KoiFish ref={fishRefs[0]} variety="kohaku" />
        <KoiFish ref={fishRefs[1]} variety="showa" />
        <KoiFish ref={fishRefs[2]} variety="ogon" />
        <KoiFish ref={fishRefs[3]} variety="tancho" />
        <KoiFish ref={fishRefs[4]} variety="kohaku" />
        <KoiFish ref={fishRefs[5]} variety="calico" />
        <KoiFish ref={fishRefs[6]} variety="ogon" />
        <KoiFish ref={fishRefs[7]} variety="showa" />
      </div>

      {/* ── NATURAL BOTANICAL LILY PADS (Matches Reference Layout) ── */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top-left below letters */}
        <LilyPadItem left="16%" top="35%" size={85} rotation={30} flower="none" />
        {/* Center below left word */}
        <LilyPadItem left="34%" top="54%" size={95} rotation={60} flower="none" />
        {/* Center-right below right word */}
        <LilyPadItem left="56%" top="60%" size={105} rotation={-45} flower="none" />
        {/* Far mid-left */}
        <LilyPadItem left="13%" top="68%" size={80} rotation={-15} flower="none" />
        {/* Lower center-left with pink lotus */}
        <LilyPadItem left="33%" top="84%" size={95} rotation={40} flower="lotus" />
        {/* Lower center large pad */}
        <LilyPadItem left="49%" top="78%" size={115} rotation={-30} flower="none" />
        {/* Lower center-right */}
        <LilyPadItem left="55%" top="85%" size={90} rotation={15} flower="none" />
      </div>

      {/* ── HERO EDITORIAL TEXT OVERLAY (Matches Reference Screenshot) ── */}
      <motion.div
        style={isMobile ? { scale: 1 } : { scale: textScale }}
        className="relative z-20 w-full h-full flex flex-col items-center justify-center pointer-events-none px-4 sm:px-6"
      >
        <div className="w-full max-w-[94vw] flex flex-col items-center text-center pointer-events-auto">
          {/* Main Giant Display Headline */}
          <h1
            className="font-display font-normal text-white leading-[0.88] select-none tracking-[-0.015em] drop-shadow-[0_4px_24px_rgba(15,75,120,0.35)]"
            style={{
              fontSize: "clamp(3.5rem, 13.5vw, 13rem)",
            }}
          >
            <div className="overflow-hidden py-1">
              <motion.span
                initial={{ y: "115%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="block max-w-full text-white whitespace-nowrap"
              >
                Danish Syazwan
              </motion.span>
            </div>
            <span className="sr-only">
              — Danish Syazwan | Full-Stack Software Engineer & Distributed Systems Developer
            </span>
          </h1>

          {/* Centered Scroll to start cue (clean like reference screenshot) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 sm:mt-5 md:mt-6"
          >
            <p className="font-display italic text-sm sm:text-base md:text-lg text-white/90 tracking-wide drop-shadow-[0_2px_8px_rgba(8,50,90,0.35)]">
              Scroll to start
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Authentic Top-Down Japanese Koi Fish Component
// ─────────────────────────────────────────────────────────────────────────────

interface KoiFishProps {
  variety: "kohaku" | "showa" | "ogon" | "tancho" | "calico";
}

const KoiFish = forwardRef<HTMLDivElement, KoiFishProps>(function KoiFish(
  { variety }: KoiFishProps,
  ref
) {
  return (
    <div
      ref={ref}
      className="absolute top-0 left-0 w-[70px] h-[130px] pointer-events-none will-change-transform"
      style={{
        filter: "drop-shadow(0 14px 18px rgba(3, 28, 54, 0.4))",
      }}
    >
      <svg
        viewBox="0 0 70 130"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle translucent fin gradients */}
          <linearGradient id="finGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="goldFinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* ── PECTORAL FINS (Fluttering) ── */}
        {/* Left Fin */}
        <g className="koi-fin-l koi-fin-left">
          <path
            d="M20,44 C10,40 2,52 6,66 C12,68 18,58 21,50 Z"
            fill={variety === "ogon" ? "url(#goldFinGrad)" : "url(#finGrad)"}
            stroke="#bae6fd"
            strokeWidth="0.5"
          />
        </g>

        {/* Right Fin */}
        <g className="koi-fin-r koi-fin-right">
          <path
            d="M50,44 C60,40 68,52 64,66 C58,68 52,58 49,50 Z"
            fill={variety === "ogon" ? "url(#goldFinGrad)" : "url(#finGrad)"}
            stroke="#bae6fd"
            strokeWidth="0.5"
          />
        </g>

        {/* ── CAUDAL TAIL FIN (Dynamic Wagging) ── */}
        <g className="koi-tail koi-tail-normal">
          {/* Rear body peduncle taper */}
          <path
            d="M31,90 Q35,104 33,112 L37,112 Q35,104 39,90 Z"
            fill={variety === "ogon" ? "#eab308" : "#fffefc"}
          />
          {/* Fan tail fin */}
          <path
            d="M35,108 C25,120 18,135 28,142 C34,136 35,124 35,120 C35,124 36,136 42,142 C52,135 45,120 35,108 Z"
            fill={variety === "ogon" ? "url(#goldFinGrad)" : "url(#finGrad)"}
            stroke="#93c5fd"
            strokeWidth="0.6"
            opacity="0.9"
          />
          {/* Delicate tail fin rays */}
          <line x1="35" y1="112" x2="28" y2="138" stroke="#ffffff" strokeWidth="0.6" opacity="0.6" />
          <line x1="35" y1="112" x2="35" y2="135" stroke="#ffffff" strokeWidth="0.6" opacity="0.7" />
          <line x1="35" y1="112" x2="42" y2="138" stroke="#ffffff" strokeWidth="0.6" opacity="0.6" />
        </g>

        {/* ── KOI TORPEDO BODY ── */}
        {/* Main Base Body */}
        <path
          d="M35,14 
             C24,14 19,28 19,48 
             C19,68 23,82 32,94 
             C33,95 37,95 38,94 
             C47,82 51,68 51,48 
             C51,28 46,14 35,14 Z"
          fill={variety === "ogon" ? "#f59e0b" : "#fffefc"}
        />

        {/* ── DISTINCTIVE KOI COLOR PATTERNS ── */}
        {variety === "kohaku" && (
          <>
            {/* Scarlet head/shoulder patch */}
            <path
              d="M35,18 C28,18 24,24 24,34 C26,42 32,45 35,45 C38,45 44,42 46,34 C46,24 42,18 35,18 Z"
              fill="#ea580c"
            />
            {/* Mid-body vermilion patch */}
            <path
              d="M28,52 C23,54 22,66 26,74 C31,76 38,72 40,65 C41,58 36,51 28,52 Z"
              fill="#e11d48"
            />
            {/* Rear scarlet saddle */}
            <path
              d="M33,78 C30,80 30,86 33,90 C36,91 38,87 37,81 Z"
              fill="#ea580c"
            />
          </>
        )}

        {variety === "showa" && (
          <>
            {/* Fiery orange patch */}
            <path
              d="M32,22 C26,22 25,32 27,40 C34,44 42,38 41,28 C41,22 36,22 32,22 Z"
              fill="#ff5722"
            />
            {/* Jet black sumi ink markings */}
            <path
              d="M22,38 C20,44 24,52 30,50 C28,44 25,40 22,38 Z"
              fill="#18181b"
            />
            <path
              d="M38,56 C34,60 36,70 42,72 C46,68 47,60 44,56 Z"
              fill="#18181b"
            />
            <path
              d="M27,68 C24,72 26,82 32,84 C34,80 33,72 27,68 Z"
              fill="#ea580c"
            />
          </>
        )}

        {variety === "tancho" && (
          <>
            {/* Pristine Tancho Crimson Crown */}
            <circle cx="35" cy="28" r="7.5" fill="#dc2626" />
          </>
        )}

        {variety === "calico" && (
          <>
            {/* Bright orange blaze */}
            <path
              d="M33,20 C27,24 26,36 32,42 C38,44 44,36 42,26 C40,20 35,20 33,20 Z"
              fill="#f97316"
            />
            {/* Black ink spots */}
            <circle cx="28" cy="58" r="4.5" fill="#1e293b" />
            <circle cx="38" cy="68" r="5" fill="#1e293b" />
            <circle cx="33" cy="82" r="3.5" fill="#f97316" />
          </>
        )}

        {variety === "ogon" && (
          <>
            {/* Luminous Golden Highlights */}
            <path
              d="M35,20 C30,20 28,30 28,45 C28,65 31,78 35,85 C39,78 42,65 42,45 C42,30 40,20 35,20 Z"
              fill="#fde047"
              opacity="0.45"
            />
          </>
        )}

        {/* ── DORSAL SPINE RIDGE & SHADING ── */}
        <line
          x1="35"
          y1="24"
          x2="35"
          y2="88"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* ── KOI EYES ── */}
        <circle cx="26" cy="24" r="2.2" fill="#0f172a" />
        <circle cx="25.5" cy="23.5" r="0.8" fill="#ffffff" />
        <circle cx="44" cy="24" r="2.2" fill="#0f172a" />
        <circle cx="43.5" cy="23.5" r="0.8" fill="#ffffff" />
      </svg>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Natural Botanical Lily Pad Component (Matches Reference Screenshot Style)
// ─────────────────────────────────────────────────────────────────────────────

interface LilyPadItemProps {
  left: string;
  top: string;
  size: number;
  rotation: number;
  flower?: "lotus" | "white" | "none";
}

function LilyPadItem({ left, top, size, rotation, flower = "none" }: LilyPadItemProps) {
  // Unique gradient ID per position
  const gradId = `padGrad-${left.replace("%", "")}-${top.replace("%", "")}`;

  return (
    <div
      style={{
        left,
        top,
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
      }}
      className="absolute pointer-events-none select-none will-change-transform"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        style={{
          filter: "drop-shadow(0 10px 14px rgba(2, 22, 38, 0.42))",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial gradient for natural organic deep forest / olive green leaf */}
          <radialGradient id={gradId} cx="48%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#41733a" />
            <stop offset="55%" stopColor="#2e5927" />
            <stop offset="85%" stopColor="#23451e" />
            <stop offset="100%" stopColor="#1a3516" />
          </radialGradient>
        </defs>

        {/* Outer Circular Leaf with realistic sharp V-Notch Cut to center apex */}
        <path
          d="M 50,50 
             L 50,4 
             A 46,46 0 1,0 68,11 
             Z"
          fill={`url(#${gradId})`}
          stroke="#163014"
          strokeWidth="0.8"
        />

        {/* Soft edge highlight rim along the notch */}
        <path
          d="M 50,50 L 50,4"
          stroke="#4e8845"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Radial Leaf Vein Ribs branching from center apex */}
        <g stroke="#183615" strokeWidth="0.8" strokeLinecap="round" opacity="0.65">
          <line x1="50" y1="50" x2="22" y2="24" />
          <line x1="50" y1="50" x2="10" y2="46" />
          <line x1="50" y1="50" x2="16" y2="70" />
          <line x1="50" y1="50" x2="36" y2="88" />
          <line x1="50" y1="50" x2="62" y2="88" />
          <line x1="50" y1="50" x2="82" y2="70" />
          <line x1="50" y1="50" x2="88" y2="46" />
          <line x1="50" y1="50" x2="78" y2="24" />
        </g>

        {/* Delicate secondary vein branches */}
        <g stroke="#4f8c45" strokeWidth="0.5" strokeLinecap="round" opacity="0.35">
          <line x1="36" y1="37" x2="26" y2="30" />
          <line x1="30" y1="48" x2="20" y2="52" />
          <line x1="33" y1="60" x2="25" y2="68" />
          <line x1="43" y1="69" x2="40" y2="80" />
          <line x1="56" y1="69" x2="60" y2="80" />
          <line x1="66" y1="60" x2="75" y2="68" />
          <line x1="69" y1="48" x2="80" y2="52" />
        </g>

        {/* Small natural dew bead on leaf */}
        <ellipse cx="44" cy="36" rx="2.8" ry="2.2" fill="#ffffff" opacity="0.65" />
        <circle cx="43.5" cy="35.5" r="0.8" fill="#ffffff" />

        {/* ── FLOWERS (Matches Reference Screenshot) ── */}
        {flower === "lotus" && (
          <g transform="translate(56, 46)">
            {/* Soft pink layered lotus petals */}
            <path d="M 0,0 C -7,-14 7,-14 0,0" fill="#f472b6" stroke="#db2777" strokeWidth="0.4" />
            <path d="M 0,0 C -14,-7 -14,7 0,0" fill="#f472b6" stroke="#db2777" strokeWidth="0.4" />
            <path d="M 0,0 C -7,14 7,14 0,0" fill="#f472b6" stroke="#db2777" strokeWidth="0.4" />
            <path d="M 0,0 C 14,-7 14,7 0,0" fill="#f472b6" stroke="#db2777" strokeWidth="0.4" />
            {/* Inner delicate petals */}
            <path d="M 0,0 C -8,-8 0,-12 0,0" fill="#fbcfe8" />
            <path d="M 0,0 C 8,-8 0,-12 0,0" fill="#fbcfe8" />
            <path d="M 0,0 C -8,8 0,12 0,0" fill="#fbcfe8" />
            <path d="M 0,0 C 8,8 0,12 0,0" fill="#fbcfe8" />
            {/* Pistil */}
            <circle cx="0" cy="0" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.4" />
          </g>
        )}

        {flower === "white" && (
          <g transform="translate(54, 48)">
            {/* Pure white water daisy petals */}
            <ellipse cx="0" cy="-7" rx="2" ry="5.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.3" />
            <ellipse cx="0" cy="7" rx="2" ry="5.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.3" />
            <ellipse cx="-7" cy="0" rx="5.5" ry="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.3" />
            <ellipse cx="7" cy="0" rx="5.5" ry="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.3" />
            <ellipse cx="-5" cy="-5" rx="5.5" ry="2" transform="rotate(45 -5 -5)" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.3" />
            <ellipse cx="5" cy="5" rx="5.5" ry="2" transform="rotate(45 5 5)" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.3" />
            <ellipse cx="-5" cy="5" rx="5.5" ry="2" transform="rotate(-45 -5 5)" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.3" />
            <ellipse cx="5" cy="-5" rx="5.5" ry="2" transform="rotate(-45 5 -5)" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.3" />
            {/* Golden center */}
            <circle cx="0" cy="0" r="3.2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.4" />
          </g>
        )}
      </svg>
    </div>
  );
}
