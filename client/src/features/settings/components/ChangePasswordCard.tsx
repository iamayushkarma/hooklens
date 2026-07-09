import { useState } from "react";

import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { useAuthStore } from "@/store/auth.store";

import { changePassword } from "../api/changePassword";

function ChangePasswordCard() {
  const { user } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (user?.authProvider === "google") {
    return (
      <div className="rounded-xl border border-border-default bg-bg-card p-6">
        <h2 className="text-lg font-semibold">Password</h2>

        <p className="mt-1 text-sm text-text-secondary">
          You're signed in with Google. Password management is handled by your
          Google account.
        </p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!currentPassword) {
      setError("Current password is required");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from your current password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await changePassword({ currentPassword, newPassword });

      setSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border-default bg-bg-card p-6">
      <h2 className="text-lg font-semibold">Password</h2>

      <p className="mt-1 text-sm text-text-secondary">
        Change the password used to sign in to your account.
      </p>

      <div className="mt-6 space-y-4 max-w-md">
        <Input
          label="Current password"
          type="password"
          isPassword
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            if (error) setError("");
            if (success) setSuccess("");
          }}
        />

        <Input
          label="New password"
          type="password"
          isPassword
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            if (error) setError("");
            if (success) setSuccess("");
          }}
        />

        <Input
          label="Confirm new password"
          type="password"
          isPassword
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (error) setError("");
            if (success) setSuccess("");
          }}
          error={error}
        />
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        {success && <p className="text-sm text-green-500">{success}</p>}

        <Button
          loading={loading}
          disabled={
            loading || !currentPassword || !newPassword || !confirmPassword
          }
          onClick={handleSave}
        >
          Update Password
        </Button>
      </div>
    </div>
  );
}

export default ChangePasswordCard;
