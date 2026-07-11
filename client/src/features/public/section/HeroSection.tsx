// features/public/components/sections/HeroSection.tsx
import HeroSectionBackground from "@/features/public/assets/hero-section-background.png";

function HeroSection() {
  return (
    <section className="relative overflow-hidden h-svh">
      <img
        src={HeroSectionBackground}
        alt=""
        className="absolute inset-0 w-full object-cover -z-10"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-base/60 via-bg-base/20 to-bg-base -z-10" />

      {/* Actual hero content sits on top, in normal flow */}
      <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-semibold text-text-primary">
          Inspect, debug, and replay webhooks — instantly
        </h1>
        <p className="text-text-secondary mt-4 max-w-xl mx-auto">
          Send any HTTP request to a unique URL and watch it appear live.
        </p>
      </div>
    </section>
  );
}

export default HeroSection;
