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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);

    let width = (canvas.width = Math.floor(window.innerWidth * dpr));
    let height = (canvas.height = Math.floor(window.innerHeight * dpr));
    let displayWidth = window.innerWidth;
    let displayHeight = window.innerHeight;
    ctx.scale(dpr, dpr);

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
      width = canvas.width = Math.floor(displayWidth * dpr);
      height = canvas.height = Math.floor(displayHeight * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
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

    // Helper: draw closed smooth loop with quadratic bezier through midpoints
    const drawClosedSmoothLoop = (
      points: { x: number; y: number }[],
      strokeStyle: string,
      lineWidth: number,
      dash?: number[]
    ) => {
      if (points.length < 3) return;
      ctx.save();
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      if (dash) ctx.setLineDash(dash);
      else ctx.setLineDash([]);
      ctx.beginPath();

      const p0 = points[0];
      const p1 = points[1];
      ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);

      for (let i = 1; i < points.length; i++) {
        const curr = points[i];
        const next = points[(i + 1) % points.length];
        const midX = (curr.x + next.x) / 2;
        const midY = (curr.y + next.y) / 2;
        ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
      }

      // Close to first midpoint
      const mid01X = (p0.x + p1.x) / 2;
      const mid01Y = (p0.y + p1.y) / 2;
      ctx.quadraticCurveTo(p0.x, p0.y, mid01X, mid01Y);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    // Helper: draw open smooth curve across the canvas
    const drawOpenSmoothCurve = (
      points: { x: number; y: number }[],
      strokeStyle: string,
      lineWidth: number,
      dash?: number[]
    ) => {
      if (points.length < 2) return;
      ctx.save();
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      if (dash) ctx.setLineDash(dash);
      else ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const midX = (curr.x + next.x) / 2;
        const midY = (curr.y + next.y) / 2;
        ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.stroke();
      ctx.restore();
    };

    const render = () => {
      if (!isVisible) return;

      time += 0.007;

      // Smooth scroll interpolation
      const targetScroll = scrollYProgress ? scrollYProgress.get() : 0;
      smoothScroll += (targetScroll - smoothScroll) * 0.08;

      // Mouse smooth interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;
      const mouseNormX = (mouse.x / displayWidth - 0.5) * 40;
      const mouseNormY = (mouse.y / displayHeight - 0.5) * 30;

      // Total animated phase combined from continuous time + scroll displacement
      const motionPhase = time + smoothScroll * 6.5;

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // ── PEAK 1: Major Mountain Summit (Center-Right) ──────────────────────
      const peak1X = displayWidth * 0.72 + mouseNormX * 0.8;
      const peak1Y = displayHeight * 0.48 + mouseNormY * 0.8;
      const peak1Rings = 15;

      for (let k = 1; k <= peak1Rings; k++) {
        const baseRadius = 28 + k * 26;
        const ringPoints: { x: number; y: number }[] = [];
        const numSteps = 72;
        const isIndex = k % 4 === 0;

        for (let i = 0; i < numSteps; i++) {
          const theta = (i / numSteps) * Math.PI * 2;

          // Multi-frequency harmonic perturbation that flows over time and scroll
          const warp1 = Math.sin(theta * 2 + motionPhase * 0.85 + k * 0.22) * (baseRadius * 0.12);
          const warp2 = Math.cos(theta * 3 - motionPhase * 0.6 + k * 0.15) * (baseRadius * 0.07);
          const warp3 = Math.sin(theta * 5 + motionPhase * 1.1 - k * 0.1) * (baseRadius * 0.035);

          const r = baseRadius + warp1 + warp2 + warp3;
          ringPoints.push({
            x: peak1X + Math.cos(theta) * r,
            y: peak1Y + Math.sin(theta) * r,
          });
        }

        const color = isIndex ? "rgba(27, 76, 120, 0.42)" : "rgba(30, 80, 130, 0.18)";
        const width = isIndex ? 1.5 : 0.85;
        drawClosedSmoothLoop(ringPoints, color, width);

        // Draw elevation label on index contours
        if (isIndex && ringPoints.length > 18) {
          const labelPt = ringPoints[18];
          ctx.save();
          ctx.font = "9px monospace";
          ctx.fillStyle = "rgba(27, 76, 120, 0.5)";
          ctx.fillText(`+${k * 50}M`, labelPt.x + 3, labelPt.y - 3);
          ctx.restore();
        }
      }

      // Summit center mark
      ctx.save();
      ctx.strokeStyle = "rgba(27, 76, 120, 0.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(peak1X, peak1Y, 3.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // ── PEAK 2: Secondary Elevation Dome (Bottom-Left) ────────────────────
      const peak2X = displayWidth * 0.2 + mouseNormX * 0.5;
      const peak2Y = displayHeight * 0.74 + mouseNormY * 0.5;
      const peak2Rings = 11;

      for (let k = 1; k <= peak2Rings; k++) {
        const baseRadius = 24 + k * 22;
        const ringPoints: { x: number; y: number }[] = [];
        const numSteps = 64;
        const isIndex = k % 4 === 0;

        for (let i = 0; i < numSteps; i++) {
          const theta = (i / numSteps) * Math.PI * 2;
          const warp1 = Math.sin(theta * 2 - motionPhase * 0.75 + k * 0.2) * (baseRadius * 0.14);
          const warp2 = Math.cos(theta * 3 + motionPhase * 0.5 - k * 0.12) * (baseRadius * 0.08);

          const r = baseRadius + warp1 + warp2;
          ringPoints.push({
            x: peak2X + Math.cos(theta) * r,
            y: peak2Y + Math.sin(theta) * r,
          });
        }

        const color = isIndex ? "rgba(27, 76, 120, 0.38)" : "rgba(30, 80, 130, 0.16)";
        const width = isIndex ? 1.4 : 0.8;
        drawClosedSmoothLoop(ringPoints, color, width);
      }

      // ── PEAK 3: Upper-Right High Plateau ──────────────────────────────────
      const peak3X = displayWidth * 0.86 + mouseNormX * 0.3;
      const peak3Y = displayHeight * 0.14 + mouseNormY * 0.3;
      const peak3Rings = 7;

      for (let k = 1; k <= peak3Rings; k++) {
        const baseRadius = 20 + k * 20;
        const ringPoints: { x: number; y: number }[] = [];
        const numSteps = 56;
        const isIndex = k % 3 === 0;

        for (let i = 0; i < numSteps; i++) {
          const theta = (i / numSteps) * Math.PI * 2;
          const warp1 = Math.sin(theta * 2 + motionPhase * 0.6 + k * 0.25) * (baseRadius * 0.11);
          const r = baseRadius + warp1;
          ringPoints.push({
            x: peak3X + Math.cos(theta) * r,
            y: peak3Y + Math.sin(theta) * r,
          });
        }

        const color = isIndex ? "rgba(27, 76, 120, 0.32)" : "rgba(30, 80, 130, 0.14)";
        const width = isIndex ? 1.3 : 0.75;
        drawClosedSmoothLoop(ringPoints, color, width);
      }

      // ── TRANSVERSE RIDGELINES: Sweeping Terrain Contours Across Canvas ────
      const numRidges = 15;
      const stepX = 28;

      for (let j = 0; j < numRidges; j++) {
        const baseY = (j / (numRidges - 1)) * (displayHeight + 200) - 100;
        const ridgePoints: { x: number; y: number }[] = [];
        const isIndex = j % 4 === 0;

        for (let x = -60; x <= displayWidth + 60; x += stepX) {
          // Broad natural terrain wave
          const wave1 = Math.sin(x * 0.0022 + motionPhase * 0.7 + j * 0.38) * 38;
          const wave2 = Math.cos(x * 0.0045 - motionPhase * 0.5 - j * 0.22) * 20;

          // Deflection around Peak 1
          const d1x = x - peak1X;
          const d1y = baseY - peak1Y;
          const dist1 = Math.sqrt(d1x * d1x + d1y * d1y);
          let deflect1 = 0;
          if (dist1 < 380) {
            const factor = Math.pow(1 - dist1 / 380, 2);
            deflect1 = (d1y >= 0 ? 1 : -1) * factor * 55;
          }

          // Deflection around Peak 2
          const d2x = x - peak2X;
          const d2y = baseY - peak2Y;
          const dist2 = Math.sqrt(d2x * d2x + d2y * d2y);
          let deflect2 = 0;
          if (dist2 < 260) {
            const factor = Math.pow(1 - dist2 / 260, 2);
            deflect2 = (d2y >= 0 ? 1 : -1) * factor * 40;
          }

          const y = baseY + wave1 + wave2 + deflect1 + deflect2;
          ridgePoints.push({ x, y });
        }

        const color = isIndex ? "rgba(27, 76, 120, 0.34)" : "rgba(30, 80, 130, 0.15)";
        const width = isIndex ? 1.3 : 0.75;
        drawOpenSmoothCurve(ridgePoints, color, width);
      }

      // ── VALLEY / FAULT CONTOUR (Dashed lines winding across saddle) ────────
      const faultPoints: { x: number; y: number }[] = [];
      for (let y = -50; y <= displayHeight + 50; y += 30) {
        const x =
          displayWidth * 0.44 +
          Math.sin(y * 0.003 + motionPhase * 0.6) * 90 +
          Math.cos(y * 0.007 - motionPhase * 0.4) * 45;
        faultPoints.push({ x, y });
      }
      drawOpenSmoothCurve(faultPoints, "rgba(56, 189, 248, 0.35)", 1.2, [6, 6]);

      // ── MINIMAL CARTOGRAPHIC RETICLE / ANNOTATIONS ────────────────────────
      ctx.save();
      ctx.fillStyle = "rgba(27, 76, 120, 0.45)";
      ctx.font = "10px monospace";
      ctx.fillText("LAT 03°08'N · LON 101°41'E", 40, 50);
      ctx.fillText("TERRAIN CONTOURS // DYNAMIC ELEVATION", 40, 66);
      ctx.fillText("CONTOUR INT: 25M", displayWidth - 170, displayHeight - 40);

      // Delicate grid crosses (+)
      const crossCoords = [
        { x: displayWidth * 0.12, y: displayHeight * 0.22 },
        { x: displayWidth * 0.48, y: displayHeight * 0.18 },
        { x: displayWidth * 0.42, y: displayHeight * 0.82 },
        { x: displayWidth * 0.88, y: displayHeight * 0.85 },
      ];
      ctx.strokeStyle = "rgba(27, 76, 120, 0.3)";
      ctx.lineWidth = 1;
      crossCoords.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x + 5, y);
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x, y + 5);
        ctx.stroke();
      });
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

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
      className="w-full h-full object-cover pointer-events-none select-none"
      aria-hidden="true"
    />
  );
}
