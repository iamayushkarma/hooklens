import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Modal from "@/shared/components/ui/ModalPortal";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { useAuthStore } from "@/store/auth.store";

import { deleteAccount } from "../api/deleteAccount";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) return null;

  const canDelete = confirmation.trim() === user.email;

  const handleDelete = async () => {
    if (!canDelete) {
      setError("Email does not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await deleteAccount();

      onClose();
      logout();
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-red-500">Delete Account</h2>

          <p className="mt-2 text-sm text-text-secondary">
            This action cannot be undone. This will permanently delete your
            account.
            <br />
            Type
            <span className="font-semibold text-text-primary">
              {" "}
              {user.email}{" "}
            </span>
            below to confirm.
          </p>
        </div>

        <Input
          value={confirmation}
          onChange={(e) => {
            setConfirmation(e.target.value);
            if (error) setError("");
          }}
          placeholder={user.email}
          error={error}
        />

        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="bg-transparent border border-border-default text-text-primary hover:bg-bg-hover"
          >
            Cancel
          </Button>

          <Button
            loading={loading}
            disabled={!canDelete}
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteAccountModal;
