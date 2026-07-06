export interface Notification {
  _id: string;

  type:
    | "workspace_invite"
    | "member_joined"
    | "member_left"
    | "role_changed"
    | "project_created"
    | "endpoint_created";

  title: string;

  message: string;

  actionRequired: boolean;

  isRead: boolean;

  createdAt: string;

  data: {
    invitationId?: string;
    workspaceId?: string;
    workspaceName?: string;
    role?: string;
    token?: string;
  };
}
