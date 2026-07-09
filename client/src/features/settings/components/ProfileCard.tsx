import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { useAuthStore } from "@/store/auth.store";
import logoDefault from "@/assets/icons/logo-default.png";

import { updateProfile } from "../api/updateProfile";

function ProfileCard() {
  const { user, updateUser } = useAuthStore();

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName ?? "");
      setAvatarUrl(user.avatarUrl ?? "");
    }
  }, [user]);

  const isUnchanged =
    fullName.trim() === user?.fullName && avatarUrl.trim() === user?.avatarUrl;

  const handleSave = async () => {
    const name = fullName.trim();

    if (!name) {
      setError("Full name is required");
      return;
    }

    if (name.length < 2) {
      setError("Full name must be at least 2 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const updated = await updateProfile({
        fullName: name,
        avatarUrl: avatarUrl.trim(),
      });

      updateUser(updated);
      setSuccess("Profile updated successfully");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border-default bg-bg-card p-6">
      <h2 className="text-lg font-semibold">Profile</h2>

      <p className="mt-1 text-sm text-text-secondary">
        Update your personal profile information.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <img
          src={avatarUrl || user?.avatarUrl || logoDefault}
          alt={user?.fullName}
          className="size-16 rounded-full bg-muted object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = logoDefault;
          }}
        />

        <div className="flex-1">
          <Input
            label="Avatar URL"
            placeholder="https://example.com/avatar.png"
            value={avatarUrl}
            onChange={(e) => {
              setAvatarUrl(e.target.value);
              if (error) setError("");
              if (success) setSuccess("");
            }}
          />
        </div>
      </div>

      <div className="mt-4">
        <Input
          label="Full name"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (error) setError("");
            if (success) setSuccess("");
          }}
          error={error}
        />
      </div>

      <div className="border-t border-border-default mt-6 pt-4">
        <label className="text-xs text-text-secondary uppercase tracking-wide">
          Email
        </label>
        <p className="mt-1 text-sm">{user?.email}</p>
        <p className="mt-1 text-xs text-text-secondary">
          Your email address cannot be changed.
        </p>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        {success && <p className="text-sm text-green-500">{success}</p>}

        <Button
          loading={loading}
          disabled={loading || isUnchanged}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export default ProfileCard;
