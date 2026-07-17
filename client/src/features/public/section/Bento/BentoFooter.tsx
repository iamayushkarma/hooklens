import { Button } from "@/shared/components/ui/Button";
import { useAppNavigation } from "@/shared/hooks/useAppNavigation";
import {
  Zap,
  ShieldCheck,
  Users,
  RefreshCw,
  GitCompare,
  Sparkles,
  Clock,
  Code2,
  Building2,
  Search,
  Terminal,
  Lock,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface FeatureTag {
  label: string;
  icon: LucideIcon;
}

const features: FeatureTag[] = [
  { label: "Live updates", icon: Zap },
  { label: "Signature verification", icon: ShieldCheck },
  { label: "Team roles", icon: Users },
  { label: "Replay to any URL", icon: RefreshCw },
  { label: "Response diff", icon: GitCompare },
  { label: "AI payload explainer", icon: Sparkles },
  { label: "7-day auto-expiry", icon: Clock },
  { label: "JSON highlighting", icon: Code2 },
  { label: "Multi-workspace", icon: Building2 },
  { label: "Request search", icon: Search },
  { label: "Copy as cURL", icon: Terminal },
  { label: "Rate limiting", icon: Lock },
];

export default function BentoFooter() {
  const { goToLogin } = useAppNavigation();
  return (
    <section className="w-full py-16 px-4 text-center">
      {/* And much more */}
      <p className="text-sm text-text-muted mb-6">And much more</p>

      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 max-w-3xl mx-auto mb-14">
        {features.map(({ label, icon: Icon }) => (
          <li
            key={label}
            className="flex items-center gap-1.5 text-sm text-text-secondary"
          >
            <Icon size={16} strokeWidth={1.75} className="shrink-0" />
            <span>{label}</span>
          </li>
        ))}
      </ul>

      {/* Closing CTA */}
      <h3 className="text-xl font-medium text-text-primary mb-6">
        Get started free no credit card required
      </h3>
      <Button onClick={goToLogin}>
        Get started free <ArrowRight size={16} strokeWidth={2} />
      </Button>
    </section>
  );
}
