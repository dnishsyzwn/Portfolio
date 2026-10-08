"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft, Sparkles } from "lucide-react";


/* ─────────────────────────────────────────────────────────────────────────
   Project Data
───────────────────────────────────────────────────────────────────────── */
export interface CatalogueProject {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tech: string[];
  image: string;
  bg: string;
  side: "left" | "right";
  liveUrl?: string;
  githubUrl?: string;
}

const CATALOGUE_PROJECTS: CatalogueProject[] = [
  {
    id: "syncuid-1",
    number: "01",
    title: "Syncuid",
    category: "Collaborative Creator Network",
    year: "2026",
    description:
      "A collaborative project discovery network empowering game developers, artists, and creators to showcase builds, recruit contributors, and coordinate cross-disciplinary teams with real-time sync.",
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "Distributed Systems"],
    image: "/syncuid.png",
    bg: "#111215",
    side: "left",
    liveUrl: "https://syncuid.com",
    githubUrl: "https://github.com/dnishsyzwn",
  },
  {
    id: "1tusk-1",
    number: "02",
    title: "1Tusk",
    category: "Security Operations Platform",
    year: "2026",
    description:
      "An enterprise security operations and workforce management platform featuring real-time guard deployment tracking, incident logging, attendance analytics, and dynamic shift scheduling.",
    tech: ["React 19", "Node.js", "WebSockets", "Leaflet Geo"],
    image: "/1tusk.png",
    bg: "#f8fafc",
    side: "right",
    liveUrl: "https://1tusk.com",
    githubUrl: "https://github.com/dnishsyzwn",
  },
  {
    id: "gocarry-1",
    number: "03",
    title: "GoCarry",
    category: "Logistics & Freight Dispatch",
    year: "2025",
    description:
      "An on-demand freight logistics and lorry booking platform featuring real-time vehicle tier selection, automated route fare calculation, multi-stop pickup scheduling, and fleet dispatch.",
    tech: ["Next.js", "Express.js", "PostgreSQL", "Google Maps API"],
    image: "/gocarry.png",
    bg: "#ffffff",
    side: "left",
    liveUrl: "https://gocarry.com",
    githubUrl: "https://github.com/dnishsyzwn",
  },
  {
    id: "stu-1",
    number: "04",
    title: "Sabah Teachers Union",
    category: "Official Portal & Member Services",
    year: "2025",
    description:
      "The official web portal and digital services platform for Sabah's largest educators' union, featuring online membership registration, welfare claims tracking, news dispatch, and administrative resource management.",
    tech: ["Next.js", "Tailwind CSS", "PostgreSQL", "Cloudflare"],
    image: "/stu.png",
    bg: "#081b2e",
    side: "right",
    liveUrl: "https://stu.org.my",
    githubUrl: "https://github.com/dnishsyzwn",
  },
  {
    id: "syncuid-2",
    number: "05",
    title: "Syncuid",
    category: "Collaborative Creator Network",
    year: "2026",
    description:
      "A collaborative project discovery network empowering game developers, artists, and creators to showcase builds, recruit contributors, and coordinate cross-disciplinary teams with real-time sync.",
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "Distributed Systems"],
    image: "/syncuid.png",
    bg: "#111215",
    side: "left",
    liveUrl: "https://syncuid.com",
    githubUrl: "https://github.com/dnishsyzwn",
  },
  {
    id: "1tusk-2",
    number: "06",
    title: "1Tusk",
    category: "Security Operations Platform",
    year: "2026",
    description:
      "An enterprise security operations and workforce management platform featuring real-time guard deployment tracking, incident logging, attendance analytics, and dynamic shift scheduling.",
    tech: ["React 19", "Node.js", "WebSockets", "Leaflet Geo"],
    image: "/1tusk.png",
    bg: "#f8fafc",
    side: "right",
    liveUrl: "https://1tusk.com",
    githubUrl: "https://github.com/dnishsyzwn",
  },
  {
    id: "gocarry-2",
    number: "07",
    title: "GoCarry",
    category: "Logistics & Freight Dispatch",
    year: "2025",
    description:
      "An on-demand freight logistics and lorry booking platform featuring real-time vehicle tier selection, automated route fare calculation, multi-stop pickup scheduling, and fleet dispatch.",
    tech: ["Next.js", "Express.js", "PostgreSQL", "Google Maps API"],
    image: "/gocarry.png",
    bg: "#ffffff",
    side: "left",
    liveUrl: "https://gocarry.com",
    githubUrl: "https://github.com/dnishsyzwn",
  },
  {
    id: "stu-2",
    number: "08",
    title: "Sabah Teachers Union",
    category: "Official Portal & Member Services",
    year: "2025",
    description:
      "The official web portal and digital services platform for Sabah's largest educators' union, featuring online membership registration, welfare claims tracking, news dispatch, and administrative resource management.",
    tech: ["Next.js", "Tailwind CSS", "PostgreSQL", "Cloudflare"],
    image: "/stu.png",
    bg: "#081b2e",
    side: "right",
    liveUrl: "https://stu.org.my",
    githubUrl: "https://github.com/dnishsyzwn",
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   3D Hallway Layout Specifications
───────────────────────────────────────────────────────────────────────── */
const DEFAULT_HALLWAY_HALF_WIDTH = 1500; // Responsive default distance to side walls
const HALLWAY_DEPTH = 12500; // Total length of hallway along Z-axis in px (accommodates 8 projects)
const Z_START = -950; // Z-position of first painting
const Z_SPACING = 1250; // Z-distance between successive paintings

function getProjectCoords(idx: number, halfWidth: number = DEFAULT_HALLWAY_HALF_WIDTH) {
  const proj = CATALOGUE_PROJECTS[idx];
  const z = Z_START - idx * Z_SPACING;
  // Painting mounted 8px inside hallway from wall plane
  const x = proj.side === "left" ? -halfWidth + 8 : halfWidth - 8;
  return { x, y: 0, z, side: proj.side };
}

function getCameraTransform(index: number, halfWidth: number = DEFAULT_HALLWAY_HALF_WIDTH) {
  if (index === -1) {
    // Entrance Overview: Standing in center of hallway looking down corridor
    return {
      camX: 0,
      camY: 0,
      camZ: 140,
      rotY: 0,
      rotX: 0,
    };
  }

  const { z, side, x } = getProjectCoords(index, halfWidth);
  const isLeft = side === "left";
  // Straight-on, close viewing:
  // - Turns 90 degrees directly perpendicular to the wall (no angular distortion or tilt)
  // - Camera aligns precisely with center of artwork in Z (camZ = z)
  // - Steps right in front of the wall (camX dynamically placed 27px from painting surface),
  //   filling almost the entire screen head-on
  // - Eye level centered (camY = 0)
  const camX = isLeft ? x + 27 : x - 27;
  return {
    camX,
    camY: 0,
    camZ: z,
    rotY: isLeft ? -90 : 90,
    rotX: 0,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   Main Unified Component
───────────────────────────────────────────────────────────────────────── */
type Phase = "stacking" | "stacked" | "transitioning" | "hallway";

export default function CatalogueGallery() {
  const [phase, setPhase] = useState<Phase>("stacking");
  const [cardsLoaded, setCardsLoaded] = useState(0);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isNavigating, setIsNavigating] = useState(false);

  // Responsive painting dimensions to fill almost the entire screen on any device
  const [screenSize, setScreenSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { paintingWidth, paintingHeight } = useMemo(() => {
    // Leave generous margins so paintings never overlap the top navbar buttons (~85px) or bottom controls (~115px)
    const maxAvailHeight = Math.max(360, screenSize.height - 270);
    const maxAvailWidth = Math.max(540, screenSize.width - 180);

    let h = maxAvailHeight;
    let w = Math.round(h * 1.68);
    if (w > maxAvailWidth) {
      w = maxAvailWidth;
      h = Math.round(w / 1.68);
    }
    return { paintingWidth: w, paintingHeight: h };
  }, [screenSize]);

  // Hallway width: placed wide towards the outer edges of the screen
  const hallwayHalfWidth = useMemo(() => {
    return Math.max(900, Math.round(screenSize.width * 0.82));
  }, [screenSize.width]);

  // Entrance Card Stacking Sequencer
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setCardsLoaded(current);
      if (current >= CATALOGUE_PROJECTS.length) {
        clearInterval(interval);
        setTimeout(() => {
          setPhase("stacked");
        }, 850); // Generous time for the final card to complete its slow, graceful glide
      }
    }, 220); // 220ms interval: slower, cinematic cadence while maintaining overlapping flow

    return () => clearInterval(interval);
  }, []);

  // Handler to enter the 3D gallery
  const handleStart = useCallback(() => {
    setPhase("transitioning");
    setTimeout(() => {
      setPhase("hallway");
    }, 1150);
  }, []);

  // Keyboard navigation & global shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === "stacking" || phase === "stacked") {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleStart();
        }
      } else if (phase === "hallway") {
        if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
          e.preventDefault();
          if (activeStep < CATALOGUE_PROJECTS.length - 1 && !isNavigating) {
            goToStep(activeStep + 1);
          }
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          if (activeStep > -1 && !isNavigating) {
            goToStep(activeStep - 1);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, activeStep, isNavigating, handleStart]);

  // Navigate through gallery
  const goToStep = useCallback(
    (newStep: number) => {
      if (isNavigating) return;
      if (newStep < -1 || newStep >= CATALOGUE_PROJECTS.length) return;
      setIsNavigating(true);
      setActiveStep(newStep);
      setTimeout(() => {
        setIsNavigating(false);
      }, 900);
    },
    [isNavigating]
  );

  const goNext = useCallback(() => {
    if (activeStep < CATALOGUE_PROJECTS.length - 1) {
      goToStep(activeStep + 1);
    }
  }, [activeStep, goToStep]);

  const goPrev = useCallback(() => {
    if (activeStep > -1) {
      goToStep(activeStep - 1);
    }
  }, [activeStep, goToStep]);

  const handleGoBack = useCallback(() => {
    if (activeStep >= 0) {
      goToStep(-1);
    } else {
      setPhase("stacked");
    }
  }, [activeStep, goToStep]);

  const camera = useMemo(
    () => getCameraTransform(activeStep, hallwayHalfWidth),
    [activeStep, hallwayHalfWidth]
  );
  const activeProject = activeStep >= 0 ? CATALOGUE_PROJECTS[activeStep] : null;

  return (
    <div className="fixed inset-0 z-40 bg-white text-neutral-900 overflow-hidden select-none">
      {/* Subtle radial atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: `
            radial-gradient(circle at 50% 35%, rgba(0,0,0,0.02) 0%, transparent 70%),
            linear-gradient(180deg, #ffffff 0%, #fafafa 100%)
          `,
        }}
      />

      {/* ═════════════════════════════════════════════════════════════════
          LAYER 1: THE INITIAL STACK & OUTWARD EXPANSION
         ═════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {(phase === "stacking" || phase === "stacked" || phase === "transitioning") && (
          <motion.div
            key="stack-layer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 z-30 flex flex-col items-center justify-center ${
              phase === "transitioning" ? "pointer-events-none" : "pointer-events-auto"
            }`}
          >
            {/* The Stacked Cards Container - Bigger & Bolder */}
            <div
              onClick={handleStart}
              className="relative w-[380px] sm:w-[480px] md:w-[560px] lg:w-[640px] h-[240px] sm:h-[300px] md:h-[350px] lg:h-[400px] flex items-center justify-center cursor-pointer"
            >
              {CATALOGUE_PROJECTS.map((proj, idx) => {
                if (idx >= cardsLoaded) return null;

                const fromLeft = idx % 2 === 0;
                const zIndex = idx + 1;
                const isTop = idx === CATALOGUE_PROJECTS.length - 1 && cardsLoaded === CATALOGUE_PROJECTS.length;

                // Stack offset
                const offsetY = (CATALOGUE_PROJECTS.length - 1 - idx) * -2.5;
                const offsetX = (CATALOGUE_PROJECTS.length - 1 - idx) * 1.2;

                // When transitioning, burst cards outward to left & right walls
                const isBursting = phase === "transitioning";
                const burstTargetX = proj.side === "left" ? "-52vw" : "52vw";
                const burstTargetY = `${(idx - 3.5) * -7}vh`;

                // Converging lateral entry: starts wide from left/right and becomes progressively centered towards the last card
                const totalProjects = CATALOGUE_PROJECTS.length;
                const progress = totalProjects > 1 ? idx / (totalProjects - 1) : 0; // 0 for first card -> 1 for last card
                const spreadVw = 34 - progress * 28; // 34vw on first card down to 6vw on last card
                const startX = fromLeft ? `-${spreadVw}vw` : `${spreadVw}vw`;

                return (
                  <motion.div
                    key={proj.id}
                    initial={{
                      x: startX,
                      y: "52vh",
                      opacity: 0,
                      scale: 0.94,
                    }}
                    animate={{
                      x: isBursting ? burstTargetX : offsetX,
                      y: isBursting ? burstTargetY : offsetY,
                      opacity: isBursting ? 0 : 1,
                      scale: isBursting ? 0.55 : 1,
                    }}
                    transition={{
                      duration: isBursting ? 0.95 : 1.15,
                      delay: isBursting ? idx * 0.04 : 0,
                      // Slower, majestic ease-out curve with buttery zero-velocity landing
                      ease: isBursting ? [0.16, 1, 0.3, 1] : [0.16, 1, 0.3, 1],
                    }}
                    className="absolute inset-0 overflow-hidden shadow-2xl shadow-sky-950/10 border border-sky-200/90"
                    style={{
                      zIndex,
                      backgroundColor: proj.bg,
                      willChange: "transform, opacity",
                    }}
                  >
                    <img
                      src={proj.image}
                      alt={proj.title}
                      draggable={false}
                      className="w-full h-full object-cover object-left-top select-none pointer-events-none"
                    />

                    {/* Top card subtle shading */}
                    <div
                      className={`absolute inset-0 pointer-events-none ${
                        isTop ? "bg-transparent" : "bg-sky-950/5"
                      }`}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* "Click here to start" Button Area */}
            <div className="h-20 mt-8 flex items-center justify-center relative z-50">
              <AnimatePresence>
                {(phase === "stacked" || cardsLoaded >= CATALOGUE_PROJECTS.length) && phase !== "transitioning" && (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <button
                      type="button"
                      onClick={handleStart}
                      onPointerDown={handleStart}
                      className="group relative px-9 py-4 rounded-full bg-gradient-to-r from-sky-400 via-sky-300 to-sky-400 text-[#07182b] font-sans text-sm font-semibold tracking-wide shadow-xl shadow-sky-400/35 hover:shadow-sky-400/55 hover:scale-[1.04] active:scale-[0.97] transition-all duration-200 cursor-pointer flex items-center gap-2 select-none border border-sky-200/70 pointer-events-auto"
                    >
                      <span>Click here to start</span>
                      <Sparkles className="w-4 h-4 text-[#07182b] group-hover:rotate-12 transition-transform duration-300" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Instruction Tip */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "stacked" ? 0.75 : 0 }}
              transition={{ duration: 0.5 }}
              className="font-mono text-[11px] text-sky-700/80 uppercase tracking-widest text-center mt-2 pointer-events-none"
            >
              Interactive 3D Exhibition
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═════════════════════════════════════════════════════════════════
          LAYER 2: THE 3D MUSEUM HALLWAY (Reveals when entering/hallway)
         ═════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {(phase === "transitioning" || phase === "hallway") && (
          <motion.div
            key="3d-gallery-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="absolute inset-0 z-20 overflow-hidden pointer-events-auto"
          >
            {/* 3D Viewport with Perspective */}
            <div
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
              style={{
                perspective: "1100px",
                perspectiveOrigin: "50% 50%",
              }}
            >
              {/* Camera Rig: Moves through physical 3D space */}
              <div
                className="absolute w-0 h-0 will-change-transform"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `
                    rotateY(${camera.rotY}deg)
                    translate3d(${-camera.camX}px, ${-camera.camY}px, ${-camera.camZ}px)
                  `,
                  transition:
                    phase === "transitioning"
                      ? "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
                      : "transform 1.05s cubic-bezier(0.2, 0.8, 0.2, 1)",
                }}
              >
                {/* ── 3D ARTWORKS (Invisible Walls - Floating in Dark Navy 3D Space) ── */}
                {CATALOGUE_PROJECTS.map((proj, idx) => {
                  const coords = getProjectCoords(idx, hallwayHalfWidth);
                  const isSelected = idx === activeStep;
                  const isLeft = proj.side === "left";
                  const wallRotation = isLeft ? "rotateY(90deg)" : "rotateY(-90deg)";

                  return (
                    <div
                      key={proj.id}
                      onClick={() => {
                        if (isSelected && proj.liveUrl) {
                          window.open(proj.liveUrl, "_blank");
                        } else {
                          goToStep(idx);
                        }
                      }}
                      title={isSelected && proj.liveUrl ? `Open ${proj.title} (Live Demo)` : `Walk to ${proj.title}`}
                      className="absolute cursor-pointer group"
                      style={{
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        transform: `
                          translate3d(${coords.x}px, ${coords.y}px, ${coords.z}px)
                          ${wallRotation}
                        `,
                        width: `${paintingWidth}px`,
                        height: `${paintingHeight}px`,
                        left: `-${paintingWidth / 2}px`,
                        top: `-${paintingHeight / 2}px`,
                      }}
                    >
                      {/* Project Name outside top-left of the picture */}
                      <div className="absolute -top-7 sm:-top-8 left-0 pointer-events-none select-none">
                        <span className="font-sans text-xs sm:text-sm font-semibold text-[#0d2744] tracking-tight">
                          {proj.title}
                        </span>
                      </div>

                      {/* Artwork Frame - clean sharp blue border in our signature palette */}
                      <div
                        className={`relative w-full h-full overflow-hidden transition-all duration-500 ${
                          isSelected
                            ? "border-2 border-sky-500 shadow-[0_16px_50px_rgba(14,165,233,0.18)]"
                            : "border border-sky-200/90 shadow-md shadow-sky-950/5 group-hover:border-sky-400"
                        }`}
                        style={{
                          backgroundColor: proj.bg,
                        }}
                      >
                        <img
                          src={proj.image}
                          alt={proj.title}
                          draggable={false}
                          className={`w-full h-full object-cover object-left-top transition-transform duration-700 select-none ${
                            isSelected ? "scale-[1.01]" : "scale-100 group-hover:scale-[1.01]"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═════════════════════════════════════════════════════════════════
          LAYER 3: HEADS-UP DISPLAY (HUD)
         ═════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {(phase === "hallway" || phase === "transitioning") && (
          <motion.div
            key="hud-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none z-30"
          >


            {/* Bottom Navigation Buttons (Camera Walkers & Go Back) */}
            <footer className="absolute bottom-5 sm:bottom-6 left-0 right-0 px-6 flex flex-col items-center justify-center gap-2.5 pointer-events-auto select-none">
              {/* Go Back button placed on top of the indicator dots */}
              <button
                type="button"
                onClick={handleGoBack}
                disabled={isNavigating}
                className="group px-3.5 py-1.5 rounded-full border border-sky-200/80 bg-white/95 backdrop-blur-md hover:bg-sky-50/80 text-[#0d2744] font-sans text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:border-sky-300 active:scale-95 disabled:opacity-40"
                aria-label="Go back"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-sky-600 group-hover:text-sky-800 group-hover:-translate-x-0.5 transition-all" />
                <span>Go back</span>
              </button>

              {/* Controls Row: Left Chevron + Dots + Right Chevron */}
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={activeStep === -1 || isNavigating}
                  className="group w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-sky-200/70 bg-white/90 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:border-sky-300 hover:bg-sky-50/60 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shadow-md active:scale-95"
                  aria-label="Walk back to previous project"
                >
                  <ChevronLeft className="w-5 h-5 text-sky-800 group-hover:text-sky-950 transition-colors" />
                </button>

                {/* Indicator dots */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 border border-sky-200/70 backdrop-blur-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => goToStep(-1)}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      activeStep === -1 ? "w-6 h-1.5 bg-sky-500" : "w-1.5 h-1.5 bg-sky-200 hover:bg-sky-400"
                    }`}
                    aria-label="Go to entrance overview"
                    title="Entrance overview"
                  />

                  {CATALOGUE_PROJECTS.map((proj, idx) => (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => goToStep(idx)}
                      className={`rounded-full transition-all duration-300 cursor-pointer ${
                        activeStep === idx ? "w-6 h-1.5 bg-sky-500" : "w-1.5 h-1.5 bg-sky-200 hover:bg-sky-400"
                      }`}
                      aria-label={`Walk to ${proj.title}`}
                      title={`Walk to ${proj.title}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  disabled={activeStep === CATALOGUE_PROJECTS.length - 1 || isNavigating}
                  className="group w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-sky-200/70 bg-white/90 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:border-sky-300 hover:bg-sky-50/60 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shadow-md active:scale-95"
                  aria-label="Walk forward to next project"
                >
                  <ChevronRight className="w-5 h-5 text-sky-800 group-hover:text-sky-950 transition-colors" />
                </button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
