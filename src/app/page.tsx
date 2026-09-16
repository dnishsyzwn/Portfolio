import SilkHero from "@/components/SilkHero";
import WorkSection from "@/components/WorkSection";
import DevLabGallery from "@/components/DevLabGallery";
import ToolsMarquee from "@/components/ToolsMarquee";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 00 / Fluid Silk Hero Section */}
      <SilkHero />

      {/* 01 / Work & Featured Case Studies */}
      <WorkSection />

      {/* 02 / Curriculum & Achievements Bento Grid */}
      <DevLabGallery />

      {/* 03 / Stack & Tools Infinite Marquee */}
      <ToolsMarquee />
    </div>
  );
}
