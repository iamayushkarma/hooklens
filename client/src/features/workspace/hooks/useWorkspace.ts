import { useParams } from "react-router-dom";

export function useWorkspace() {
  const { workspaceId } = useParams();

  return {
    workspaceId,
  };
}
