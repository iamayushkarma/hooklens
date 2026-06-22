import { Plus } from "lucide-react";

interface CreateEndpointBtnProps {
  onClick: () => void;
}

function CreateEndpointBtn({ onClick }: CreateEndpointBtnProps) {
  return (
    <button
      onClick={onClick}
      className="h-9 rounded-md bg-accent px-4 text-white hover:bg-accent-hover flex items-center gap-2"
    >
      <Plus size={16} />
      Create Endpoint
    </button>
  );
}

export default CreateEndpointBtn;
