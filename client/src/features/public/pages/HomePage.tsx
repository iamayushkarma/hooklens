import ThemeSwitcher from "@/shared/components/ui/ThemeToggler";
import BentoSection from "../section/Bento/BentoSection";
import HeroDashboardImage from "../section/HeroDashboardImage";
import HeroSection from "../section/HeroSection";
import WhyIBuiltSection from "../section/Whyibuiltsection";
import HowItWorksSection from "../section/HowItWorksSection";

function HomePage() {
  return (
    <div className="top-16">
      <ThemeSwitcher />
      <HeroSection />
      <HeroDashboardImage />
      <WhyIBuiltSection />
      <div className="flex items-center justify-center bg-white">
        <BentoSection />
      </div>
      <HowItWorksSection />
    </div>
  );
}

export default HomePage;
