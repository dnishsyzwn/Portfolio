"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ArrowDown } from "lucide-react";
import TopographyBackground from "./TopographyBackground";

interface GalleryMoment {
  id: string;
  tag: string;
  title: string;
  category: string;
  image: string;
  aspect: string;
  caption: string;
}

const moments: GalleryMoment[] = [
  {
    id: "hackathon",
    tag: "KUALA LUMPUR, 2025",
    title: "1st Place Grand Champion",
    category: "National University Hackathon",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-[4/5]",
    caption: "Champion out of 120+ teams for architecting a decentralized BLE mesh telemetry relay under 36 hours.",
  },
  {
    id: "academic",
    tag: "FACULTY OF COMPUTING, 2025",
    title: "Dean's Honor Roll & First Class",
    category: "Academic Pedigree",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-[3/4]",
    caption: "Consecutive Dean's Honor List honours with a 3.92 CGPA in Software Systems Architecture.",
  },
  {
    id: "summit",
    tag: "TECH SUMMIT, 2025",
    title: "Keynote: Distributed Web Architecture",
    category: "Technical Presentation",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-[16/11]",
    caption: "Presented sub-15ms WebSocket state synchronization patterns to 300+ engineers.",
  },
  {
    id: "workstation",
    tag: "DEV LAB, 2026",
    title: "Open-Source Runtime Optimization",
    category: "Engineering Fellowship",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-[4/3]",
    caption: "35+ upstream PRs merged into high-throughput TypeScript runtime libraries.",
  },
  {
    id: "capstone",
    tag: "RESEARCH SYMPOSIUM, 2026",
    title: "Best Engineering Thesis Nominee",
    category: "Systems Research",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-[4/5]",
    caption: "Faculty nomination on low-overhead CRDT state convergence in weakly-connected edge environments.",
  },
];

// Runway distance for the locked scroll sequence
const RUNWAY_VH = 450;

