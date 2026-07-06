import { useState } from "react";

import { Button } from "@/shared/components/ui/Button";

import DeleteWorkspaceModal from "./DeleteWorkspaceModal";

import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace";

function DeleteWorkspaceCard() {
  const { currentWorkspace } = useCurrentWorkspace();

  const [open, setOpen] = useState(false);

  if (!currentWorkspace) return null;

  return (
    <>
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
        <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>

        <p className="mt-2 text-sm text-text-secondary">
          Permanently delete this workspace, all projects, endpoints, request
          history and invitations.
        </p>

        <div className="mt-6 flex justify-end">
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => setOpen(true)}
          >
            Delete Workspace
          </Button>
        </div>
      </div>

      <DeleteWorkspaceModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default DeleteWorkspaceCard;
