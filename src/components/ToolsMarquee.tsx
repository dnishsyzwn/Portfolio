"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextLineReveal } from "./MotionReveal";

interface TechItem {
  name: string;
  tag: string;
  category: string;
  // Default image: Clean 3D / stylized rendering of the technology
  defaultImage: string;
  // Hover image: Action / real-world production code or telemetry
  hoverImage: string;
}

const columns: TechItem[][] = [
  // ── Column 1 (Moves UP on scroll) ───────────────────────────────────────
  [
    {
      name: "TypeScript",
      tag: "2026",
      category: "Strict Type Architecture",
      defaultImage:
        "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?q=80&w=800&auto=format&fit=crop",
      hoverImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Next.js 15",
      tag: "App Router",
      category: "Full-Stack Framework",
      defaultImage:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
      hoverImage:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Go / Golang",
      tag: "Concurrency",
      category: "Systems & Goroutines",
      defaultImage:
        "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=800&auto=format&fit=crop",
      hoverImage:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Tailwind CSS",
      tag: "v4.0 JIT",
      category: "Design System Tokens",
      defaultImage:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
      hoverImage:
        "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop",
    },
  ],

  // ── Column 2 (Moves DOWN on scroll) ─────────────────────────────────────
  [
    {
      name: "React 19",
      tag: "Compiler",
      category: "Reactive UI Runtime",
      defaultImage:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop",
      hoverImage:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "PostgreSQL",
      tag: "ACID",
      category: "Relational Storage",
      defaultImage:
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop",
      hoverImage:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Docker & K8s",
      tag: "Containers",
      category: "Orchestration & VPC",
      defaultImage:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
      hoverImage:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "GraphQL",
      tag: "Federation",
      category: "Unified API Schema",
      defaultImage:
        "https://images.unsplash.com/photo-1526374870839-e155464bb9b2?q=80&w=800&auto=format&fit=crop",
      hoverImage:
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop",
    },
  ],

  // ── Column 3 (Moves UP on scroll) ───────────────────────────────────────
  [
    {
      name: "Node.js",
      tag: "V8 Engine",
      category: "Server Execution Engine",
      defaultImage:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
      hoverImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Redis",
      tag: "Sub-ms",
      category: "In-Memory Datastore",
      defaultImage:
        "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
      hoverImage:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "WebGL & GLSL",
      tag: "Shaders",
      category: "3D GPU Pipelines",
      defaultImage:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
      hoverImage:
        "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Git & CI/CD",
      tag: "Automated",
      category: "Continuous Deployment",
      defaultImage:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
      hoverImage:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
    },
  ],

  // ── Column 4 (Moves DOWN on scroll) ─────────────────────────────────────
  [
    {
      name: "Linux / POSIX",
      tag: "Kernel",
      category: "Production OS",
      defaultImage:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
      hoverImage:
        "https://images.unsplash.com/photo-1510519138171-c70d76b6408a?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "WebSockets",
      tag: "Sub-15ms",
      category: "Real-Time Telemetry",
      defaultImage:
        "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=800&auto=format&fit=crop",
      hoverImage:
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Prisma ORM",
      tag: "Type-Safe",
      category: "Automated Migrations",
      defaultImage:
        "https://images.unsplash.com/photo-1534972195531-a756b1126920?q=80&w=800&auto=format&fit=crop",
      hoverImage:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Distributed DB",
      tag: "CRDTs",
      category: "Fault-Tolerant Consensus",
      defaultImage:
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop",
      hoverImage:
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop",
    },
  ],
];

export default function ToolsMarquee() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Scroll tracking across the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // ── Subtle Parallax Offsets on Scroll ────────────────────────────────────
  // Row/Column 1: Moves UP as user scrolls down
  const col1Y = useTransform(scrollYProgress, [0, 1], [65, -65]);

  // Row/Column 2: Moves DOWN as user scrolls down
  const col2Y = useTransform(scrollYProgress, [0, 1], [-65, 65]);

  // Row/Column 3: Moves UP as user scrolls down
  const col3Y = useTransform(scrollYProgress, [0, 1], [75, -75]);

  // Row/Column 4: Moves DOWN as user scrolls down
  const col4Y = useTransform(scrollYProgress, [0, 1], [-75, 75]);

  const colTransforms = [col1Y, col2Y, col3Y, col4Y];

  return (
    <section
      ref={sectionRef}
      id="stack"
      className="relative py-28 md:py-36 px-6 md:px-12 bg-[#090e15] text-[#ddeaf5] border-t border-[#1e456d]/40 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#1a385c]/20 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto relative z-10">
        {/* Section Header */}
        <header className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#6fa3d4] mb-3 block">
              03 / TECHNICAL ARSENAL
            </span>
            <TextLineReveal>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#ddeaf5] tracking-tight leading-none">
                Tools &amp; Stack I Use
              </h2>
            </TextLineReveal>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-[#9dbfd9]/60 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span>HOVER TO INSPECT • SCROLL TO SHIFT</span>
          </div>
        </header>

        {/* ── 4-Column Parallax Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-start">
          {columns.map((colItems, colIdx) => (
            <motion.div
              key={colIdx}
              style={{ y: colTransforms[colIdx] }}
              className={`flex flex-col gap-4 md:gap-6 will-change-transform ${
                // Stagger column offsets visually on initial load (like the reference)
                colIdx === 1 ? "md:pt-14" : colIdx === 3 ? "md:pt-20" : ""
              }`}
            >
              {colItems.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="group relative aspect-square w-full rounded-2xl bg-[#0e1724]/80 border border-[#1b2f44] hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(250,204,21,0.22)] transition-all duration-500 overflow-hidden cursor-pointer select-none"
                >
                  {/* Image 1: Default 3D / stylized representation */}
                  <img
                    src={item.defaultImage}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:opacity-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />

                  {/* Image 2: Hover Action / Real-world production code or telemetry */}
                  <img
                    src={item.hoverImage}
                    alt={`${item.name} in production`}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out"
                  />

                  {/* Subtle dark vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090e15]/80 via-transparent to-transparent pointer-events-none" />

                  {/* ── Bottom Right Notch Tag (Exact reference styling) ───── */}
                  <div className="absolute bottom-3 right-3 z-10 bg-[#09101b]/90 border border-[#1e3852] group-hover:border-yellow-400/90 group-hover:bg-[#0c1422] transition-colors duration-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                    <span className="font-mono text-xs text-[#ddeaf5] font-medium tracking-tight">
                      {item.name}
                    </span>
                    <span className="font-mono text-xs font-bold text-yellow-400">
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
