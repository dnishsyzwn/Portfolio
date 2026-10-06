"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownLeft, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import TopographyBackground from "./TopographyBackground";

export default function SilkHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  // Content subtle internal parallax
  const textScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.96]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = Math.min(window.innerWidth, 1920));
    let height = (canvas.height = Math.min(window.innerHeight, 1080));

    let mouse = { x: width * 0.7, y: height * 0.4, targetX: width * 0.7, targetY: height * 0.4 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    // Pre-cached gradients (created ONCE on resize, never inside render loop!)
    let baseGrad: CanvasGradient;
    let ribbonGrads: CanvasGradient[] = [];
    let glowGrad: CanvasGradient;

    const buildGradients = (w: number, h: number, isMob: boolean) => {
      // Base radiant background
      baseGrad = ctx.createLinearGradient(0, 0, w, h);
      if (isMob) {
        baseGrad.addColorStop(0, "rgb(240, 248, 255)");
        baseGrad.addColorStop(0.3, "rgb(224, 242, 254)");
        baseGrad.addColorStop(0.65, "rgb(190, 224, 248)");
        baseGrad.addColorStop(1, "rgb(164, 207, 240)");
      } else {
        baseGrad.addColorStop(0, "rgb(255, 255, 255)");
        baseGrad.addColorStop(0.3, "rgb(240, 248, 255)");
        baseGrad.addColorStop(0.65, "rgb(200, 228, 248)");
        baseGrad.addColorStop(1, "rgb(164, 207, 240)");
      }

      // Ribbon waves gradients
      const ribbonColors = [
        { c1: "rgba(200, 228, 248, 0.55)", c2: "rgba(124, 184, 232, 0.45)", xOff: isMob ? w * 0.15 : w * 0.35 },
        { c1: "rgba(164, 207, 240, 0.45)", c2: "rgba(237, 246, 255, 0.65)", xOff: isMob ? w * 0.35 : w * 0.55 },
        { c1: "rgba(124, 184, 232, 0.35)", c2: "rgba(200, 228, 248, 0.4)", xOff: isMob ? w * 0.55 : w * 0.72 },
        { c1: "rgba(245, 250, 255, 0.6)", c2: "rgba(164, 207, 240, 0.3)", xOff: isMob ? w * 0.75 : w * 0.85 },
      ];

      ribbonGrads = ribbonColors.map((r) => {
        const g = ctx.createLinearGradient(r.xOff, 0, w, h);
        g.addColorStop(0, r.c1);
        g.addColorStop(1, r.c2);
        return g;
      });

      // Ambient radial bloom behind headline
      glowGrad = ctx.createRadialGradient(
        w * (isMob ? 0.5 : 0.4),
        h * (isMob ? 0.42 : 0.45),
        isMob ? 20 : 50,
        w * (isMob ? 0.5 : 0.4),
        h * (isMob ? 0.42 : 0.45),
        w * (isMob ? 0.85 : 0.6)
      );
      glowGrad.addColorStop(0, isMob ? "rgba(255, 255, 255, 0.55)" : "rgba(255, 255, 255, 0.85)");
      glowGrad.addColorStop(0.5, "rgba(237, 246, 255, 0.3)");
      glowGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    };

    const handleResize = () => {
      width = canvas.width = Math.min(window.innerWidth, 1920);
      height = canvas.height = Math.min(window.innerHeight, 1080);
      const isMob = window.innerWidth < 768;
      setIsMobile(isMob);
      buildGradients(width, height, isMob);
    };
    handleResize();

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let time = 0;
    let lastTime = 0;
    const fpsInterval = 1000 / 60; // Locked 60 FPS limiter

    const render = (now: number) => {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(render);

      // Sleep canvas when hero has completely zoomed out and faded to 0 opacity
      const scrollProgress = scrollYProgress ? scrollYProgress.get() : 0;
      if (scrollProgress > 0.88) {
        return;
      }

      if (now - lastTime < fpsInterval) return;
      lastTime = now;

      time += 0.005;

      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      const isMob = width < 768;

      // 1. Paint pre-computed base radiant background
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Flowing silk ribbon waves (optimized math with squared distances)
      const ribbons = [
        {
          speed: 1.0,
          amp: isMob ? 65 : 120,
          freq: isMob ? 0.0025 : 0.0018,
          xOffset: isMob ? width * 0.15 : width * 0.35,
        },
        {
          speed: 0.8,
          amp: isMob ? 80 : 160,
          freq: isMob ? 0.002 : 0.0014,
          xOffset: isMob ? width * 0.35 : width * 0.55,
        },
        {
          speed: 1.2,
          amp: isMob ? 70 : 140,
          freq: isMob ? 0.0028 : 0.002,
          xOffset: isMob ? width * 0.55 : width * 0.72,
        },
        {
          speed: 0.7,
          amp: isMob ? 90 : 190,
          freq: isMob ? 0.0018 : 0.0012,
          xOffset: isMob ? width * 0.75 : width * 0.85,
        },
      ];

      const stepY = isMob ? 42 : 50;
      const maxMouseDistSq = 380 * 380;

      for (let i = 0; i < ribbons.length; i++) {
        const ribbon = ribbons[i];
        ctx.beginPath();
        const t = time * ribbon.speed;
        const startX = ribbon.xOffset + Math.sin(t + i) * 60 + ((mouse.x - width * 0.5) * (i + 1) * 0.05);

        ctx.moveTo(startX, -50);

        for (let y = -50; y <= height + 50; y += stepY) {
          const distortion =
            Math.sin(y * ribbon.freq + t) * ribbon.amp +
            Math.cos(y * ribbon.freq * 2.2 - t * 0.8) * (ribbon.amp * 0.4);

          const rawX = startX + distortion;
          const dx = mouse.x - rawX;
          const dy = mouse.y - y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxMouseDistSq) {
            const dist = Math.sqrt(distSq);
            const mouseEffect = (1 - dist / 380) * 45;
            const cx = rawX - (dx / (dist + 1)) * mouseEffect;
            ctx.lineTo(cx, y);
          } else {
            ctx.lineTo(rawX, y);
          }
        }

        ctx.lineTo(width + 80, height + 50);
        ctx.lineTo(width + 80, -50);
        ctx.closePath();

        ctx.fillStyle = ribbonGrads[i];
        ctx.fill();
      }

      // 3. Paint pre-computed ambient radial bloom
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollYProgress]);

  return (
    // 240vh Scroll runway on desktop; natural viewport flow on mobile
    <div
      ref={containerRef}
      id="top"
      className={`relative ${isMobile ? "min-h-[100svh]" : "h-[240vh]"} w-full bg-white`}
    >
      {/* Pinned Sticky Viewport on Desktop / Full-height container on Mobile */}
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

        {/* The Entire Hero Section Capsule that zooms out on scroll on desktop */}
        <motion.div
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
            isMobile ? "min-h-[100svh] bg-[#edf6ff]" : "h-full max-w-[100vw] max-h-[100vh] bg-white"
          } flex items-center justify-center overflow-hidden origin-center will-change-transform [transform:translateZ(0)]`}
        >
          {/* Silk Canvas Simulation background */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-95 [transform:translateZ(0)]"
            aria-hidden="true"
          />

          {/* Subtle bottom fade */}
          <div
            className={`absolute inset-x-0 bottom-0 ${
              isMobile ? "h-14" : "h-36"
            } bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10`}
          />

          {/* Content Container */}
          <motion.div
            style={isMobile ? { scale: 1 } : { scale: textScale }}
            className="relative z-20 max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 w-full pt-24 md:pt-16 pb-16 md:pb-12"
          >
            <div className="max-w-6xl">
              {/* Main Editorial Headline with Chrome Specular Light Effect & Staggered Rise */}
              <h1 className="font-serif font-bold tracking-[-0.035em] text-[#1f4a74] text-3xl sm:text-5xl md:text-7xl lg:text-[74px] xl:text-[82px] leading-[1.08] mb-6 sm:mb-8 select-none">
                <div className="overflow-hidden py-1">
                  <motion.span
                    initial={{ y: "115%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-line block max-w-full"
                    data-text="Systems with soul."
                  >
                    Systems with soul.
                  </motion.span>
                </div>
                <div className="overflow-hidden py-1 mt-0.5">
                  <motion.span
                    initial={{ y: "115%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-line block max-w-full"
                    data-text="I write code that breathes."
                  >
                    I write code that breathes.
                  </motion.span>
                </div>
                <span className="sr-only"> — Danish Syazwan | Full-Stack Software Engineer & Distributed Systems Developer</span>
              </h1>

              {/* Intro Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-xl text-[#1b4c78] font-sans text-sm sm:text-lg md:text-xl leading-relaxed tracking-[-0.015em] mb-8 sm:mb-10 opacity-90"
              >
                <p>
                  Hello, I&apos;m <span className="font-medium text-[#1b4c78]">Danish Syazwan</span>. I&apos;m a full-stack
                  developer obsessed with bridging high-fidelity interaction design, resilient distributed systems, and
                  production-grade performance.
                </p>
              </motion.div>

              {/* Action CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base md:text-lg font-sans"
              >
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 text-[#1b4c78] font-normal hover:text-[#2e5189] transition-colors group"
                >
                  <ArrowDownLeft className="w-5 h-5 text-sky transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                  <span>Let&apos;s Talk</span>
                </a>
                <span className="text-sky/40 font-light select-none">/</span>
                <a
                  href="#work"
                  className="inline-flex items-center gap-1.5 text-[#1b4c78] font-normal hover:text-[#2e5189] transition-colors group"
                >
                  <span>Selected Works</span>
                  <ChevronDown className="w-4 h-4 text-sky/70 transition-transform group-hover:translate-y-0.5" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Scroll Down Indicator (fades out as runway starts) */}
      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-2 pointer-events-none"
      >
        <span className="font-mono text-[10px] text-[#1b4c78]/60 tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-1 h-3 rounded-full bg-[#1b4c78]/30"
        />
      </motion.div>
    </div>
  );
}
