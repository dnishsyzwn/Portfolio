"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ProjectVideo {
  id: 1 | 2 | 3;
  src: string;
  title: string;
}

const VIDEOS: ProjectVideo[] = [
  {
    id: 1,
    src: "/PortfolioContact1.mp4",
    title: "Project Showcase 1",
  },
  {
    id: 2,
    src: "/PortfolioContact2.mp4",
    title: "Project Showcase 2",
  },
  {
    id: 3,
    src: "/PortfolioContact3.mp4",
    title: "Project Showcase 3",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [hoveredImage, setHoveredImage] = useState<1 | 2 | 3 | null>(null);

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject: `Portfolio Message from ${name}`,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to transmit message. Please try again.");
      }

      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred while transmitting.");
      }
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setStatus("idle");
    setErrorMessage("");
  };

  // ── Smooth Interactive Accordion Calculation (Expand hovered, push others to shrink) ──
  const isAnyHovered = hoveredImage !== null;

  // Column 1 (Vertical Video) flex factor
  const col1Flex =
    hoveredImage === 1
      ? 2.3
      : hoveredImage === 2 || hoveredImage === 3
      ? 1
      : 1;

  // Column 2 (Right Column) flex factor
  const col2Flex =
    hoveredImage === 1
      ? 1
      : hoveredImage === 2 || hoveredImage === 3
      ? 2.1
      : 1;

  // Video 2 (Top Right) flex factor inside Col 2
  const vid2Flex =
    hoveredImage === 2
      ? 2.3
      : hoveredImage === 3
      ? 0.9
      : 1;

  // Video 3 (Bottom Right) flex factor inside Col 2
  const vid3Flex =
    hoveredImage === 3
      ? 2.3
      : hoveredImage === 2
      ? 0.9
      : 1;

  return (
    <div className="relative min-h-screen bg-[#0b1c2e] text-white pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-10 lg:px-16 selection:bg-[#38bdf8] selection:text-[#0b1c2e]">
      {/* Anchor for Topbar to apply dark theme nav styles */}
      <div id="services" className="fixed inset-0 pointer-events-none -z-50" aria-hidden="true" />

      {/* Standard, Clean Button with High Contrast & Standard Font */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[1560px] mx-auto mb-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#163554] hover:bg-[#1f4873] border border-[#2b5884] text-white font-sans text-sm font-medium transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
          <span>Back to Portfolio</span>
        </Link>
      </motion.div>

      {/* Main Two-Column Stage */}
      <div className="max-w-[1560px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-stretch min-h-[660px]">
        
        {/* ── LEFT SECTION: FORM + BOTTOM HEADLINE ───────────────────── */}
        <div className="lg:col-span-6 flex flex-col justify-between py-2 sm:py-4">
          
          {/* Top Form Area */}
          <div>
            {/* Friendly, Kind Eyebrow in Standard Font */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="font-sans text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-8 sm:mb-10"
            >
              Fill in your details below, and I&apos;ll get back to you as soon as possible.
            </motion.p>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success-box"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="p-8 rounded-xl bg-[#122840] border border-[#1e456d] text-left my-6 shadow-lg"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-white mb-2 tracking-tight">Message Dispatched</h3>
                  <p className="font-sans text-sm text-slate-200 mb-2 leading-relaxed">
                    Thank you, <span className="text-white font-medium">{name}</span>. Your message has been successfully sent.
                  </p>
                  <p className="font-sans text-xs text-slate-400 mb-6">
                    A response will be sent to <span className="text-white font-medium">{email}</span>.
                  </p>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 text-xs font-sans font-medium text-[#38bdf8] hover:text-white transition-colors border-b border-[#38bdf8] hover:border-white pb-1"
                  >
                    <span>Send another message</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6 sm:space-y-7"
                >
                  {/* Error Notification */}
                  {status === "error" && (
                    <div className="p-4 rounded-lg bg-rose-950/80 border border-rose-500 text-rose-100 text-xs flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Input 1: Your Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="relative border-b border-[#334e68] focus-within:border-white transition-colors py-2.5 flex items-center justify-between gap-4"
                  >
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-transparent border-none outline-none text-white text-base sm:text-lg placeholder:text-slate-400 font-sans font-light"
                    />
                    <span className="text-[11px] font-sans tracking-wide text-slate-400 shrink-0 select-none">
                      Required
                    </span>
                  </motion.div>

                  {/* Input 2: Email Address */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.33, ease: [0.22, 1, 0.36, 1] }}
                    className="relative border-b border-[#334e68] focus-within:border-white transition-colors py-2.5 flex items-center justify-between gap-4"
                  >
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full bg-transparent border-none outline-none text-white text-base sm:text-lg placeholder:text-slate-400 font-sans font-light"
                    />
                    <span className="text-[11px] font-sans tracking-wide text-slate-400 shrink-0 select-none">
                      Required
                    </span>
                  </motion.div>

                  {/* Input 3: Phone Number (Optional) */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.41, ease: [0.22, 1, 0.36, 1] }}
                    className="relative border-b border-[#334e68] focus-within:border-white transition-colors py-2.5 flex items-center justify-between gap-4"
                  >
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number"
                      className="w-full bg-transparent border-none outline-none text-white text-base sm:text-lg placeholder:text-slate-400 font-sans font-light"
                    />
                    <span className="text-[11px] font-sans tracking-wide text-slate-400/80 shrink-0 select-none">
                      Optional
                    </span>
                  </motion.div>

                  {/* Input 4: Your Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.49, ease: [0.22, 1, 0.36, 1] }}
                    className="relative border-b border-[#334e68] focus-within:border-white transition-colors py-2.5 flex items-start justify-between gap-4"
                  >
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Your Message"
                      className="w-full bg-transparent border-none outline-none text-white text-base sm:text-lg placeholder:text-slate-400 font-sans font-light resize-none leading-relaxed"
                    />
                    <span className="text-[11px] font-sans tracking-wide text-slate-400 shrink-0 select-none pt-1">
                      Required
                    </span>
                  </motion.div>

                  {/* Submit Button on the right with underline */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.57, ease: [0.22, 1, 0.36, 1] }}
                    className="flex justify-end pt-2"
                  >
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="group inline-flex items-center gap-2 pb-1 border-b border-slate-300 hover:border-white text-white font-sans text-sm sm:text-base font-medium tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#38bdf8]" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit</span>
                          <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </>
                      )}
                    </button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Heading & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="pt-12 sm:pt-16 mt-auto"
          >
            <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px] text-white tracking-tight uppercase leading-[1.08] mb-2.5">
              SEND ME A MESSAGE
            </h1>
            <p className="font-sans text-xs sm:text-sm text-slate-300 tracking-wide uppercase font-normal">
              FEEL FREE TO WRITE ME AND ASK ANY QUESTION YOU HAVE.
            </p>
          </motion.div>

        </div>

        {/* ── RIGHT SECTION: PURE VIDEOS WITH INTERACTIVE HOVER ACCORDION ── */}
        <div
          onMouseLeave={() => setHoveredImage(null)}
          className="lg:col-span-6 flex flex-row gap-3 sm:gap-4 h-[300px] sm:h-[420px] md:h-[540px] lg:h-[660px] xl:h-[700px] w-full mt-6 lg:mt-0"
        >
          {/* Video 1: Tall Vertical Video (Col 1) */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setHoveredImage(1)}
            style={{
              flex: `${col1Flex} 1 0%`,
              transition: "flex 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            className="group relative overflow-hidden rounded-xl cursor-pointer border border-white/10 min-w-0 h-full bg-[#0e243a]"
          >
            <video
              src={VIDEOS[0].src}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className={`w-full h-full object-fill pointer-events-none transition-opacity duration-300 ease-out ${
                isAnyHovered && hoveredImage !== 1 ? "opacity-75" : "opacity-100"
              }`}
            />
          </motion.div>

          {/* Column 2: Contains Video 2 (Top) and Video 3 (Bottom) */}
          <div
            style={{
              flex: `${col2Flex} 1 0%`,
              transition: "flex 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            className="flex flex-col gap-3 sm:gap-4 min-w-0 h-full"
          >
            {/* Video 2: Top Right Video */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.47, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHoveredImage(2)}
              style={{
                flex: `${vid2Flex} 1 0%`,
                transition: "flex 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              className="group relative overflow-hidden rounded-xl cursor-pointer border border-white/10 min-w-0 min-h-0 bg-[#0e243a]"
            >
              <video
                src={VIDEOS[1].src}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className={`w-full h-full object-fill pointer-events-none transition-opacity duration-300 ease-out ${
                  isAnyHovered && hoveredImage !== 2 ? "opacity-75" : "opacity-100"
                }`}
              />
            </motion.div>

            {/* Video 3: Bottom Right Video */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.59, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHoveredImage(3)}
              style={{
                flex: `${vid3Flex} 1 0%`,
                transition: "flex 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              className="group relative overflow-hidden rounded-xl cursor-pointer border border-white/10 min-w-0 min-h-0 bg-[#0e243a]"
            >
              <video
                src={VIDEOS[2].src}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className={`w-full h-full object-fill pointer-events-none transition-opacity duration-300 ease-out ${
                  isAnyHovered && hoveredImage !== 3 ? "opacity-75" : "opacity-100"
                }`}
              />
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
