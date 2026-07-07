import { useRef, useState } from "react";
import { Edit2, MoreVertical, Play, Power, Trash2 } from "lucide-react";

import Modal from "@/shared/components/ui/ModalPortal";
import { useClickOutside } from "@/shared/hooks/useClickOutside";

import type { Endpoint } from "../types/endpoint.types";
import EditEndpointModal from "./EditEndpointModal";
import DeleteEndpointModal from "./DeleteEndpointModal";
import { sendTestRequest } from "../api/sendTestRequest";
import { updateEndpoint } from "../api/updateEndpoint";

interface EndpointActionMenuProps {
  endpoint: Endpoint;
  onSuccess: () => void;
}

function EndpointActionMenu({ endpoint, onSuccess }: EndpointActionMenuProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useClickOutside(wrapperRef, () => setOpen(false));

  const handleToggle = async () => {
    try {
      setLoading(true);

      await updateEndpoint({
        endpointId: endpoint._id,
        isActive: !endpoint.isActive,
      });

      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleTest = async () => {
    try {
      setLoading(true);

      await sendTestRequest(endpoint._id);

      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="rounded-md p-1 transition-colors hover:bg-bg-hover"
      >
        <MoreVertical className="size-4 text-text-secondary" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-border-default bg-bg-card py-1 shadow-lg">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              setEditOpen(true);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-bg-hover"
          >
            <Edit2 className="size-4" />
            Edit Endpoint
          </button>

          <button
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              handleTest();
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-bg-hover"
          >
            <Play className="size-4" />
            Send Test Request
          </button>

          <button
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-bg-hover"
          >
            <Power className="size-4" />
            {endpoint.isActive ? "Disable Endpoint" : "Enable Endpoint"}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              setDeleteOpen(true);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-bg-hover"
          >
            <Trash2 className="size-4" />
            Delete Endpoint
          </button>
        </div>
      )}

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <EditEndpointModal
          endpoint={endpoint}
          closeModal={() => setEditOpen(false)}
          onSuccess={() => {
            setEditOpen(false);
            onSuccess();
          }}
        />
      </Modal>

      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DeleteEndpointModal
          endpoint={endpoint}
          closeModal={() => setDeleteOpen(false)}
          onSuccess={() => {
            setDeleteOpen(false);
            onSuccess();
          }}
        />
      </Modal>
    </div>
  );
}

export default EndpointActionMenu;
