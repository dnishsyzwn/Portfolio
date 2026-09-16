"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextLineReveal } from "./MotionReveal";

export interface TechItem {
  name: string;
  tag: string;
  category: string;
  // Single clean logo for each stack item (Pinterest dashboard style)
  logo: string;
}

export const columns: TechItem[][] = [
  // ── Column 1 (Moves UP slightly on scroll) ──────────────────────────────
  [
    {
      name: "Next.js",
      tag: "v15 App Router",
      category: "Full-Stack Web Framework",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
    },
    {
      name: "TypeScript",
      tag: "Strict Mode",
      category: "Type-Safe Architecture",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
    },
    {
      name: "Java",
      tag: "Java 21 / OOP",
      category: "Enterprise Systems & Threading",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
    },
    {
      name: "Tailwind CSS",
      tag: "v4.0 JIT",
      category: "Utility-First Design Tokens",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    },
  ],

  // ── Column 2 (Moves DOWN slightly on scroll) ────────────────────────────
  [
    {
      name: "React",
      tag: "v19 Runtime",
      category: "Reactive UI & Component Tree",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    },
    {
      name: "Spring Boot",
      tag: "Microservices",
      category: "Distributed REST & SOAP APIs",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg",
    },
    {
      name: "MySQL",
      tag: "Relational DB",
      category: "Multi-Service Schema & SQL",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
    },
    {
      name: "RabbitMQ",
      tag: "Async AMQP",
      category: "Event Queues & Topic Exchanges",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rabbitmq/rabbitmq-original.svg",
    },
  ],

  // ── Column 3 (Moves UP slightly on scroll) ──────────────────────────────
  [
    {
      name: "C++",
      tag: "Algorithms",
      category: "Data Structures & Memory Control",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
    },
    {
      name: "Docker",
      tag: "Containers",
      category: "Environment Isolation & DevOps",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
    },
    {
      name: "Node.js",
      tag: "V8 Engine",
      category: "Backend Execution Runtime",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    },
    {
      name: "Python",
      tag: "Automation",
      category: "Scripting & Data Processing",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    },
  ],

  // ── Column 4 (Moves DOWN slightly on scroll) ────────────────────────────
  [
    {
      name: "Git & GitHub",
      tag: "VCS / CI-CD",
      category: "Version Control & Collaboration",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
    },
    {
      name: "Postman",
      tag: "API QA",
      category: "Endpoint & Payload Validation",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg",
    },
    {
      name: "PostgreSQL",
      tag: "ACID Storage",
      category: "High-Throughput Relational DB",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
    },
    {
      name: "JavaScript",
      tag: "ESNext",
      category: "Client-Side DOM & Interactivity",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
    },
  ],
];

export default function ToolsMarquee() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Scroll tracking across the section for subtle parallax offsets
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // ── Subtle Parallax Offsets on Scroll ────────────────────────────────────
  // Row/Column 1: Moves UP as user scrolls down
  const col1Y = useTransform(scrollYProgress, [0, 1], [45, -45]);

  // Row/Column 2: Moves DOWN as user scrolls down
  const col2Y = useTransform(scrollYProgress, [0, 1], [-45, 45]);

  // Row/Column 3: Moves UP as user scrolls down
  const col3Y = useTransform(scrollYProgress, [0, 1], [55, -55]);

  // Row/Column 4: Moves DOWN as user scrolls down
  const col4Y = useTransform(scrollYProgress, [0, 1], [-55, 55]);

  const colTransforms = [col1Y, col2Y, col3Y, col4Y];

  return (
    <section
      ref={sectionRef}
      id="stack"
      className="relative py-28 md:py-36 px-6 md:px-12 bg-[#0b1c2e] text-[#ddeaf5] border-t border-[#1e456d]/40 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#1a385c]/20 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto relative z-10">
        {/* Section Header */}
        <header className="mb-16 md:mb-20">
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
        </header>

        {/* ── 4-Column Pinterest Masonry Grid ─────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-start">
          {columns.map((colItems, colIdx) => (
            <motion.div
              key={colIdx}
              style={{ y: colTransforms[colIdx] }}
              className={`flex flex-col gap-4 md:gap-6 will-change-transform ${
                colIdx === 1 ? "md:pt-10" : colIdx === 3 ? "md:pt-16" : ""
              }`}
            >
              {colItems.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="group relative w-full rounded-2xl md:rounded-3xl p-4 sm:p-5 bg-[#0e2238]/85 border border-[#1e456d]/50 hover:border-[#38bdf8]/60 hover:shadow-[0_12px_35px_-8px_rgba(0,0,0,0.55)] transition-all duration-300 ease-out hover:-translate-y-2 cursor-pointer select-none flex flex-col justify-between"
                >
                  {/* Pinterest Top: Visual Logo Showcase (1 clean image, no hover swap) */}
                  <div className="relative w-full aspect-[4/3] rounded-xl md:rounded-2xl bg-[#081320]/80 border border-[#1b3d60]/60 flex items-center justify-center p-5 overflow-hidden transition-all duration-300 group-hover:border-[#38bdf8]/40">
                    <img
                      src={item.logo}
                      alt={item.name}
                      loading="lazy"
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain drop-shadow-md transition-transform duration-300 ease-out group-hover:scale-110"
                    />
                  </div>

                  {/* Pinterest Bottom: Info & Tag Metadata */}
                  <div className="mt-4 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-sans font-semibold text-base sm:text-lg text-[#ddeaf5] tracking-tight leading-snug">
                        {item.name}
                      </h3>

                      <span className="font-mono text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-[#0b1c2e] text-[#38bdf8] border border-[#38bdf8]/30 tracking-wide whitespace-nowrap">
                        {item.tag}
                      </span>
                    </div>

                    <p className="font-sans text-xs sm:text-[13px] text-[#8bb1d3] leading-tight line-clamp-1">
                      {item.category}
                    </p>
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
