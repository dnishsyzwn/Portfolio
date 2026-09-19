import type { Metadata } from "next";
import "./globals.css";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import ArchitecturalGrid from "@/components/ArchitecturalGrid";
import SvgChromeFilters from "@/components/SvgChromeFilters";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Danish Syazwan — Full-Stack Developer",
  description:
    "Full-stack developer crafting high-performance distributed web systems, reactive architectures, and fluid interactive experiences.",
  keywords: ["Danish Syazwan", "Full-Stack Developer", "Next.js", "TypeScript", "React", "Distributed Systems"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="lenis lenis-smooth">
      <body className="relative bg-white text-navy font-sans selection:bg-[#c8e4f8] selection:text-[#1b4c78]">
        {/* Preloader Entrance Sequence (Inspired by landonorris.com) */}
        <Preloader />

        {/* SVG Specular Lighting Filters for Liquid Chrome Typography */}
        <SvgChromeFilters />

        {/* Faint Architectural Swiss Grid Lines */}
        <ArchitecturalGrid />

        {/* Lenis Smooth Inertia Scrolling */}
        <SmoothScroll>
          <Topbar />
          <main className="relative z-10">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
