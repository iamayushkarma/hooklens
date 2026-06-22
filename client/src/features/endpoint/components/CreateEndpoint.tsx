import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Modal from "@/shared/components/ui/ModalPortal";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

import { createEndpoint } from "../api/createEndpoint";

interface CreateEndpointProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateEndpoint({ isOpen, onClose }: CreateEndpointProps) {
  const navigate = useNavigate();

  const { workspaceId, projectId } = useParams();

  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!workspaceId || !projectId || !label.trim()) {
      return;
    }

    try {
      setLoading(true);

      const endpoint = await createEndpoint({
        label,
        workspaceId,
        projectId,
      });

      onClose();

      navigate(
        `/dashboard/workspaces/${workspaceId}/projects/${projectId}/endpoints/${endpoint._id}`,
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Create Endpoint</h2>

          <p className="text-sm text-text-secondary">
            Create a webhook endpoint to inspect incoming requests.
          </p>
        </div>

        <Input
          label="Endpoint Name"
          placeholder="Stripe Webhook"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="bg-transparent border border-border-default text-text-primary hover:bg-base-hover"
          >
            Cancel
          </Button>

          <Button loading={loading} onClick={handleCreate}>
            Create Endpoint
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default CreateEndpoint;
