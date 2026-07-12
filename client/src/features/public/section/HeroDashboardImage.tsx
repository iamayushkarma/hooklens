import HeroUserDashboardImage from "@/features/public/assets/hero-dashboard.png";

function HeroDashboardImage() {
  return (
    <div className="bg-gray-50 relative h-[90svh]">
      <div className="absolute -top-20 left-0 right-0 h-32 z-20 backdrop-blur-md [mask-image:linear-gradient(to_top,black,transparent)] pointer-events-none" />
      <div className="absolute -top-20 left-0 right-0 h-40 z-20 bg-gradient-to-t from-gray-50 via-gray-50/60 to-transparent pointer-events-none" />
      <div className="max-w-4/5 h-[95svh] flex mx-auto relative">
        <img
          className="absolute top-10 z-30 w-full object-cover rounded-lg overflow-hidden border border-border-default"
          src={HeroUserDashboardImage}
        />
      </div>
    </div>
  );
}

export default HeroDashboardImage;
