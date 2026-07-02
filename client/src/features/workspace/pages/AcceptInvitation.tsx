import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuthStore } from "@/store/auth.store";
import { useWorkspaceStore } from "@/store/workspace.store";

import { acceptInvitation } from "../api/acceptInvitation";
import { getWorkspaces } from "../api/getWorkspaces";

const AcceptInvitation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const auth = useAuthStore();

  const setCurrentWorkspaceId = useWorkspaceStore(
    (state) => state.setCurrentWorkspaceId,
  );

  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    if (!auth.token) {
      navigate(`/login?invite=${token}`, {
        replace: true,
      });

      return;
    }

    joinWorkspace();
  }, []);

  const joinWorkspace = async () => {
    try {
      await acceptInvitation(token!);

      const workspaces = await getWorkspaces();

      const joinedWorkspace = workspaces.find(
        (workspace: any) =>
          workspace._id !== useWorkspaceStore.getState().currentWorkspaceId,
      );

      if (joinedWorkspace) {
        setCurrentWorkspaceId(joinedWorkspace._id);

        navigate(`/dashboard/workspaces/${joinedWorkspace._id}`, {
          replace: true,
        });

        return;
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Unable to accept invitation.");
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      Joining workspace...
    </div>
  );
};

export default AcceptInvitation;
