import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { resendInvitation } from "../api/resendInvitation";

interface Props {
  workspaceId: string;
  invitationId: string;
}

function ResendInvitationButton({ workspaceId, invitationId }: Props) {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    try {
      setLoading(true);

      await resendInvitation(workspaceId, invitationId);

      // Later we'll replace this with Sonner toast
      alert("Invitation resent successfully");
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Unable to resend invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      loading={loading}
      onClick={handleResend}
      className="bg-accent hover:bg-accent-hover"
    >
      Resend
    </Button>
  );
}

export default ResendInvitationButton;
