import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createEndpoint } from "../api/createEndpoint";

interface Props {
  onClose: () => void;
}

function CreateEndpoint({ onClose }: Props) {
  const navigate = useNavigate();

  const { workspaceId, projectId } = useParams();

  const [label, setLabel] = useState("");

  const handleCreate = async () => {
    if (!workspaceId || !projectId || !label.trim()) return;

    try {
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
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Create Endpoint</h2>

        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Stripe Webhook"
          className="w-full rounded-lg border border-border-default px-4 py-2"
        />

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-border-default px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="rounded-lg bg-primary px-4 py-2 text-white"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateEndpoint;
