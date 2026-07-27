import ThemeSwitcher from "@/shared/components/ui/ThemeToggler";
import HeroSection from "../section/HeroSection";
import Problemwesolve from "../section/Problemwesolve";
import HeroDashboardImage from "../section/HeroDashboardImage";
import WhyIBuiltSection from "../section/Whyibuiltsection";
import BentoSection from "../section/Bento/BentoSection";
import HowItWorksSection from "../section/HowItWorksSection";
import WhyChooseUs from "../section/WhyChooseUs";
import IntegrationSnippetsSection from "../section/Integrationsnippetssection";
import FAQSection from "../section/FAQSection";
import CTASection from "../section/CTASection";

function HomePage() {
  return (
    <div className="top-16">
      <ThemeSwitcher />
      <HeroSection />
      <HeroDashboardImage />
      <Problemwesolve />
      <WhyIBuiltSection />
      <section className="flex items-center justify-center bg-white">
        <BentoSection />
      </section>
      <HowItWorksSection />
      <WhyChooseUs />
      <IntegrationSnippetsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}

export default HomePage;
