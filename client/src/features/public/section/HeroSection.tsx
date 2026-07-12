import HeroSectionBackground from "@/features/public/assets/hero-section-background.png";
import HeroSectionUIProp from "../components/HeroSectionUIProp";
import { Button } from "@/shared/components/ui/Button";
import { useAppNavigation } from "@/shared/hooks/useAppNavigation";

function HeroSection() {
  const { goToLogin } = useAppNavigation();
  return (
    <section className="relative overflow-hidden h-dvh">
      <img
        src={HeroSectionBackground}
        alt=""
        className="absolute inset-0 w-full object-cover -z-10"
      />
      <HeroSectionUIProp />
      <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent-border bg-accent-subtle px-4 py-1.5 text-sm font-medium text-accent-text">
          Free to start no credit card, no drama
        </span>

        <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-[1.1]">
          Stop guessing
          <br />
          what your webhooks say
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-text-secondary">
          Get a unique URL, watch requests come in live, and see exactly what
          Stripe, GitHub, or any other service sent you. No more digging through
          raw headers to figure it out.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Button className="px-6 py-5.5" onClick={goToLogin}>
            Get your webhook URL
          </Button>
          <Button
            className="px-6! py-5.5! border border-border-default bg-bg-card text-text-primary hover:bg-base-hover transition-colors"
            onClick={goToLogin}
          >
            See how it works
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
