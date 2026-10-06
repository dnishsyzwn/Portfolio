"use client";

import { useEffect, useRef } from "react";
import { MotionValue } from "framer-motion";

interface TopographyBackgroundProps {
  scrollYProgress?: MotionValue<number>;
}

export default function TopographyBackground({ scrollYProgress }: TopographyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    // Cap DPR at 1 for massive fill-rate savings; quadratic curves are natively anti-aliased
    const dpr = 1;

    let displayWidth = window.innerWidth;
    let displayHeight = window.innerHeight;
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    let mouse = {
      x: displayWidth * 0.5,
      y: displayHeight * 0.5,
      targetX: displayWidth * 0.5,
      targetY: displayHeight * 0.5,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      displayWidth = window.innerWidth;
      displayHeight = window.innerHeight;
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(animId);
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let time = 0;
    let smoothScroll = 0;
    let lastRenderTime = 0;
    const fpsInterval = 1000 / 35; // Cap at 35 FPS for ambient contour background

    // Fast helper: draw closed smooth loop with quadratic bezier
    const drawClosedSmoothLoop = (
      points: { x: number; y: number }[],
      strokeStyle: string,
      lineWidth: number
    ) => {
      if (points.length < 3) return;
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();

      const p0 = points[0];
      const p1 = points[1];
      ctx.moveTo((p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5);

      for (let i = 1; i < points.length; i++) {
        const curr = points[i];
        const next = points[(i + 1) % points.length];
        ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) * 0.5, (curr.y + next.y) * 0.5);
      }

      ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5);
      ctx.closePath();
      ctx.stroke();
    };

    // Fast helper: draw open smooth curve across the canvas
    const drawOpenSmoothCurve = (
      points: { x: number; y: number }[],
      strokeStyle: string,
      lineWidth: number
    ) => {
      if (points.length < 2) return;
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) * 0.5, (curr.y + next.y) * 0.5);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.stroke();
    };

    let drawnInitial = false;

    const render = (now: number) => {
      if (!isVisible) return;
      animId = requestAnimationFrame(render);

      // Scroll threshold optimization: when at very top (< 0.05 scroll), hero covers background completely
      const targetScroll = scrollYProgress ? scrollYProgress.get() : 0;
      if (targetScroll < 0.04 && drawnInitial) {
        return; // Skip animation calculations when completely hidden behind opaque SilkHero
      }

      if (now - lastRenderTime < fpsInterval) return;
      lastRenderTime = now;
      drawnInitial = true;

      time += 0.006;
      smoothScroll += (targetScroll - smoothScroll) * 0.08;

      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;
      const mouseNormX = (mouse.x / displayWidth - 0.5) * 35;
      const mouseNormY = (mouse.y / displayHeight - 0.5) * 25;

      const motionPhase = time + smoothScroll * 6.0;

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // ── PEAK 1: Major Mountain Summit (Center-Right) ──────────────────────
      const peak1X = displayWidth * 0.72 + mouseNormX * 0.8;
      const peak1Y = displayHeight * 0.48 + mouseNormY * 0.8;
      const peak1Rings = 9;

      for (let k = 1; k <= peak1Rings; k++) {
        const baseRadius = 30 + k * 35;
        const ringPoints: { x: number; y: number }[] = [];
        const numSteps = 40;
        const isIndex = k % 3 === 0;

        for (let i = 0; i < numSteps; i++) {
          const theta = (i / numSteps) * Math.PI * 2;
          const warp1 = Math.sin(theta * 2 + motionPhase * 0.85 + k * 0.22) * (baseRadius * 0.12);
          const warp2 = Math.cos(theta * 3 - motionPhase * 0.6 + k * 0.15) * (baseRadius * 0.06);

          const r = baseRadius + warp1 + warp2;
          ringPoints.push({
            x: peak1X + Math.cos(theta) * r,
            y: peak1Y + Math.sin(theta) * r,
          });
        }

        const color = isIndex ? "rgba(27, 76, 120, 0.42)" : "rgba(30, 80, 130, 0.18)";
        const width = isIndex ? 1.4 : 0.8;
        drawClosedSmoothLoop(ringPoints, color, width);
      }

      // ── PEAK 2: Secondary Elevation Dome (Bottom-Left) ────────────────────
      const peak2X = displayWidth * 0.2 + mouseNormX * 0.5;
      const peak2Y = displayHeight * 0.74 + mouseNormY * 0.5;
      const peak2Rings = 7;

      for (let k = 1; k <= peak2Rings; k++) {
        const baseRadius = 26 + k * 32;
        const ringPoints: { x: number; y: number }[] = [];
        const numSteps = 36;
        const isIndex = k % 3 === 0;

        for (let i = 0; i < numSteps; i++) {
          const theta = (i / numSteps) * Math.PI * 2;
          const warp1 = Math.sin(theta * 2 - motionPhase * 0.75 + k * 0.2) * (baseRadius * 0.12);
          const r = baseRadius + warp1;
          ringPoints.push({
            x: peak2X + Math.cos(theta) * r,
            y: peak2Y + Math.sin(theta) * r,
          });
        }

        const color = isIndex ? "rgba(27, 76, 120, 0.38)" : "rgba(30, 80, 130, 0.16)";
        const width = isIndex ? 1.3 : 0.75;
        drawClosedSmoothLoop(ringPoints, color, width);
      }

      // ── PEAK 3: Upper-Right High Plateau ──────────────────────────────────
      const peak3X = displayWidth * 0.86 + mouseNormX * 0.3;
      const peak3Y = displayHeight * 0.14 + mouseNormY * 0.3;
      const peak3Rings = 5;

      for (let k = 1; k <= peak3Rings; k++) {
        const baseRadius = 22 + k * 28;
        const ringPoints: { x: number; y: number }[] = [];
        const numSteps = 30;
        const isIndex = k % 2 === 0;

        for (let i = 0; i < numSteps; i++) {
          const theta = (i / numSteps) * Math.PI * 2;
          const warp1 = Math.sin(theta * 2 + motionPhase * 0.6 + k * 0.25) * (baseRadius * 0.1);
          const r = baseRadius + warp1;
          ringPoints.push({
            x: peak3X + Math.cos(theta) * r,
            y: peak3Y + Math.sin(theta) * r,
          });
        }

        const color = isIndex ? "rgba(27, 76, 120, 0.32)" : "rgba(30, 80, 130, 0.14)";
        const width = isIndex ? 1.2 : 0.7;
        drawClosedSmoothLoop(ringPoints, color, width);
      }

      // ── TRANSVERSE RIDGELINES: Sweeping Terrain Contours Across Canvas ────
      const numRidges = 8;
      const stepX = 52;

      for (let j = 0; j < numRidges; j++) {
        const baseY = (j / (numRidges - 1)) * (displayHeight + 160) - 80;
        const ridgePoints: { x: number; y: number }[] = [];
        const isIndex = j % 3 === 0;

        for (let x = -40; x <= displayWidth + 40; x += stepX) {
          const wave1 = Math.sin(x * 0.0022 + motionPhase * 0.7 + j * 0.38) * 32;

          const d1x = x - peak1X;
          const d1y = baseY - peak1Y;
          const distSq1 = d1x * d1x + d1y * d1y;
          let deflect1 = 0;
          if (distSq1 < 360 * 360) {
            const dist1 = Math.sqrt(distSq1);
            deflect1 = (d1y >= 0 ? 1 : -1) * Math.pow(1 - dist1 / 360, 2) * 50;
          }

          const y = baseY + wave1 + deflect1;
          ridgePoints.push({ x, y });
        }

        const color = isIndex ? "rgba(27, 76, 120, 0.32)" : "rgba(30, 80, 130, 0.14)";
        const width = isIndex ? 1.2 : 0.7;
        drawOpenSmoothCurve(ridgePoints, color, width);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollYProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    />
  );
}
