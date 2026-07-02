import { Resend } from "resend";
import { invitationEmailTemplate } from "../templates/invitation-email";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendInvitationEmailProps {
  to: string;
  inviterName: string;
  workspaceName: string;
  role: string;
  inviteLink: string;
}

export async function sendInvitationEmail({
  to,
  inviterName,
  workspaceName,
  role,
  inviteLink,
}: SendInvitationEmailProps) {
  return resend.emails.send({
    from: process.env.MAIL_FROM!,
    to,
    subject: `${inviterName} invited you to join ${workspaceName}`,
    html: invitationEmailTemplate({
      inviterName,
      workspaceName,
      role,
      inviteLink,
    }),
  });
}
