import Modal from "@/shared/components/ui/ModalPortal";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateWorkspace from "./CreateWorkspace";

function CreateWorkspaceBtn() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [workspaceName, setWorkspaceName] = useState("");

  const closeModal = () => {
    setWorkspaceName("");
    setIsModalOpen(false);
  };
  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-bg-sidebar cursor-pointer border-2 border-dashed border-border-default rounded-lg w-62 flex flex-col items-center justify-center hover:bg-base-hover h-56"
      >
        <Plus className="size-5" />
        <div className="text-center w-3/4">
          <p className="font-medium text-text-primary">Create Workspace</p>

          <p className="text-xs text-text-secondary">
            Create a workspace to manage your projects
          </p>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateWorkspace
          userInput={workspaceName}
          onChange={setWorkspaceName}
          closeModal={closeModal}
        />
      </Modal>
    </>
  );
}

export default CreateWorkspaceBtn;