export default function DevLabGallery() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryMoment | null>(null);

  // Pinned scroll runway progress (0 to 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ── Item-by-item fade in on scroll down / fade out on scroll up ────────────
  // 1. Left Large Anchor Photo (Hackathon Grand Champion)
  const item1Opacity = useTransform(scrollYProgress, [0.03, 0.18], [0, 1]);
  const item1Y       = useTransform(scrollYProgress, [0.03, 0.18], [40, 0]);

  // 2. Center Editorial Quote Block
  const item2Opacity = useTransform(scrollYProgress, [0.18, 0.32], [0, 1]);
  const item2Y       = useTransform(scrollYProgress, [0.18, 0.32], [40, 0]);

  // 3. Center Portrait Photo (Dean's Honor Roll)
  const item3Opacity = useTransform(scrollYProgress, [0.32, 0.46], [0, 1]);
  const item3Y       = useTransform(scrollYProgress, [0.32, 0.46], [40, 0]);

  // 4. Right Column Stack (Research Thesis + Keynote)
  const item4Opacity = useTransform(scrollYProgress, [0.46, 0.62], [0, 1]);
  const item4Y       = useTransform(scrollYProgress, [0.46, 0.62], [40, 0]);

  // 5. Wide Bottom Showcase (Dev Lab Workstation + metrics)
  const item5Opacity = useTransform(scrollYProgress, [0.65, 0.85], [0, 1]);
  const item5Y       = useTransform(scrollYProgress, [0.65, 0.85], [40, 0]);

  // Stage vertical panning: smoothly glides up to reveal the wide bottom showcase
  // without sacrificing full, uncompromised image sizes!
  const stageY = useTransform(scrollYProgress, [0.45, 0.88], ["0px", "-540px"]);

  // Hairline progress bar fill
  const progressWidth = useTransform(scrollYProgress, [0.03, 0.88], ["0%", "100%"]);

  return (
    <div
      ref={containerRef}
      id="curriculum"
      className="relative bg-[#0b1c2e]"
      style={{ height: `${RUNWAY_VH}vh` }}
    >
      <div id="lab" className="absolute top-0 left-0" aria-hidden="true" />

      {/* ── Sticky Viewport (Locked in place while user scrolls) ─────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between bg-[#0b1c2e] text-[#ddeaf5] border-t border-[#1e456d]/40">
        
        {/* Subtle Topography Contour Background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-screen scale-110">
          <TopographyBackground />
        </div>

        {/* ── HEADER: Permanently visible from the start ─────────────────── */}
        <header className="relative z-20 flex-none px-6 md:px-12 pt-[76px] pb-4 max-w-[1320px] mx-auto w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1e456d]/30 bg-[#0b1c2e]/90 backdrop-blur-sm">
          <div>
            <span className="font-mono text-[10px] sm:text-[11px] text-[#6fa3d4] uppercase tracking-[0.2em] mb-1.5 block">
              02 / CURRICULUM &amp; ACHIEVEMENTS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#ddeaf5] tracking-tight leading-none">
              Moments &amp; Milestones
            </h2>
          </div>

          <p className="font-sans text-xs sm:text-sm text-[#9dbfd9]/70 max-w-sm">
            Visual diary of academic excellence, hackathon victories, and engineering symposiums.
          </p>
        </header>

        {/* ── EDITORIAL STAGE: Exact original layout & full image sizes ──── */}
        <div className="relative z-10 flex-1 overflow-hidden max-w-[1320px] mx-auto w-full px-6 md:px-12 py-6">
          <motion.div
            style={{ y: stageY }}
            className="w-full will-change-transform"
          >
            {/* ── Top Masonry Collage: 5 cols / 4 cols / 3 cols ─────────── */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              
              {/* Item 1: Large Left Anchor Photo (Hackathon Grand Champion) */}
              <motion.div
                style={{ opacity: item1Opacity, y: item1Y }}
                className="md:col-span-5 flex flex-col will-change-transform"
              >
                <span className="font-mono text-[10px] text-[#9dbfd9]/60 uppercase tracking-widest mb-2.5">
                  {moments[0].tag}
                </span>
                <div
                  onClick={() => setSelectedPhoto(moments[0])}
                  className={`group relative w-full ${moments[0].aspect} overflow-hidden bg-[#0e243c] border border-[#1e456d]/50 cursor-pointer`}
                >
                  <img
                    src={moments[0].image}
                    alt={moments[0].title}
                    className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c2e]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-xs text-[#38bdf8] flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                      </span>
                      <span className="font-mono text-[10px] text-[#9dbfd9]/80 uppercase">
                        {moments[0].category}
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#ddeaf5] mt-3.5 tracking-tight">
                  {moments[0].title}
                </h3>
                <p className="font-sans text-xs text-[#9dbfd9]/70 mt-1">
                  {moments[0].caption}
                </p>
              </motion.div>

              {/* Center Column: Quote Block + Dean's List Photo */}
              <div className="md:col-span-4 flex flex-col gap-10 md:pt-4">
                {/* Item 2: Lando Norris Inspired Editorial Quote */}
                <motion.div
                  style={{ opacity: item2Opacity, y: item2Y }}
                  className="border-l border-[#38bdf8]/40 pl-5 py-2 will-change-transform"
                >
                  <blockquote className="font-serif text-2xl sm:text-3xl text-[#ddeaf5] leading-snug tracking-tight">
                    It doesn&apos;t matter where you start, it&apos;s{" "}
                    <span className="italic font-normal text-[#38bdf8]">how you engineer</span> the progress from there.
                  </blockquote>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="font-mono text-xs text-[#6fa3d4] tracking-wider uppercase">
                      — Danish Syazwan
                    </span>
                    <span className="text-xs font-mono text-[#9dbfd9]/40">• CS (Hons)</span>
                  </div>
                </motion.div>

                {/* Item 3: Academic Convocation / Dean's List */}
                <motion.div
                  style={{ opacity: item3Opacity, y: item3Y }}
                  className="flex flex-col will-change-transform"
                >
                  <span className="font-mono text-[10px] text-[#9dbfd9]/60 uppercase tracking-widest mb-2.5">
                    {moments[1].tag}
                  </span>
                  <div
                    onClick={() => setSelectedPhoto(moments[1])}
                    className={`group relative w-full ${moments[1].aspect} overflow-hidden bg-[#0e243c] border border-[#1e456d]/50 cursor-pointer`}
                  >
                    <img
                      src={moments[1].image}
                      alt={moments[1].title}
                      className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c2e]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-xs text-[#38bdf8] flex items-center gap-1">
                          <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                        </span>
                        <span className="font-mono text-[10px] text-[#9dbfd9]/80 uppercase">
                          {moments[1].category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl text-[#ddeaf5] mt-3 tracking-tight">
                    {moments[1].title}
                  </h3>
                  <p className="font-sans text-xs text-[#9dbfd9]/70 mt-1">
                    {moments[1].caption}
                  </p>
                </motion.div>
              </div>

              {/* Right Column: Research Thesis & Tech Summit */}
              <motion.div
                style={{ opacity: item4Opacity, y: item4Y }}
                className="md:col-span-3 flex flex-col gap-10 will-change-transform"
              >
                {/* Photo 4: Capstone Research */}
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-[#9dbfd9]/60 uppercase tracking-widest mb-2.5">
                    {moments[4].tag}
                  </span>
                  <div
                    onClick={() => setSelectedPhoto(moments[4])}
                    className={`group relative w-full ${moments[4].aspect} overflow-hidden bg-[#0e243c] border border-[#1e456d]/50 cursor-pointer`}
                  >
                    <img
                      src={moments[4].image}
                      alt={moments[4].title}
                      className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c2e]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="font-mono text-xs text-[#38bdf8] flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                      </span>
                    </div>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg text-[#ddeaf5] mt-2.5 tracking-tight">
                    {moments[4].title}
                  </h3>
                  <p className="font-sans text-[11px] text-[#9dbfd9]/70 mt-1">
                    {moments[4].caption}
                  </p>
                </div>

                {/* Photo 5: Developer Summit Keynote */}
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-[#9dbfd9]/60 uppercase tracking-widest mb-2.5">
                    {moments[2].tag}
                  </span>
                  <div
                    onClick={() => setSelectedPhoto(moments[2])}
                    className={`group relative w-full ${moments[2].aspect} overflow-hidden bg-[#0e243c] border border-[#1e456d]/50 cursor-pointer`}
                  >
                    <img
                      src={moments[2].image}
                      alt={moments[2].title}
                      className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c2e]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="font-mono text-xs text-[#38bdf8] flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                      </span>
                    </div>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg text-[#ddeaf5] mt-2.5 tracking-tight">
                    {moments[2].title}
                  </h3>
                  <p className="font-sans text-[11px] text-[#9dbfd9]/70 mt-1">
                    {moments[2].caption}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ── Item 5: Wide Bottom Showcase (Dev Lab Workstation) ─────── */}
            <motion.div
              style={{ opacity: item5Opacity, y: item5Y }}
              className="mt-16 pt-12 border-t border-[#1e456d]/40 grid grid-cols-1 md:grid-cols-12 gap-8 items-center will-change-transform"
            >
              <div className="md:col-span-8">
                <span className="font-mono text-[10px] text-[#9dbfd9]/60 uppercase tracking-widest mb-2 block">
                  {moments[3].tag}
                </span>
                <div
                  onClick={() => setSelectedPhoto(moments[3])}
                  className={`group relative w-full ${moments[3].aspect} max-h-[400px] overflow-hidden bg-[#0e243c] border border-[#1e456d]/50 cursor-pointer`}
                >
                  <img
                    src={moments[3].image}
                    alt={moments[3].title}
                    className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c2e]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="font-mono text-xs text-[#38bdf8] flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col justify-center">
                <span className="font-mono text-xs text-[#38bdf8] uppercase tracking-wider mb-2">
                  {moments[3].category}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#ddeaf5] mb-3 leading-tight">
                  {moments[3].title}
                </h3>
                <p className="font-sans text-sm text-[#9dbfd9] leading-relaxed mb-6">
                  {moments[3].caption}
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-[#6fa3d4]">
                  <span className="border border-[#1e456d] bg-[#0e243c] px-3 py-1.5 rounded-sm">
                    35+ UPSTREAM PRS
                  </span>
                  <span className="border border-[#1e456d] bg-[#0e243c] px-3 py-1.5 rounded-sm">
                    250K+ INSTALLS
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── FOOTER: Progress Bar & Scroll Indicator ─────────────────────── */}
        <footer className="relative z-20 flex-none px-6 md:px-12 pb-5 pt-3 max-w-[1320px] mx-auto w-full flex items-center gap-5 bg-[#0b1c2e]/90 backdrop-blur-sm">
          <div className="flex-1 h-px bg-[#1e456d]/40 relative overflow-hidden">
            <motion.div
              style={{ width: progressWidth }}
              className="absolute inset-y-0 left-0 bg-[#38bdf8] origin-left"
            />
          </div>

          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#9dbfd9]/60 whitespace-nowrap select-none"
          >
            <span>scroll to explore archive</span>
            <ArrowDown className="w-3 h-3 text-[#38bdf8]" />
          </motion.div>
        </footer>

      </div>

      {/* ── Fullscreen Interactive Lightbox ──────────────────────────────── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-[#071320]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#0b1c2e] border border-[#1e456d] p-4 sm:p-6 rounded-none shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 text-[#9dbfd9] hover:text-[#ffffff] bg-[#0e243c] border border-[#1e456d] transition-colors z-10"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full max-h-[70vh] overflow-hidden mb-4 bg-black flex items-center justify-center">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="w-full h-full max-h-[70vh] object-contain mx-auto"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-2 border-t border-[#1e456d]/60">
                <div>
                  <span className="font-mono text-[10px] text-[#6fa3d4] uppercase tracking-wider block mb-0.5">
                    {selectedPhoto.tag} • {selectedPhoto.category}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl text-[#ddeaf5]">
                    {selectedPhoto.title}
                  </h4>
                </div>
                <p className="font-sans text-xs text-[#9dbfd9] max-w-md">
                  {selectedPhoto.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { DevLabGallery as CurriculumAchievements };
