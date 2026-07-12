import CollaborationCard from "./cards/CollaborationCard";

function BentoSection() {
  return (
    <div className="w-6xl grid grid-cols-3 gap-8 bg-white">
      <CollaborationCard />
      <CollaborationCard />
      <CollaborationCard />
    </div>
  );
}

export default BentoSection;
