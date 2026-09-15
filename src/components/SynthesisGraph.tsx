"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal, TextLineReveal, ZoomInReveal } from "./MotionReveal";

interface NodeItem {
  id: number;
  label: string;
  isPrimary?: boolean;
  domain: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const initialNodes: Omit<NodeItem, "x" | "y" | "vx" | "vy">[] = [
  // 3 Primaries
  { id: 0, label: "Frontend Architecture", isPrimary: true, domain: "frontend" },
  { id: 1, label: "Distributed Systems", isPrimary: true, domain: "systems" },
  { id: 2, label: "Creative Engineering", isPrimary: true, domain: "creative" },

  // Frontend nodes
  { id: 3, label: "React & Next.js", domain: "frontend" },
  { id: 4, label: "TypeScript", domain: "frontend" },
  { id: 5, label: "State Machines", domain: "frontend" },

  // Systems nodes
  { id: 6, label: "PostgreSQL & Prisma", domain: "systems" },
  { id: 7, label: "WebSockets & CRDTs", domain: "systems" },
  { id: 8, label: "Docker & Cloud Deploy", domain: "systems" },

  // Creative nodes
  { id: 9, label: "WebGL & Shaders", domain: "creative" },
  { id: 10, label: "Micro-Interactions", domain: "creative" },
  { id: 11, label: "Canvas Physics", domain: "creative" },

  // Bridges (cross-domain)
  { id: 12, label: "Zero-Latency UI", domain: "frontend systems" },
  { id: 13, label: "Core Web Vitals", domain: "frontend creative" },
  { id: 14, label: "Real-Time Telemetry", domain: "systems creative" },
];

export default function SynthesisGraph() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const nodesRef = useRef<NodeItem[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = container.offsetWidth);
    let height = (canvas.height = container.offsetHeight);

    // Initialize node positions in a balanced constellation
    const centerX = width / 2;
    const centerY = height / 2;

    nodesRef.current = initialNodes.map((n, i) => {
      let angle = (i / initialNodes.length) * Math.PI * 2;
      let radius = n.isPrimary ? Math.min(width, height) * 0.28 : Math.min(width, height) * 0.38;

      if (n.id === 0) {
        // Frontend (top-left)
        angle = -Math.PI * 0.75;
      } else if (n.id === 1) {
        // Systems (top-right)
        angle = -Math.PI * 0.25;
      } else if (n.id === 2) {
        // Creative (bottom)
        angle = Math.PI * 0.5;
      }

      return {
        ...n,
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 40,
        y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      };
    });

    let frameId: number;
    let isVisible = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(frameId);
          frameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;

      // Soft physics drift & container boundaries
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Gentle bounce off bounds
        if (node.x < 80 || node.x > width - 80) node.vx *= -1;
        if (node.y < 80 || node.y > height - 80) node.vy *= -1;
      });

      // Draw connection lines between related domains
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          // Check if they share any domain
          const aDomains = a.domain.split(" ");
          const bDomains = b.domain.split(" ");
          const shareDomain = aDomains.some((d) => bDomains.includes(d));

          if (shareDomain) {
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 420) {
              const isHighlighted =
                hoveredNode === a.id ||
                hoveredNode === b.id ||
                (activeDomain && a.domain.includes(activeDomain) && b.domain.includes(activeDomain));

              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);

              if (isHighlighted) {
                ctx.strokeStyle = "rgba(46, 104, 168, 0.75)";
                ctx.lineWidth = 1.6;
              } else {
                ctx.strokeStyle = "rgba(190, 215, 235, 0.35)";
                ctx.lineWidth = 0.8;
              }
              ctx.stroke();
            }
          }
        }
      }

      frameId = requestAnimationFrame(render);
    };

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeDomain, hoveredNode]);

  return (
    <section id="synthesis" className="py-24 md:py-32 px-6 md:px-12 border-t border-[#1b4c78]/10 bg-[#f8fbfe]">
      <div className="max-w-[1320px] mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <TextLineReveal>
              <h2 className="font-serif text-4xl sm:text-5xl text-[#1b4c78] tracking-tight leading-none mb-3">
                Taxonomy &amp; Synthesis
              </h2>
            </TextLineReveal>
            <Reveal delay={0.15}>
              <p className="font-sans text-base sm:text-lg text-navy/70 max-w-xl">
                An interconnected mental model of full-stack engineering: where interface intuition, distributed systems,
                and creative algorithms cross-pollinate.
              </p>
            </Reveal>
          </div>
          <div className="font-mono text-xs text-navy/40 uppercase tracking-widest self-start md:self-end">
            05 / KNOWLEDGE GRAPH
          </div>
        </header>

        {/* Interactive Constellation Graph Box - Zooms In on scroll */}
        <ZoomInReveal delay={0.15}>
          <div
            ref={containerRef}
            className="relative w-full h-[540px] sm:h-[620px] bg-white border border-[#1b4c78]/15 overflow-hidden flex items-center justify-center select-none"
          >
            {/* Canvas for connecting lines */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

            {/* Center Title Badge */}
            <div className="absolute text-center pointer-events-none z-10 bg-white/90 backdrop-blur-md px-6 py-4 border border-[#1b4c78]/15">
              <div className="font-serif text-3xl sm:text-4xl text-[#1b4c78] leading-none">Engineering</div>
              <div className="font-mono text-xs text-[#3f6aa6] uppercase tracking-widest mt-1">as synthesis</div>
            </div>

          {/* Interactive Floating HTML Word Nodes */}
          {initialNodes.map((node) => {
            const isHovered = hoveredNode === node.id;
            const isRelated =
              activeDomain && node.domain.includes(activeDomain);

            return (
              <div
                key={node.id}
                onMouseEnter={() => {
                  setHoveredNode(node.id);
                  if (node.isPrimary) {
                    setActiveDomain(node.domain);
                  }
                }}
                onMouseLeave={() => {
                  setHoveredNode(null);
                  setActiveDomain(null);
                }}
                className={`absolute z-20 cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-none border ${
                  node.isPrimary
                    ? "bg-[#1b4c78] text-white border-[#1b4c78] font-serif text-lg sm:text-xl shadow-md hover:scale-105"
                    : isHovered || isRelated
                    ? "bg-[#edf6ff] text-[#1b4c78] border-[#3f6aa6] font-sans text-xs sm:text-sm font-medium scale-105 shadow-sm"
                    : "bg-white/95 text-[#1b4c78]/80 border-[#1b4c78]/15 font-sans text-xs sm:text-sm hover:bg-[#f0f7ff] hover:text-[#1b4c78]"
                }`}
                style={{
                  // Position node according to its reference coordinate
                  left: nodesRef.current[node.id]?.x || "50%",
                  top: nodesRef.current[node.id]?.y || "50%",
                }}
              >
                {node.label}
              </div>
            );
          })}
          </div>
        </ZoomInReveal>
      </div>
    </section>
  );
}
