import { useState } from "react";

import { Button } from "@/shared/components/ui/Button";

import type { Endpoint } from "../types/endpoint.types";
import { deleteEndpoint } from "../api/deleteEndpoint";

interface DeleteEndpointModalProps {
  endpoint: Endpoint;
  closeModal: () => void;
  onSuccess: () => void;
}

function DeleteEndpointModal({
  endpoint,
  closeModal,
  onSuccess,
}: DeleteEndpointModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      await deleteEndpoint(endpoint._id);

      onSuccess();
      closeModal();
    } catch (error: any) {
      setError(error?.response?.data?.message ?? "Failed to delete endpoint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-red-600">Delete Endpoint</h2>

      <p className="mt-2 text-sm text-text-secondary">
        Are you sure you want to delete{" "}
        <span className="font-medium text-text-primary">{endpoint.label}</span>?
      </p>

      <p className="mt-2 text-sm text-red-500">
        This will permanently delete the endpoint and all of its request
        history. This action cannot be undone.
      </p>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={closeModal}
          className="cursor-pointer text-text-secondary transition-colors hover:text-text-primary"
        >
          Cancel
        </button>

        <Button
          className="bg-red-600 hover:bg-red-700"
          disabled={loading}
          onClick={handleDelete}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}

export default DeleteEndpointModal;
