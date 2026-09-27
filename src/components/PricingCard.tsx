"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export interface PricingCardData {
  id: string;
  badge?: string;
  title: string;
  subtitle: string;
  price: string;
  period?: string;
  buttonText: string;
  features: string[];
  note: string;
  highlighted?: boolean;
  glow: {
    radial: string;
    blob1: string;
    blob2: string;
  };
}

interface PricingCardProps {
  card: PricingCardData;
  index: number;
}

export default function PricingCard({ card, index }: PricingCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -6 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group relative rounded-xl overflow-hidden flex flex-col justify-between transform-gpu transition-[border-color,box-shadow] duration-300 ${
        card.highlighted
          ? "border border-white/25 shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(1,249,255,0.18)] ring-1 ring-white/20"
          : "border border-white/10 shadow-[0_16px_50px_rgba(0,0,0,0.6)] hover:border-white/25 hover:shadow-[0_24px_70px_rgba(0,0,0,0.75)]"
      } bg-[#14161f] text-white min-h-[580px] sm:min-h-[620px] md:min-h-[660px]`}
    >
      {/* ── Signature Atmospheric Glow Layer (Matches Uploaded Screenshot) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        {/* Layer 1: Core Radial Gradient Bloom */}
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-500 ease-out group-hover:scale-105"
          style={{
            background: card.glow.radial,
            transform: "translateZ(0)",
          }}
        />

        {/* Layer 2: Organic Optical Bloom Blobs (Hardware-accelerated) */}
        <div
          className={`absolute -bottom-16 -right-10 w-72 h-72 rounded-full pointer-events-none transition-transform duration-500 ease-out group-hover:scale-115 opacity-75 ${card.glow.blob1}`}
          style={{
            filter: "blur(38px)",
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        />
        <div
          className={`absolute -bottom-12 left-6 w-64 h-64 rounded-full pointer-events-none transition-transform duration-500 ease-out group-hover:scale-110 opacity-75 ${card.glow.blob2}`}
          style={{
            filter: "blur(42px)",
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        />

        {/* Layer 3: Dynamic Cursor Spotlight (CSS variables, 0 React re-renders) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
          style={{
            background: `radial-gradient(380px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(56, 189, 248, 0.14), transparent 70%)`,
          }}
        />

        {/* Layer 4: Glass Edge Specular Reflection */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* ── Card Content Container ── */}
      <div className="relative z-10 p-6 sm:p-7 md:p-8 flex flex-col h-full justify-between">
        <div>
          {/* Optional Badge */}
          {card.badge && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 + index * 0.1 }}
              className="mb-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-sans text-[11px] font-semibold tracking-wider uppercase shadow-sm group-hover:border-[#38bdf8]/40 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-[#38bdf8] animate-pulse" />
              <span>{card.badge}</span>
            </motion.div>
          )}

          {/* Header Title & Subtitle with Micro-lift */}
          <div>
            <h3 className="font-sans font-bold text-xl sm:text-[23px] md:text-[25px] text-white tracking-tight leading-snug group-hover:text-[#f8fafc] transition-colors duration-200">
              {card.title}
            </h3>
            <p className="font-sans text-sm sm:text-[15px] md:text-base text-slate-200 font-normal leading-relaxed mt-2 transition-colors duration-200 group-hover:text-white">
              {card.subtitle}
            </p>
          </div>

          {/* Animated Horizontal Divider */}
          <div className="border-b border-white/[0.16] my-5 sm:my-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#38bdf8]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Large Bold Price (Supports Ranges with Interactive Shine) */}
          <div className="mb-5 sm:mb-6 min-h-[44px] flex items-center">
            <div className="flex items-baseline flex-wrap gap-1">
              <span className="font-sans font-bold text-2xl sm:text-[28px] md:text-[30px] xl:text-[32px] text-white tracking-tight leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-[1.02] origin-left">
                {card.price}
              </span>
              {card.period && (
                <span className="font-sans font-medium text-base sm:text-lg text-slate-300 ml-1 tracking-normal">
                  {card.period}
                </span>
              )}
            </div>
          </div>

          {/* Dark Pill CTA Button with Shimmer Sweep */}
          <Link
            href={`/contact?plan=${encodeURIComponent(card.title)}`}
            className="group/btn relative w-full block text-center py-3.5 px-6 rounded-full bg-[#181a24]/90 hover:bg-[#202535] active:bg-[#14151e] border border-white/[0.18] hover:border-[#38bdf8]/50 shadow-[0_4px_18px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_25px_rgba(56,189,248,0.25)] transition-all duration-300 hover:scale-[1.015] active:scale-[0.99] overflow-hidden"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

            <span className="font-sans text-sm sm:text-base font-semibold text-white/95 tracking-normal inline-flex items-center justify-center gap-2 transition-transform duration-200">
              <span>{card.buttonText}</span>
              <ArrowUpRight className="w-4 h-4 text-white/60 group-hover/btn:text-[#38bdf8] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
            </span>
          </Link>

          {/* Animated Horizontal Divider */}
          <div className="border-b border-white/[0.16] my-5 sm:my-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#38bdf8]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Feature Checkmarks List with Interactive Stagger */}
          <ul className="space-y-3.5 sm:space-y-4">
            {card.features.map((feature, fIdx) => (
              <li
                key={fIdx}
                className="group/item flex items-start gap-3 transition-transform duration-200 hover:translate-x-1"
              >
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#38bdf8]/15 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] group-hover/item:bg-[#38bdf8] group-hover/item:text-[#0b1c2e] transition-all duration-200">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
                <span className="font-sans text-sm sm:text-[15px] md:text-base text-white/90 group-hover/item:text-white font-normal leading-relaxed transition-colors duration-200">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {/* Note / Deliverable Summary with Pulsing Status Indicator */}
          {card.note && (
            <div className="mt-6 pt-1 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse shrink-0" />
              <p className="font-sans font-semibold text-xs sm:text-sm text-white/95 tracking-tight leading-snug group-hover:text-white transition-colors">
                {card.note}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Atmospheric Space: Gives generous breathing room for the glowing gradient */}
        <div className="h-24 sm:h-32 md:h-36 pointer-events-none" aria-hidden="true" />
      </div>
    </motion.div>
  );
}
