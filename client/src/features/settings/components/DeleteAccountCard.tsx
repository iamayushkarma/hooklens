import { useState } from "react";

import { Button } from "@/shared/components/ui/Button";

import DeleteAccountModal from "./DeleteAccountModal";

function DeleteAccountCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
        <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>

        <p className="mt-2 text-sm text-text-secondary">
          Permanently delete your account and all of your personal data. If you
          own any workspaces, transfer or delete them first.
        </p>

        <div className="mt-6 flex justify-end">
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => setOpen(true)}
          >
            Delete Account
          </Button>
        </div>
      </div>

      <DeleteAccountModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default DeleteAccountCard;
