"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextLineReveal } from "./MotionReveal";

export interface TechLogo {
  src: string;
  alt: string;
  invert?: boolean;
}

export interface TechItem {
  name: string;
  tag: string;
  category: string;
  logos: TechLogo[];
}

export const columns: TechItem[][] = [
  // ── Column 1: Modern Web, React Ecosystem & Styling ────────────────────
  [
    {
      name: "Next.js",
      tag: "Full-Stack",
      category: "React Framework & App Router",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
          alt: "Next.js",
        },
      ],
    },
    {
      name: "TypeScript",
      tag: "Strict Types",
      category: "Typed JavaScript Architecture",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
          alt: "TypeScript",
        },
      ],
    },
    {
      name: "React & React Native",
      tag: "Web & Mobile",
      category: "Reactive Web & Cross-Platform Mobile",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
          alt: "React & React Native",
        },
      ],
    },
    {
      name: "Tailwind CSS",
      tag: "Styling",
      category: "Utility-First Design Tokens",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
          alt: "Tailwind CSS",
        },
      ],
    },
    {
      name: "CSS",
      tag: "Styles",
      category: "Responsive Layouts & Visuals",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
          alt: "CSS3",
        },
      ],
    },
  ],

  // ── Column 2: Backend & Enterprise Systems ─────────────────────────────
  [
    {
      name: "Java",
      tag: "Core & OOP",
      category: "Enterprise Systems & Multithreading",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
          alt: "Java",
        },
      ],
    },
    {
      name: "Spring Boot",
      tag: "Backend",
      category: "Microservices & Distributed REST",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg",
          alt: "Spring Boot",
        },
      ],
    },
    {
      name: "PHP",
      tag: "Server-Side",
      category: "Dynamic Web & Backend Engines",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
          alt: "PHP",
        },
      ],
    },
    {
      name: "Laravel",
      tag: "MVC Framework",
      category: "Eloquent ORM & Web Applications",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
          alt: "Laravel",
        },
      ],
    },
    {
      name: "Node.js",
      tag: "Runtime",
      category: "Event-Driven Server Execution",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
          alt: "Node.js",
        },
      ],
    },
  ],

  // ── Column 3: Systems, .NET & Developer Tools ──────────────────────────
  [
    {
      name: "C#",
      tag: "OOP & .NET",
      category: "Strongly Typed Application Logic",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
          alt: "C#",
        },
      ],
    },
    {
      name: "ASP.NET",
      tag: "Web Forms",
      category: "Enterprise .NET Web Platforms",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg",
          alt: "ASP.NET",
        },
      ],
    },
    {
      name: "C++",
      tag: "Systems",
      category: "Data Structures & Memory Control",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
          alt: "C++",
        },
      ],
    },
    {
      name: "Postman",
      tag: "API QA",
      category: "Contract Testing & Verification",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg",
          alt: "Postman",
        },
      ],
    },
    {
      name: "Git & GitHub",
      tag: "VCS & CI/CD",
      category: "Version Control & Collaboration",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
          alt: "Git",
        },
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
          alt: "GitHub",
          invert: true,
        },
      ],
    },
  ],

  // ── Column 4: Databases & Web Foundations ──────────────────────────────
  [
    {
      name: "MySQL",
      tag: "Relational DB",
      category: "Relational Schemas & SQL Queries",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
          alt: "MySQL",
        },
      ],
    },
    {
      name: "MongoDB",
      tag: "NoSQL",
      category: "Document Store & BSON Collections",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
          alt: "MongoDB",
        },
      ],
    },
    {
      name: "Firebase",
      tag: "BaaS & Cloud",
      category: "Realtime Database & Auth",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
          alt: "Firebase",
        },
      ],
    },
    {
      name: "JavaScript",
      tag: "ESNext",
      category: "Interactive Client & Async Scripting",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
          alt: "JavaScript",
        },
      ],
    },
    {
      name: "HTML",
      tag: "Markup",
      category: "Semantic Structure & DOM Tree",
      logos: [
        {
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
          alt: "HTML5",
        },
      ],
    },
  ],
];

