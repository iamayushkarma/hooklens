import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

interface ReplayDialogProps {
  open: boolean;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onReplay: (targetUrl: string) => Promise<void>;
}

function ReplayDialog({
  open,
  loading = false,
  onOpenChange,
  onReplay,
}: ReplayDialogProps) {
  const [targetUrl, setTargetUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setTargetUrl("");
      setError("");
    }
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (open) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const validate = () => {
    if (!targetUrl.trim()) {
      setError("Target URL is required.");
      return false;
    }

    try {
      const url = new URL(targetUrl);

      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error();
      }

      setError("");
      return true;
    } catch {
      setError("Please enter a valid http:// or https:// URL.");
      return false;
    }
  };

  const handleReplay = async () => {
    if (!validate()) return;

    await onReplay(targetUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border-default bg-bg-primary p-6 shadow-xl">
        <h2 className="text-xl font-semibold">Replay Request</h2>

        <p className="mt-2 text-sm text-text-secondary">
          Enter the destination webhook URL where this request should be
          replayed.
        </p>

        <div className="mt-6">
          <Input
            label="Target URL"
            placeholder="https://example.com/webhook"
            value={targetUrl}
            error={error}
            autoFocus
            onChange={(e) => setTargetUrl(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await handleReplay();
              }
            }}
          />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button
            type="button"
            className="bg-transparent text-text-primary border border-border-default hover:bg-bg-sidebar"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="button" loading={loading} onClick={handleReplay}>
            {loading ? "Replaying..." : "Replay Request"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReplayDialog;
