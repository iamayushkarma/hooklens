import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/Button";
import { RoleBadge } from "@/shared/components/ui/role-badge";

import InviteMemberModal from "../components/InviteMemberModal";

import {
  getMembers,
  type WorkspaceMember,
  type PendingInvitation,
} from "../api/getMembers";

import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace";
import { useAuthStore } from "@/store/auth.store";
import MemberRoleSelect from "../components/MemberRoleSelect";

function WorkspaceMembers() {
  const { currentWorkspaceId } = useCurrentWorkspace();
  const auth = useAuthStore();
  const [members, setMembers] = useState<WorkspaceMember[]>([]);

  const [pendingInvites, setPendingInvites] = useState<PendingInvitation[]>([]);

  const [loading, setLoading] = useState(true);

  const [inviteOpen, setInviteOpen] = useState(false);

  const loadMembers = async () => {
    if (!currentWorkspaceId) return;

    try {
      setLoading(true);

      const data = await getMembers(currentWorkspaceId);

      setMembers(data.members);

      setPendingInvites(data.pendingInvites);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [currentWorkspaceId]);

  if (loading) {
    return <div className="py-16 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Team Members</h2>

          <p className="text-sm text-text-secondary">
            Manage workspace members and invitations.
          </p>
        </div>

        <Button onClick={() => setInviteOpen(true)}>Invite Member</Button>
      </div>

      <div className="rounded-xl border border-border-default">
        {members.map((member) => (
          <div
            key={member.memberId}
            className="flex items-center justify-between border-b border-border-default p-5 last:border-b-0"
          >
            <div>
              <h3 className="font-medium">{member.user.name}</h3>

              <p className="text-sm text-text-secondary">{member.user.email}</p>
            </div>

            {auth.user?.id === member.user._id || member.role === "owner" ? (
              <RoleBadge role={member.role} />
            ) : (
              <MemberRoleSelect
                workspaceId={currentWorkspaceId!}
                userId={member.user._id}
                currentRole={member.role}
                onSuccess={loadMembers}
              />
            )}
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Pending Invitations</h2>

        <div className="rounded-xl border border-border-default">
          {pendingInvites.length === 0 ? (
            <div className="p-6 text-center text-text-secondary">
              No pending invitations.
            </div>
          ) : (
            pendingInvites.map((invite) => (
              <div
                key={invite._id}
                className="flex items-center justify-between border-b border-border-default p-5 last:border-b-0"
              >
                <div>
                  <h3 className="font-medium">{invite.email}</h3>

                  <p className="text-sm text-text-secondary">
                    Expires {new Date(invite.expiresAt).toLocaleDateString()}
                  </p>
                </div>

                <RoleBadge role={invite.role} />
              </div>
            ))
          )}
        </div>
      </div>

      <InviteMemberModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        workspaceId={currentWorkspaceId!}
        onSuccess={loadMembers}
      />
    </div>
  );
}

export default WorkspaceMembers;
