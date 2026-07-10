import { useEffect, useState } from "react";
import { UserPlus, MoreVertical, Mail, Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/Button";
import { RoleBadge } from "@/shared/components/ui/role-badge";
import RemoveMemberModal from "../components/RemoveMemberModal";
import InviteMemberModal from "../components/InviteMemberModal";
import { usePermissions } from "@/shared/hooks/usePermissions";
import {
  getMembers,
  type WorkspaceMember,
  type PendingInvitation,
} from "../api/getMembers";

import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace";
import { useAuthStore } from "@/store/auth.store";
import MemberRoleSelect from "../components/MemberRoleSelect";
import CancelInvitationModal from "../components/CancelInvitationModal";
import ResendInvitationButton from "../components/ResendInvitationButton";

function getInitials(name?: string, email?: string) {
  if (name) {
    const initials = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
    if (initials) return initials;
  }

  if (email) {
    const local = email.split("@")[0];
    return local.slice(0, 2).toUpperCase();
  }

  return "?";
}

function WorkspaceMembers() {
  const { currentWorkspaceId } = useCurrentWorkspace();
  const auth = useAuthStore();
  const [selectedMember, setSelectedMember] = useState<WorkspaceMember | null>(
    null,
  );
  const permissions = usePermissions();
  const [selectedInvite, setSelectedInvite] =
    useState<PendingInvitation | null>(null);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Team Members
          </h2>

          <p className="text-sm text-text-secondary">
            Manage workspace members and invitations.
          </p>
        </div>

        {permissions.canInviteMembers && (
          <Button
            onClick={() => setInviteOpen(true)}
            className="self-start sm:self-auto"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default bg-bg-card">
        {/* Table header — hidden on mobile, rows become cards instead */}
        <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)_auto] items-center gap-4 border-b border-border-default bg-bg-surface px-5 py-3 text-xs font-medium uppercase tracking-wide text-text-secondary sm:grid">
          <span>Member</span>
          <span>Email</span>
          <span>Role</span>
          <span className="text-right">Actions</span>
        </div>

        {members.map((member) => {
          const isLocked =
            !permissions.canManageMembers ||
            auth.user?.id === member.user._id ||
            member.role === "owner";

          return (
            <div
              key={member.memberId}
              className="flex flex-col gap-4 border-b border-border-default px-5 py-4 last:border-b-0 sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-sm font-semibold text-accent">
                  {getInitials(member.user.name, member.user.email)}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-medium text-text-primary">
                    {member.user.name ?? member.user.email}
                  </h3>
                  {member.lastActiveAt && (
                    <p className="truncate text-sm text-text-secondary">
                      Last active {member.lastActiveAt}
                    </p>
                  )}
                  {/* Email shown inline on mobile since the column collapses */}
                  <p className="truncate text-sm text-text-secondary sm:hidden">
                    {member.user.email}
                  </p>
                </div>
              </div>

              <p className="hidden truncate text-sm text-text-secondary sm:block">
                {member.user.email}
              </p>

              <div className="flex items-center justify-between sm:block">
                <span className="text-xs font-medium uppercase text-text-secondary sm:hidden">
                  Role
                </span>
                {isLocked ? (
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

              <div className="flex items-center justify-between sm:justify-end">
                <span className="text-xs font-medium uppercase text-text-secondary sm:hidden">
                  Actions
                </span>
                {isLocked ? (
                  <button
                    className="rounded-md p-1.5 text-text-secondary transition-colors hover:bg-bg-surface"
                    aria-label="Member actions"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    className="text-sm font-medium text-danger transition-colors hover:text-danger-hover"
                    onClick={() => {
                      setSelectedMember(member);
                      setRemoveOpen(true);
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-text-primary">
          Pending Invitations
        </h2>

        {pendingInvites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-bg-card px-6 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bg-surface text-text-secondary">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-text-primary">
              No pending invitations
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              When you invite someone to your workspace, they will appear here.
            </p>
            {permissions.canInviteMembers && (
              <button
                onClick={() => setInviteOpen(true)}
                className="mt-4 flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover hover:underline"
              >
                <Plus className="h-4 w-4" />
                Send a new invitation
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border-default bg-bg-card">
            {pendingInvites.map((invite) => (
              <div
                key={invite._id}
                className="flex flex-col gap-4 border-b border-border-default p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="truncate font-medium text-text-primary">
                    {invite.email}
                  </h3>

                  <p className="text-sm text-text-secondary">
                    Expires {new Date(invite.expiresAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <RoleBadge role={invite.role} />

                  {permissions.canManageMembers && (
                    <>
                      <ResendInvitationButton
                        workspaceId={currentWorkspaceId!}
                        invitationId={invite._id}
                      />

                      <button
                        className="text-sm font-medium text-danger transition-colors hover:text-danger-hover"
                        onClick={() => {
                          setSelectedInvite(invite);
                          setCancelOpen(true);
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <InviteMemberModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        workspaceId={currentWorkspaceId!}
        onSuccess={loadMembers}
      />

      <RemoveMemberModal
        isOpen={removeOpen}
        onClose={() => setRemoveOpen(false)}
        workspaceId={currentWorkspaceId!}
        userId={selectedMember?.user._id ?? ""}
        memberName={selectedMember?.user.name ?? ""}
        onSuccess={loadMembers}
      />

      <CancelInvitationModal
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        workspaceId={currentWorkspaceId!}
        invitationId={selectedInvite?._id ?? ""}
        email={selectedInvite?.email ?? ""}
        onSuccess={loadMembers}
      />
    </div>
  );
}

export default WorkspaceMembers;
