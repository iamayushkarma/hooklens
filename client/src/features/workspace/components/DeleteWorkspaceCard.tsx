import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import DeleteWorkspaceModal from "./DeleteWorkspaceModal";
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace";
import { DeleteWorkspaceCardSkeleton } from "@/shared/components/skletons/WorkspaceSettingsSkeleton";

function DeleteWorkspaceCard() {
  const { currentWorkspace } = useCurrentWorkspace();

  const [open, setOpen] = useState(false);

  if (!currentWorkspace) {
    return <DeleteWorkspaceCardSkeleton />;
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-sm">
        {/* Content */}
        <div className="space-y-5 px-6 py-6">
          <div className="space-y-3">
            <p className="text-sm font-medium leading-relaxed text-text-primary">
              Delete this workspace and all its data.
            </p>
            <p className="text-sm text-text-secondary">
              This action will permanently remove all projects, endpoints,
              request history, analytics data, and member invitations.
            </p>
          </div>
        </div>

        {/* Footer with action */}
        <div className="border-t border-border-default bg-bg-base/50 px-6 py-4">
          <div className="flex justify-end">
            <Button
              className="flex items-center gap-2 bg-danger hover:bg-red-700 text-white"
              onClick={() => setOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete Workspace
            </Button>
          </div>
        </div>
      </div>

      <DeleteWorkspaceModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default DeleteWorkspaceCard;
