import CollaborationCard from "./cards/CollaborationCard";
import IntegrationsCard from "./cards/Integrationscard";
import WebhookCaptureCard from "./cards/WebhookCaptureCard";
import WriteBetterCard from "./cards/WriteBetterCard";

function BentoSection() {
  return (
    <div className="w-6xl grid grid-cols-3 gap-8 bg-white">
      <CollaborationCard />
      <WebhookCaptureCard />
      <WriteBetterCard />
      <IntegrationsCard style="col-span-2!" />
      <WriteBetterCard />
    </div>
  );
}

export default BentoSection;
