import HeroUiPropOne from "@/features/public/assets/hero-ui-prop-one.png";
import HeroUiPropTwo from "@/features/public/assets/hero-ui-prop-two.png";
import HeroUiPropThree from "@/features/public/assets/hero-ui-prop-three.png";

function HeroSectionUIProp() {
  return (
    <div className="relative">
      <img
        src={HeroUiPropOne}
        alt=""
        className="absolute inset-0 object-cover -z-10 w-65"
      />
      <img
        src={HeroUiPropTwo}
        alt=""
        className="absolute object-cover -z-10 w-65 -right-1 top-50"
      />
      <img
        src={HeroUiPropThree}
        alt=""
        className="absolute object-cover -right-7 -z-10 w-48"
      />
    </div>
  );
}

export default HeroSectionUIProp;
