import CollaborationCard from "./cards/CollaborationCard";
import PublishStackCard from "./cards/PublishStackCard";

function BentoSection() {
  return (
    <div className="w-6xl grid grid-cols-3 gap-8 bg-white">
      <CollaborationCard />
      <PublishStackCard />
      <CollaborationCard />
    </div>
  );
}

export default BentoSection;
