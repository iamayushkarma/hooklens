import { useState } from "react";

import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

import type { Endpoint } from "../types/endpoint.types";
import { updateEndpoint } from "../api/updateEndpoint";

interface EditEndpointModalProps {
  endpoint: Endpoint;
  closeModal: () => void;
  onSuccess: () => void;
}

function EditEndpointModal({
  endpoint,
  closeModal,
  onSuccess,
}: EditEndpointModalProps) {
  const [label, setLabel] = useState(endpoint.label);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    const value = label.trim();

    if (!value) {
      return "Endpoint name is required";
    }

    if (value.length > 100) {
      return "Endpoint name cannot exceed 100 characters";
    }

    return "";
  };

  const handleUpdate = async () => {
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updateEndpoint(endpoint._id, {
        label: label.trim(),
      });
      onSuccess();
      closeModal();
    } catch (error: any) {
      setError(error?.response?.data?.message ?? "Failed to update endpoint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Edit Endpoint</h2>

      <p className="mt-1 text-sm text-text-secondary">
        Update the endpoint name.
      </p>

      <div className="mt-5">
        <label className="text-sm font-medium">Endpoint Name</label>

        <Input
          value={label}
          error={error}
          placeholder="GitHub Webhook"
          onChange={(e) => {
            setLabel(e.target.value);

            if (error) {
              setError("");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUpdate();
            }
          }}
        />
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={closeModal}
          className="cursor-pointer text-text-secondary hover:text-text-primary"
        >
          Cancel
        </button>

        <Button disabled={!label.trim() || loading} onClick={handleUpdate}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>
    </div>
  );
}

export default EditEndpointModal;
