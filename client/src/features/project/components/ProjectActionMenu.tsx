import { useRef, useState } from "react";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";

import Modal from "@/shared/components/ui/ModalPortal";
import { useClickOutside } from "@/shared/hooks/useClickOutside";

import type { Project } from "../types/project.types";
import EditProjectModal from "./EditProjectModal";
import DeleteProjectModal from "./DeleteProjectModal";

interface ProjectActionMenuProps {
  project: Project;
  onSuccess?: () => void;
}

function ProjectActionMenu({ project, onSuccess }: ProjectActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef, () => setOpen(false));

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
        <div className="absolute right-0 z-50 mt-2 w-44 rounded-lg border border-border-default bg-bg-card py-1 shadow-lg">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              setEditOpen(true);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-bg-hover"
          >
            <Edit2 className="size-4" />
            Edit Project
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
            Delete Project
          </button>
        </div>
      )}

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <EditProjectModal
          projectId={project._id}
          initialName={project.name}
          initialDescription={project.description ?? ""}
          closeModal={() => setEditOpen(false)}
          onSuccess={() => {
            onSuccess?.();
            setEditOpen(false);
          }}
        />
      </Modal>

      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DeleteProjectModal
          projectId={project._id}
          projectName={project.name}
          closeModal={() => setDeleteOpen(false)}
          onSuccess={() => {
            onSuccess?.();
            setDeleteOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default ProjectActionMenu;