export default function ToolsMarquee() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll tracking across the section for subtle parallax offsets on desktop
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // ── Subtle Parallax Offsets on Scroll (Desktop only) ──────────────────────
  // Row/Column 1: Moves UP as user scrolls down
  const col1Y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // Row/Column 2: Moves DOWN as user scrolls down
  const col2Y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  // Row/Column 3: Moves UP as user scrolls down
  const col3Y = useTransform(scrollYProgress, [0, 1], [45, -45]);

  // Row/Column 4: Moves DOWN as user scrolls down
  const col4Y = useTransform(scrollYProgress, [0, 1], [-45, 45]);

  const colTransforms = [col1Y, col2Y, col3Y, col4Y];

  return (
    <section
      ref={sectionRef}
      id="stack"
      className="relative py-16 sm:py-24 md:py-36 px-4 sm:px-8 md:px-12 bg-[#0b1c2e] text-[#ddeaf5] border-t border-[#1e456d]/40 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#1a385c]/20 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto relative z-10">
        {/* Section Header */}
        <header className="mb-10 sm:mb-16 md:mb-20">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#6fa3d4] mb-2.5 block">
              03 / TECHNICAL ARSENAL
            </span>
            <TextLineReveal>
              <h2 className="font-serif font-bold text-3xl sm:text-5xl md:text-6xl text-[#ddeaf5] tracking-tight leading-none">
                Tools &amp; Stack I Use
              </h2>
            </TextLineReveal>
          </div>
        </header>

        {/* ── 4-Column Pinterest Masonry Grid (2 columns on mobile, 4 on desktop) ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 items-start">
          {columns.map((colItems, colIdx) => (
            <motion.div
              key={colIdx}
              style={{ y: isMobile ? 0 : colTransforms[colIdx] }}
              className={`flex flex-col gap-3 sm:gap-4 md:gap-6 will-change-transform ${
                colIdx === 1 ? "md:pt-10" : colIdx === 3 ? "md:pt-14" : ""
              }`}
            >
              {colItems.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="group relative w-full rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-5 bg-[#0e2238]/85 border border-[#1e456d]/50 hover:border-[#38bdf8]/60 hover:shadow-[0_12px_35px_-8px_rgba(0,0,0,0.55)] transition-all duration-300 ease-out md:hover:-translate-y-2 cursor-pointer select-none flex flex-col justify-between"
                >
                  {/* Pinterest Top: Visual Logo Showcase (Single or paired images) */}
                  <div className="relative w-full aspect-[4/3] rounded-xl md:rounded-2xl bg-[#081320]/80 border border-[#1b3d60]/60 flex items-center justify-center gap-2 sm:gap-4 md:gap-5 p-3 sm:p-4 md:p-5 overflow-hidden transition-all duration-300 group-hover:border-[#38bdf8]/40">
                    {item.logos.map((logo, lIdx) => (
                      <div key={lIdx} className="flex items-center gap-2 sm:gap-4 md:gap-5">
                        {lIdx > 0 && (
                          <span className="text-[#38bdf8]/35 font-mono text-xs sm:text-sm font-light select-none">
                            +
                          </span>
                        )}
                        <img
                          src={logo.src}
                          alt={logo.alt}
                          loading="lazy"
                          className={`object-contain drop-shadow-md transition-transform duration-300 ease-out group-hover:scale-110 ${
                            item.logos.length > 1
                              ? "w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12"
                              : "w-10 h-10 sm:w-13 sm:h-13 md:w-16 md:h-16"
                          } ${logo.invert ? "brightness-0 invert" : ""}`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pinterest Bottom: Info & Tag Metadata */}
                  <div className="mt-3 sm:mt-4 flex flex-col gap-1 sm:gap-1.5">
                    <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                      <h3 className="font-sans font-semibold text-sm sm:text-base md:text-lg text-[#ddeaf5] tracking-tight leading-snug truncate">
                        {item.name}
                      </h3>

                      <span className="font-mono text-[9px] sm:text-[10px] md:text-[11px] font-semibold px-1.5 sm:px-2.5 py-0.5 rounded-full bg-[#0b1c2e] text-[#38bdf8] border border-[#38bdf8]/30 tracking-wide whitespace-nowrap shrink-0">
                        {item.tag}
                      </span>
                    </div>

                    <p className="font-sans text-[11px] sm:text-xs md:text-[13px] text-[#8bb1d3] leading-tight line-clamp-1">
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
