import BentoFooter from "./BentoFooter";
import BentoHeader from "./BentoHeader";
import AutoGenrateCard from "./cards/AutoGenrateCard";
import CalendarSchedulingCard from "./cards/Calendarschedulingcard";
import CollaborationCard from "./cards/CollaborationCard";
import FollowerGrowthCard from "./cards/Followergrowthcard";
import IntegrationsCard from "./cards/Integrationscard";
import PostCard from "./cards/PostCard";
import PreviewCars from "./cards/PreviewCars";
import WebhookCaptureCard from "./cards/WebhookCaptureCard";
import WriteBetterCard from "./cards/WriteBetterCard";

function BentoSection() {
  return (
    <section className="w-full">
      <BentoHeader />
      <div className="w-6xl grid grid-cols-3 gap-2.5 bg-white mx-auto">
        <CollaborationCard />
        <WebhookCaptureCard />
        <WriteBetterCard />
        <IntegrationsCard style="col-span-2!" />
        <AutoGenrateCard />
        <CalendarSchedulingCard />
        <PostCard style="col-span-2!" />
        <PreviewCars style="col-span-2!" />
        <FollowerGrowthCard />
      </div>
      <BentoFooter />
    </section>
  );
}

export default BentoSection;
