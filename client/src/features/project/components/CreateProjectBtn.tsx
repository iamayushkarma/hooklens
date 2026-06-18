import Modal from "@/shared/components/ui/ModalPortal";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateProject from "./CreateProject";

function CreateProjectBtn() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer rounded-xl border-2 border-dashed border-border-default bg-bg-sidebar h-56 flex flex-col items-center justify-center gap-3 transition-colors hover:bg-base-hover"
      >
        <Plus className="size-5" />

        <div className="text-center">
          <p className="font-medium text-text-primary">Create Project</p>

          <p className="text-xs text-text-secondary">
            Start monitoring a new API
          </p>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateProject closeModal={closeModal} />
      </Modal>
    </>
  );
}

export default CreateProjectBtn;
