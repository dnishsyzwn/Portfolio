import { Github, Linkedin, Twitter, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative py-20 px-6 md:px-12 border-t border-[#1b4c78]/10 bg-white">
      <div className="max-w-[1320px] mx-auto">
        {/* Top Contact Callout */}
        <div className="mb-20">
          <span className="font-mono text-xs uppercase tracking-widest text-[#3f6aa6] font-medium block mb-3">
            HAVE A SYSTEM TO BUILD?
          </span>
          <a
            href="mailto:contact@danishsyazwan.dev"
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#1b4c78] hover:text-[#2e5189] transition-colors leading-[0.95] tracking-tight block max-w-4xl"
          >
            Let&apos;s build something exceptional together.
          </a>
        </div>

        {/* Footer Navigation & Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-12 border-t border-[#1b4c78]/10">
          {/* Col 1: Bio / Tagline */}
          <div className="md:col-span-6 font-sans text-sm text-navy/70 max-w-md leading-relaxed">
            <p className="font-medium text-[#1b4c78] text-base mb-1">Danish Syazwan</p>
            <p>
              Full-Stack Developer crafting high-performance distributed systems, reactive architectures, and
              meticulous interaction design for the modern web.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 font-sans text-sm space-y-2">
            <div className="font-mono text-xs text-navy/40 uppercase tracking-wider mb-2">INDEX</div>
            <div>
              <a href="#work" className="text-[#1b4c78] hover:text-sky transition-colors">
                Work &amp; Case Studies
              </a>
            </div>
            <div>
              <a href="#lab" className="text-[#1b4c78] hover:text-sky transition-colors">
                Dev Lab &amp; Experiments
              </a>
            </div>
            <div>
              <a href="#stack" className="text-[#1b4c78] hover:text-sky transition-colors">
                Technical Arsenal
              </a>
            </div>
            <div>
              <a href="#synthesis" className="text-[#1b4c78] hover:text-sky transition-colors">
                Knowledge Synthesis
              </a>
            </div>
          </div>

          {/* Col 3: Socials */}
          <div className="md:col-span-3 font-sans text-sm space-y-2">
            <div className="font-mono text-xs text-navy/40 uppercase tracking-wider mb-2">CONNECT</div>
            <div>
              <a
                href="https://github.com"
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
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#1b4c78] hover:text-sky transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
            </div>
            <div>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#1b4c78] hover:text-sky transition-colors"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter / X</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Location */}
        <div className="mt-16 pt-6 border-t border-[#1b4c78]/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-navy/50 gap-4">
          <div>&copy; 2026 Danish Syazwan. All rights reserved.</div>
          <div>Inspired by sreedesigns.com • Built with Next.js 15 &amp; Tailwind CSS</div>
        </div>
      </div>
    </footer>
  );
}
