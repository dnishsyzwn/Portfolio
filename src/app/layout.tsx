import type { Metadata } from "next";
import "./globals.css";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import ArchitecturalGrid from "@/components/ArchitecturalGrid";
import SvgChromeFilters from "@/components/SvgChromeFilters";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import PageTransition from "@/components/PageTransition";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://danishsyazwan.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Danish Syazwan — Full-Stack Developer",
    template: "%s | Danish Syazwan",
  },
  description:
    "Full-stack developer crafting high-performance distributed web systems, reactive architectures, and fluid interactive experiences.",
  keywords: [
    "Danish Syazwan",
    "Full-Stack Developer",
    "Software Engineer",
    "Next.js",
    "TypeScript",
    "React",
    "Node.js",
    "Distributed Systems",
    "Frontend Engineer",
    "Backend Developer",
    "Web Development",
  ],
  authors: [{ name: "Danish Syazwan", url: "https://github.com/dnishsyzwn" }],
  creator: "Danish Syazwan",
  publisher: "Danish Syazwan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Danish Syazwan — Full-Stack Developer",
    description:
      "Full-stack developer crafting high-performance distributed web systems, reactive architectures, and fluid interactive experiences.",
    siteName: "Danish Syazwan Portfolio",
    images: [
      {
        url: "/syncuid.png",
        width: 1200,
        height: 630,
        alt: "Danish Syazwan — Full-Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Danish Syazwan — Full-Stack Developer",
    description:
      "Full-stack developer crafting high-performance distributed web systems, reactive architectures, and fluid interactive experiences.",
    images: ["/syncuid.png"],
    creator: "@dnishsyzwn",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profilepage`,
      url: siteUrl,
      name: "Danish Syazwan — Full-Stack Developer",
      dateCreated: "2024-01-01T00:00:00.000Z",
      dateModified: "2026-09-20T22:00:00.000Z",
      mainEntity: {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Danish Syazwan",
        alternateName: "dnishsyzwn",
        jobTitle: "Full-Stack Developer",
        description:
          "Full-stack developer crafting high-performance distributed web systems, reactive architectures, and fluid interactive experiences.",
        url: siteUrl,
        image: `${siteUrl}/syncuid.png`,
        sameAs: [
          "https://github.com/dnishsyzwn",
          "https://www.linkedin.com/in/danish-syazwan-109725339/",
        ],
        knowsAbout: [
          "Full-Stack Development",
          "Next.js",
          "React",
          "TypeScript",
          "Distributed Systems",
          "Interactive UI Design",
          "Node.js",
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Danish Syazwan Portfolio",
      description:
        "Portfolio of Danish Syazwan, full-stack software engineer crafting distributed web systems and interactive experiences.",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="lenis lenis-smooth">
      <body className="relative bg-white text-navy font-sans selection:bg-[#c8e4f8] selection:text-[#1b4c78]">
        {/* JSON-LD Structured Data for Google Rich Results & Knowledge Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

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
