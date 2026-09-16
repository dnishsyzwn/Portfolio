"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Github, Linkedin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const headlineWords = [
    "Let's",
    "build",
    "something",
    "exceptional",
    "together.",
  ];

  let cumulativeCharIdx = 0;

  return (
    <footer className="relative py-20 px-6 md:px-12 border-t border-[#1b4c78]/10 bg-white">
      <div className="max-w-[1320px] mx-auto">
        {/* Top Contact Callout */}
        <div ref={containerRef} className="mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12">
            {/* Left: Animated Eyebrow & Wave Headline */}
            <div className="max-w-4xl">
              {/* Eyebrow with blur-to-clear fade-in */}
              <motion.span
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : { opacity: 0, y: 16, filter: "blur(8px)" }
                }
                transition={{
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-mono text-xs uppercase tracking-widest text-[#3f6aa6] font-medium block mb-4"
              >
                HAVE A SYSTEM TO BUILD?
              </motion.span>

              {/* Main Headline with letter-by-letter wave and blur-to-clear */}
              <a
                href="mailto:contact@danishsyazwan.dev"
                className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#1b4c78] hover:text-[#2e5189] transition-colors leading-[0.95] tracking-tight block cursor-pointer"
              >
                {headlineWords.map((word, wordIdx) => (
                  <span
                    key={wordIdx}
                    className="inline-block whitespace-nowrap"
                  >
                    {word.split("").map((char) => {
                      const delay = 0.12 + cumulativeCharIdx++ * 0.022;
                      return (
                        <motion.span
                          key={cumulativeCharIdx}
                          initial={{
                            opacity: 0,
                            y: 38,
                            filter: "blur(12px)",
                          }}
                          animate={
                            isInView
                              ? {
                                  opacity: 1,
                                  y: 0,
                                  filter: "blur(0px)",
                                }
                              : {
                                  opacity: 0,
                                  y: 38,
                                  filter: "blur(12px)",
                                }
                          }
                          transition={{
                            duration: 0.75,
                            delay,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="inline-block will-change-transform"
                        >
                          {char}
                        </motion.span>
                      );
                    })}
                    {wordIdx < headlineWords.length - 1 && (
                      <span className="inline-block">&nbsp;</span>
                    )}
                  </span>
                ))}
              </a>
            </div>

            {/* Right: Contact Me Button Beside Text */}
            <motion.div
              initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 24, filter: "blur(10px)" }
              }
              transition={{
                duration: 0.8,
                delay: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="shrink-0 lg:mb-3 self-start lg:self-end"
            >
              <a
                href="mailto:contact@danishsyazwan.dev"
                className="group relative inline-flex items-center gap-3.5 px-8 py-4 sm:px-9 sm:py-5 rounded-full bg-[#1b4c78] hover:bg-[#0b1c2e] text-white font-sans text-base sm:text-lg font-medium shadow-[0_10px_25px_-5px_rgba(27,76,120,0.35)] hover:shadow-[0_15px_35px_-5px_rgba(11,28,46,0.45)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
              >
                <span>Contact Me</span>
                <span className="w-8 h-8 rounded-full bg-white/15 group-hover:bg-white/25 flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
                </span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Footer Navigation & Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-12 border-t border-[#1b4c78]/10">
          {/* Col 1: Bio / Tagline */}
          <div className="md:col-span-6 font-sans text-sm text-navy/70 max-w-md leading-relaxed">
            <p className="font-medium text-[#1b4c78] text-base mb-1">
              Danish Syazwan
            </p>
            <p>
              Full-Stack Developer crafting high-performance distributed systems,
              reactive architectures, and meticulous interaction design for the
              modern web.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 font-sans text-sm space-y-2">
            <div className="font-mono text-xs text-navy/40 uppercase tracking-wider mb-2">
              INDEX
            </div>
            <div>
              <a
                href="#work"
                className="text-[#1b4c78] hover:text-sky transition-colors"
              >
                Work &amp; Case Studies
              </a>
            </div>
            <div>
              <a
                href="#curriculum"
                className="text-[#1b4c78] hover:text-sky transition-colors"
              >
                Curriculum &amp; Achievements
              </a>
            </div>
            <div>
              <a
                href="#stack"
                className="text-[#1b4c78] hover:text-sky transition-colors"
              >
                Technical Arsenal
              </a>
            </div>
          </div>

          {/* Col 3: Socials */}
          <div className="md:col-span-3 font-sans text-sm space-y-2">
            <div className="font-mono text-xs text-navy/40 uppercase tracking-wider mb-2">
              CONNECT
            </div>
            <div>
              <a
                href="https://github.com/dnishsyzwn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#1b4c78] hover:text-sky transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
            </div>
            <div>
              <a
                href="https://www.linkedin.com/in/danish-syazwan-109725339/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#1b4c78] hover:text-sky transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-16 pt-6 border-t border-[#1b4c78]/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-navy/50 gap-4">
          <div>&copy; 2026 Danish Syazwan. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
