import { useParams } from "react-router-dom";

const AcceptInvitation = () => {
  const { token } = useParams();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-xl border p-8">
        <h1 className="text-2xl font-semibold">Accept Workspace Invitation</h1>

        <p className="mt-4 text-sm text-muted-foreground">Invitation Token</p>

        <code className="mt-2 block rounded bg-muted px-3 py-2">{token}</code>
      </div>
    </div>
  );
};

export default AcceptInvitation;
