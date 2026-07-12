import BentoSection from "../section/Bento/BentoSection";
import HeroDashboardImage from "../section/HeroDashboardImage";
import HeroSection from "../section/HeroSection";

function HomePage() {
  return (
    <div className="top-16">
      <HeroSection />
      <HeroDashboardImage />
      <div className="flex items-center justify-center bg-white">
        <BentoSection />
      </div>
    </div>
  );
}

export default HomePage;
