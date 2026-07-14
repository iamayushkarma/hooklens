import AutoGenrateCard from "./cards/AutoGenrateCard";
import CalendarSchedulingCard from "./cards/Calendarschedulingcard";
import CollaborationCard from "./cards/CollaborationCard";
import IntegrationsCard from "./cards/Integrationscard";
import PostCard from "./cards/PostCard";
import PreviewCars from "./cards/PreviewCars";
import WebhookCaptureCard from "./cards/WebhookCaptureCard";
import WriteBetterCard from "./cards/WriteBetterCard";

function BentoSection() {
  return (
    <div className="w-6xl grid grid-cols-3 gap-2.5 bg-white">
      <CollaborationCard />
      <WebhookCaptureCard />
      <WriteBetterCard />
      <IntegrationsCard style="col-span-2!" />
      <AutoGenrateCard />
      <CalendarSchedulingCard />
      <PostCard style="col-span-2!" />
      <PreviewCars style="col-span-2!" />
    </div>
  );
}

export default BentoSection;
