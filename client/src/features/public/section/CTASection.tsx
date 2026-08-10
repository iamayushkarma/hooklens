import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { useAppNavigation } from "@/shared/hooks/useAppNavigation";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const { goToLogin } = useAppNavigation();
  const navigate = useNavigate();

  const goToLernMorePage = () => navigate("/lern-more");
  return (
    <section className="relative overflow-hidden bg-white font-sans antialiased">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border-default) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-default) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 65% 65% at 50% 40%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 65% at 50% 40%, black, transparent)",
          opacity: 0.5,
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 py-28 flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-4xl sm:text-5xl leading-[1.15] font-bold tracking-tight text-text-primary mb-5"
        >
          Experience a faster way
          <br />
          to debug webhooks
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-base leading-relaxed text-text-secondary max-w-lg mb-10"
        >
          Join the developers who trust HookLens to catch, inspect, and replay
          every request the moment it arrives.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <Button onClick={goToLogin}>
            Sign up
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Button>

          <Button
            onClick={goToLernMorePage}
            className="bg-bg-base text-text-primary hover:bg-base-hover border border-border-default"
          >
            Learn more
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
