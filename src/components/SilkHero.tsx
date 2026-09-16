"use client";

import { useEffect, useRef } from "react";
import { ArrowDownLeft, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import TopographyBackground from "./TopographyBackground";

export default function SilkHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scroll runway: 240vh total scroll distance
  // start start: hero starts full screen
  // end end: hero finishes zooming out & fades into white grid bg, then normal scroll continues
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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: width * 0.7, y: height * 0.4, targetX: width * 0.7, targetY: height * 0.4 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

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

    const render = () => {
      if (!isVisible) return;
      time += 0.005;

      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Radiant background
      const baseGrad = ctx.createLinearGradient(0, 0, width, height);
      baseGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
      baseGrad.addColorStop(0.3, "rgba(240, 248, 255, 0.9)");
      baseGrad.addColorStop(0.65, "rgba(200, 228, 248, 0.75)");
      baseGrad.addColorStop(1, "rgba(164, 207, 240, 0.85)");
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // Flowing silk ribbon waves
      const ribbons = [
        {
          color1: "rgba(200, 228, 248, 0.55)",
          color2: "rgba(124, 184, 232, 0.45)",
          speed: 1.0,
          amp: 120,
          freq: 0.0018,
          xOffset: width * 0.35,
        },
        {
          color1: "rgba(164, 207, 240, 0.45)",
          color2: "rgba(237, 246, 255, 0.65)",
          speed: 0.8,
          amp: 160,
          freq: 0.0014,
          xOffset: width * 0.55,
        },
        {
          color1: "rgba(124, 184, 232, 0.35)",
          color2: "rgba(200, 228, 248, 0.4)",
          speed: 1.2,
          amp: 140,
          freq: 0.002,
          xOffset: width * 0.72,
        },
        {
          color1: "rgba(245, 250, 255, 0.6)",
          color2: "rgba(164, 207, 240, 0.3)",
          speed: 0.7,
          amp: 190,
          freq: 0.0012,
          xOffset: width * 0.85,
        },
      ];

      ribbons.forEach((ribbon, i) => {
        ctx.beginPath();
        const t = time * ribbon.speed;

        const startX = ribbon.xOffset + Math.sin(t + i) * 60 + ((mouse.x - width / 2) * (i + 1) * 0.06);

        ctx.moveTo(startX, -50);

        for (let y = -50; y <= height + 50; y += 35) {
          const distortion =
            Math.sin(y * ribbon.freq + t) * ribbon.amp +
            Math.cos(y * ribbon.freq * 2.2 - t * 0.8) * (ribbon.amp * 0.4);

          const dx = mouse.x - (startX + distortion);
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseEffect = Math.max(0, 1 - dist / 380) * 45;

          const cx = startX + distortion - (dx / (dist + 1)) * mouseEffect;
          ctx.lineTo(cx, y);
        }

        ctx.lineTo(width + 100, height + 50);
        ctx.lineTo(width + 100, -50);
        ctx.closePath();

        const grad = ctx.createLinearGradient(ribbon.xOffset, 0, width, height);
        grad.addColorStop(0, ribbon.color1);
        grad.addColorStop(1, ribbon.color2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Ambient radial bloom behind headline
      const glow = ctx.createRadialGradient(
        width * 0.4,
        height * 0.45,
        50,
        width * 0.4,
        height * 0.45,
        width * 0.6
      );
      glow.addColorStop(0, "rgba(255, 255, 255, 0.85)");
      glow.addColorStop(0.5, "rgba(237, 246, 255, 0.3)");
      glow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    // 240vh Scroll runway: User scrolls through this distance to trigger the hero zoom-out into the white grid
    <div ref={containerRef} id="top" className="relative h-[240vh] bg-white">
      {/* Pinned Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-white">
        {/* Topographic contour background — reveals as hero zooms out */}
        <motion.div
          style={{ opacity: topoOpacity, scale: topoScale }}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 will-change-transform"
        >
          <TopographyBackground scrollYProgress={scrollYProgress} />
        </motion.div>
        {/* The Entire Hero Section Capsule that zooms out on scroll */}
        <motion.div
          style={{
            scale: heroScale,
            borderRadius: heroRadius,
            border: heroBorder,
            boxShadow: heroShadow,
            opacity: heroOpacity,
          }}
          className="relative w-full h-full max-w-[100vw] max-h-[100vh] flex items-center justify-center overflow-hidden bg-white origin-center will-change-transform"
        >
          {/* Silk Canvas Simulation background */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-95"
            aria-hidden="true"
          />

          {/* Subtle bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />

          {/* Content Container */}
          <motion.div
            style={{ scale: textScale }}
            className="relative z-20 max-w-[1320px] mx-auto px-6 md:px-12 w-full pt-16 pb-12"
          >
            <div className="max-w-6xl">
              {/* Main Editorial Headline with Chrome Specular Light Effect & Staggered Rise */}
              <h1 className="font-serif font-bold tracking-[-0.035em] text-[#1f4a74] text-4xl sm:text-6xl md:text-7xl lg:text-[74px] xl:text-[82px] leading-[1.06] mb-8 select-none">
                <div className="overflow-hidden py-1">
                  <motion.span
                    initial={{ y: "115%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-line block"
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
                    className="glass-line block"
                    data-text="I write code that breathes."
                  >
                    I write code that breathes.
                  </motion.span>
                </div>
              </h1>

              {/* Intro Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-xl text-[#1b4c78] font-sans text-base sm:text-lg md:text-xl leading-relaxed tracking-[-0.015em] mb-10 opacity-90"
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
                className="flex flex-wrap items-center gap-4 text-base md:text-lg font-sans"
              >
                <a
                  href="mailto:contact@danishsyazwan.dev"
                  className="inline-flex items-center gap-2 text-[#1b4c78] font-normal hover:text-[#2e5189] transition-colors group"
                >
                  <ArrowDownLeft className="w-5 h-5 text-sky transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                  <span>Let&apos;s Talk</span>
                </a>

                <a href="#work" className="bracket-btn text-base font-normal">
                  View work
                </a>

                <a
                  href="https://github.com/dnishsyzwn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bracket-btn text-base font-normal text-navy/70 hover:text-navy"
                >
                  GitHub ↗
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* Minimalist scroll prompt pill */}
          <motion.div
            style={{ opacity: scrollIndicatorOpacity }}
            className="absolute bottom-8 right-8 z-30 font-mono text-[11px] text-[#1b4c78]/60 flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-1.5 border border-[#1b4c78]/15 rounded-full"
          >
            <span>SCROLL TO ZOOM</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
