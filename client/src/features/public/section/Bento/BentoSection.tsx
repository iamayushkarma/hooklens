import CollaborationCard from "./cards/CollaborationCard";
import WebhookCaptureCard from "./cards/WebhookCaptureCard";

function BentoSection() {
  return (
    <div className="w-6xl grid grid-cols-3 gap-8 bg-white">
      <CollaborationCard />
      <WebhookCaptureCard />
      <CollaborationCard />
    </div>
  );
}

export default BentoSection;
