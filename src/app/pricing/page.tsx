"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, HelpCircle, ChevronDown } from "lucide-react";
import PricingCard, { PricingCardData } from "@/components/PricingCard";

interface PricingPlanConfig {
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

// ── Lowered Entry-Level Malaysian Freelance Market Rates (MYR Ranges) ──
const PRICING_PLANS: PricingPlanConfig[] = [
  {
    id: "landing-page",
    title: "Landing Page & Showcase",
    subtitle: "For founders, personal brands & high-impact product launches",
    price: "RM 500 – RM 900",
    buttonText: "I need a landing page",
    features: [
      "Custom responsive layout & kinetic motion physics",
      "Next.js & Tailwind CSS architecture",
      "Technical SEO & Lighthouse 95+ speed score",
      "Contact form, CMS & analytics integration",
    ],
    note: "Turnaround within 1 to 2 weeks",
    glow: {
      radial:
        "radial-gradient(115% 75% at 60% 105%, #0099ff 0%, #0066ff 22%, #003db3 45%, #081d45 68%, transparent 88%)",
      blob1: "bg-[#0099ff]/35",
      blob2: "bg-[#0066ff]/45",
    },
  },
  {
    id: "webapp-mvp",
    badge: "Most Popular",
    title: "Full-Stack Web App MVP",
    subtitle: "Interactive web applications, user portals & SaaS prototypes",
    price: "RM 1,200 – RM 2,400",
    buttonText: "I want to build a web application",
    features: [
      "Full-stack frontend & backend engineering (Next.js, React)",
      "User authentication, session management & secure roles",
      "Database modeling (PostgreSQL / Supabase / Prisma)",
      "REST API integrations & reactive user interfaces",
    ],
    note: "Sprint milestones within 3 to 4 weeks",
    highlighted: true,
    glow: {
      radial:
        "radial-gradient(115% 75% at 65% 105%, #01f9ff 0%, #00a7fd 18%, #0379f9 32%, #0756c8 48%, #0e2b52 65%, transparent 85%)",
      blob1: "bg-[#01f9ff]/45",
      blob2: "bg-[#0379f9]/55",
    },
  },
  {
    id: "dashboards-systems",
    title: "Operational Dashboards & Systems",
    subtitle: "Centralized internal portals, booking engines & live telemetry",
    price: "RM 2,500 – RM 4,200",
    buttonText: "I need a custom operational system",
    features: [
      "Complex multi-role administration dashboards",
      "Real-time telemetry, live data feeds & fleet dispatch logic",
      "Relational database modeling & automated workflows",
      "Post-handover walkthrough, documentation & 30-day warranty",
    ],
    note: "Iterative sprints within 4 to 6 weeks",
    glow: {
      radial:
        "radial-gradient(115% 75% at 55% 105%, #00e5ff 0%, #0088ff 25%, #0a4ebd 48%, #0d285c 70%, transparent 88%)",
      blob1: "bg-[#00e5ff]/35",
      blob2: "bg-[#0a4ebd]/50",
    },
  },
];

const FAQS = [
  {
    question: "Why are the prices presented in a range?",
    answer:
      "Web projects vary in complexity. A single-page showcase starts at the baseline, whereas multi-section portals with bespoke animations, CMS integrations, or complex logic land higher in the range. You'll receive a clear, fixed quote after an initial scope review.",
  },
  {
    question: "How do project payments work for Malaysian clients?",
    answer:
      "Project-based builds follow a standard 50/50 milestone model: 50% upfront to reserve sprint bandwidth and initiate development, and 50% upon final delivery, QA verification, and staging sign-off. Payments can be settled via DuitNow, bank transfer, or card.",
  },
  {
    question: "What happens after the project is deployed?",
    answer:
      "Every build includes a 30-day post-launch warranty covering bug fixes, responsive styling adjustments, and a comprehensive code handover walkthrough to ensure your team is confident managing the system.",
  },
  {
    question: "What if my project requires custom integrations or a larger scope?",
    answer:
      "If you need local payment gateway integrations (FPX, ToyyibPay, Stripe), e-invoicing systems (MyInvois), or high-concurrency microservices, reach out via the Contact page for a tailored proposal.",
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="relative min-h-screen bg-[#0b1c2e] text-white pt-20 sm:pt-24 pb-20 sm:pb-28 px-4 sm:px-8 md:px-12 lg:px-16 selection:bg-[#38bdf8] selection:text-[#0b1c2e] overflow-hidden">
      {/* Anchor for Topbar to apply dark theme nav styles */}
      <div id="services" className="fixed inset-0 pointer-events-none -z-50" aria-hidden="true" />

      {/* ── Ambient Background Glows (GPU Accelerated, Zero Blur Convolution Overhead) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute -top-40 left-1/4 w-[720px] h-[720px] rounded-full pointer-events-none opacity-40 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, rgba(3, 121, 249, 0.28) 0%, rgba(3, 121, 249, 0.12) 35%, rgba(3, 121, 249, 0) 70%)",
            transform: "translate3d(0, 0, 0)",
          }}
        />
        <div
          className="absolute top-1/3 -right-36 w-[720px] h-[720px] rounded-full pointer-events-none opacity-30 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, rgba(1, 249, 255, 0.22) 0%, rgba(1, 249, 255, 0.08) 38%, rgba(1, 249, 255, 0) 70%)",
            transform: "translate3d(0, 0, 0)",
          }}
        />
      </div>

      {/* ── Top Bar / Back to Portfolio ── */}
      <motion.div
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[1560px] mx-auto mb-10 sm:mb-12"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#163554] hover:bg-[#1f4873] border border-[#2b5884] text-white font-sans text-sm font-medium transition-all duration-200 shadow-sm hover:-translate-x-0.5"
        >
          <ArrowLeft className="w-4 h-4 text-white transition-transform group-hover:-translate-x-1" />
          <span>Back to Portfolio</span>
        </Link>
      </motion.div>

      <div className="max-w-[1560px] mx-auto">
        {/* ── Page Header Headline ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-14 sm:mb-16"
        >
          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-white tracking-tight leading-[1.1] mb-4">
            Clear value,{" "}
            <span className="bg-gradient-to-r from-white via-[#7dd3fc] to-[#38bdf8] bg-clip-text text-transparent">
              zero guesswork
            </span>
          </h1>
          <p className="font-sans text-base sm:text-lg md:text-[19px] text-slate-200 font-normal leading-relaxed">
            Fair, market-calibrated freelance estimates for modern web applications, interactive landing pages, and operational dashboards.
          </p>
        </motion.div>

        {/* ── The 3 Pricing Cards (Style matched to Reference Screenshot in MYR Ranges) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {PRICING_PLANS.map((plan, idx) => {
            const cardData: PricingCardData = {
              id: plan.id,
              badge: plan.badge,
              title: plan.title,
              subtitle: plan.subtitle,
              price: plan.price,
              period: plan.period,
              buttonText: plan.buttonText,
              features: plan.features,
              note: plan.note,
              highlighted: plan.highlighted,
              glow: plan.glow,
            };

            return <PricingCard key={plan.id} card={cardData} index={idx} />;
          })}
        </div>

        {/* ── Custom Scope Callout Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 sm:mt-20 p-8 sm:p-10 rounded-xl bg-gradient-to-r from-[#122b47]/90 via-[#0e233b]/90 to-[#0b1c2e] border border-[#204973] flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_16px_50px_rgba(0,0,0,0.4)]"
        >
          <div className="max-w-2xl text-center md:text-left">
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white tracking-tight mb-2">
              Have specific project requirements?
            </h3>
            <p className="font-sans text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              I collaborate with founders, businesses, and agency partners on bespoke web architectures, custom integrations, and end-to-end full-stack development.
            </p>
          </div>

          <Link
            href="/contact?plan=Custom+Architecture"
            className="group shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#38bdf8] hover:bg-[#60cdff] text-[#0b1c2e] font-sans text-sm sm:text-base font-semibold tracking-wide transition-all shadow-[0_4px_25px_rgba(56,189,248,0.3)] hover:shadow-[0_4px_30px_rgba(56,189,248,0.5)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Discuss Custom Scope</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        {/* ── Frequently Asked Questions Accordion ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 sm:mt-24 max-w-4xl mx-auto"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-[#38bdf8]" />
              <span className="font-mono text-xs font-semibold text-[#38bdf8] uppercase tracking-wider">
                Common Inquiries
              </span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5">
            {FAQS.map((faq, fIdx) => (
              <motion.div
                key={fIdx}
                initial={false}
                className="rounded-lg border border-[#1e456d]/70 bg-[#0e243a]/60 overflow-hidden transition-colors hover:border-[#38bdf8]/40"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(fIdx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none transition-colors hover:bg-white/[0.02]"
                  aria-expanded={openFaq === fIdx}
                >
                  <span className="font-sans font-semibold text-base sm:text-lg md:text-[19px] text-white tracking-tight">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#38bdf8] shrink-0 transition-transform duration-300 ${
                      openFaq === fIdx ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === fIdx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#1e456d]/40">
                        <p className="font-sans text-[15px] sm:text-base md:text-[16.5px] text-slate-200 leading-relaxed font-normal">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
