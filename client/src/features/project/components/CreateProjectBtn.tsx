import Modal from "@/shared/components/ui/ModalPortal";
import { Plus } from "lucide-react";
import { useState } from "react";

import { usePermissions } from "@/shared/hooks/usePermissions";

import CreateProject from "./CreateProject";

interface CreateProjectBtnProps {
  onSuccess: () => void;
}

function CreateProjectBtn({ onSuccess }: CreateProjectBtnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const permissions = usePermissions();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!permissions.canCreateProject) {
    return null;
  }

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="flex h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border-default bg-blue-100 transition-colors hover:bg-blue-300/40"
      >
        <Plus className="size-5" />

        <div className="text-center">
          <p className="font-medium text-text-primary">Create Project</p>

          <p className="text-xs text-text-secondary">
            Start monitoring a new API...
          </p>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateProject closeModal={closeModal} onSuccess={onSuccess} />
      </Modal>
    </>
  );
}

export default CreateProjectBtn;
