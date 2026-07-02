interface InvitationTemplateProps {
  inviterName: string;
  workspaceName: string;
  role: string;
  inviteLink: string;
}

export function invitationEmailTemplate({
  inviterName,
  workspaceName,
  role,
  inviteLink,
}: InvitationTemplateProps) {
  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8" />
<title>Workspace Invitation</title>
</head>

<body style="background:#f7f7f7;padding:40px;font-family:Arial,sans-serif;">

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
>
<tr>
<td align="center">

<table
    width="600"
    cellpadding="0"
    cellspacing="0"
    style="
        background:white;
        border-radius:12px;
        overflow:hidden;
        border:1px solid #e5e7eb;
    "
>

<tr>
<td
    style="
        background:#111827;
        color:white;
        padding:24px;
        font-size:24px;
        font-weight:bold;
    "
>
HookLens
</td>
</tr>

<tr>
<td style="padding:40px;">

<h2 style="margin-top:0;">
You've been invited 🎉
</h2>

<p>
<strong>${inviterName}</strong>
invited you to join
<strong>${workspaceName}</strong>.
</p>

<p>

Role:

<strong>${role}</strong>

</p>

<div style="margin:40px 0;">

<a
href="${inviteLink}"
style="
background:#111827;
color:white;
padding:14px 24px;
text-decoration:none;
border-radius:8px;
display:inline-block;
font-weight:bold;
"
>

Accept Invitation

</a>

</div>

<p style="color:#6b7280;">

If you weren't expecting this invitation,
you can safely ignore this email.

</p>

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`;
}
