import Modal from "@/shared/components/ui/ModalPortal";
import { Plus } from "lucide-react";
import { useState } from "react";

function CreateWorkspace() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="border bg-bg-sidebar cursor-pointer border-border-default rounded-lg w-62 flex items-center justify-center hover:bg-base-hover h-36"
      >
        <Plus className="size-5" />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div>Hello</div>
      </Modal>
    </>
  );
}

export default CreateWorkspace;
