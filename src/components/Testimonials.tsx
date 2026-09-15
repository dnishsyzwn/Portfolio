"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomInReveal, Reveal } from "./MotionReveal";

const testimonials = [
  {
    quote:
      "Danish operates at that rare intersection where extreme technical rigor meets deep product taste. He transformed our core application from an unwieldy monolith into a modular, sub-second architecture without dropping a single packet. Any team looking to solve genuinely difficult engineering problems needs Danish on their roster.",
    author: "Elena Vance",
    role: "VP of Engineering, Apex Labs",
  },
  {
    quote:
      "Working with Danish is an absolute masterclass in frontend excellence. He writes clean, predictable TypeScript and has a relentless eye for interaction fidelity. Whether it's complex state synchronization or WebGL performance tuning, he executes with lightning speed and unmistakable precision.",
    author: "Marcus Chen",
    role: "Staff Frontend Architect, Hyperion Systems",
  },
  {
    quote:
      "Most developers tell you why something can't be done under tight deadlines; Danish comes back with a working proof-of-concept and an optimized deployment pipeline. He brought our real-time collaborative tool from concept to launch ahead of schedule with zero major production incidents.",
    author: "Sarah Jenkins",
    role: "Co-Founder & CEO, Kinetic Studio",
  },
  {
    quote:
      "Danish's approach to systems engineering is holistic. He doesn't just write code—he considers latency profiles, database index contention, and developer ergonomics across the entire stack. His open-source contributions to our distributed cache were surgical and impeccably documented.",
    author: "Tariq Al-Mansoor",
    role: "Principal Infrastructure Lead, CloudScale Inc.",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const activeTestimonial = testimonials[current];

  return (
    <section id="testimonials" className="py-24 md:py-32 px-6 md:px-12 border-t border-[#1b4c78]/10 bg-white">
      <div className="max-w-[1320px] mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[#3f6aa6] font-medium">
            04 / ENDORSEMENTS
          </span>
          <span className="font-mono text-xs text-navy/40">PEERS &amp; ENGINEERING LEADERS</span>
        </div>

        {/* Testimonial Card - Zoom In on scroll */}
        <ZoomInReveal>
          <article className="border border-[#1b4c78]/15 bg-[#f8fbfe] p-8 sm:p-12 md:p-16 relative overflow-hidden">
            {/* Top Row: Quote mark & custom pagination */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#1b4c78]/10">
              <span className="font-serif text-5xl sm:text-6xl text-[#1b4c78] leading-none select-none">
                &ldquo;
              </span>

              {/* Pagination indicator */}
              <div className="flex items-center gap-4 font-mono text-xs text-[#1b4c78]">
                <span className="hidden sm:inline-block w-16 h-[1px] bg-[#1b4c78]/25" />
                <span>
                  {String(current + 1).padStart(3, "0")} / {String(testimonials.length).padStart(3, "0")}
                </span>
              </div>
            </div>

            {/* Quote Body with AnimatePresence */}
            <div className="min-h-[160px] md:min-h-[140px] flex items-center mb-12 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={current}
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1b4c78] tracking-tight leading-[1.25]"
                >
                  {activeTestimonial.quote}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Footer: Controls & Author */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-[#1b4c78]/10">
              {/* Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 border border-[#1b4c78]/20 bg-white hover:bg-[#eef6fd] text-[#1b4c78] flex items-center justify-center transition-colors focus:outline-none"
                  aria-label="Previous endorsement"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 border border-[#1b4c78]/20 bg-white hover:bg-[#eef6fd] text-[#1b4c78] flex items-center justify-center transition-colors focus:outline-none"
                  aria-label="Next endorsement"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Author Name and Role with AnimatePresence */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-left sm:text-right"
                >
                  <div className="font-serif text-xl sm:text-2xl text-[#1b4c78] tracking-tight">
                    {activeTestimonial.author}
                  </div>
                  <div className="font-mono text-xs text-navy/60 mt-0.5">{activeTestimonial.role}</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </article>
        </ZoomInReveal>
      </div>
    </section>
  );
}
