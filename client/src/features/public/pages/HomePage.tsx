import HeroSection from "../section/HeroSection";
import Problemwesolve from "../section/Problemwesolve";
import HeroDashboardImage from "../section/HeroDashboardImage";
import WhyIBuiltSection from "../section/Whyibuiltsection";
import BentoSection from "../section/Bento/BentoSection";
import { HowItWorksSection } from "../section/HowItWorksSection";
import WhyChooseUs from "../section/WhyChooseUs";
import IntegrationSnippetsSection from "../section/Integrationsnippetssection";
import { FAQSection } from "../section/FAQSection";
import CTASection from "../section/CTASection";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const timeout = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [location]);
  return (
    <div className="top-16">
      <HeroSection />
      <HeroDashboardImage />
      <Problemwesolve />
      <WhyIBuiltSection />
      <section
        id="features"
        className="flex items-center justify-center bg-white"
      >
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
