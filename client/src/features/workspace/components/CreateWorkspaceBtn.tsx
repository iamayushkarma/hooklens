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
        className="border bg-bg-sidebar cursor-pointer border-border-default rounded-lg w-62 flex items-center justify-center hover:bg-base-hover h-36"
      >
        <Plus className="size-5" />
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
