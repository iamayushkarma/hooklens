import { useEffect, useState } from "react";
import { Pause, Play, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useCurrentEndpoint } from "../hooks/useCurrentEndpoint";
import { updateEndpoint } from "../api/updateEndpoint";
import { deleteEndpoint } from "../api/deleteEndpoint";
import CopyButton from "@/shared/components/ui/CopyButton";
import EndpointSettingsSkeleton from "@/shared/components/skletons/EndpointSettingsSkeleton";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";

function EndpointSettings() {
  const endpoint = useCurrentEndpoint();

  const navigate = useNavigate();
  const { workspaceId, projectId } = useParams();

  const [label, setLabel] = useState("");

  useEffect(() => {
    if (endpoint) {
      setLabel(endpoint.label);
    }
  }, [endpoint]);

  if (!endpoint) {
    return <EndpointSettingsSkeleton />;
  }

  const webhookUrl = `${import.meta.env.VITE_WEBHOOK_BASE_URL}/h/${endpoint?.slug}`;

  const handleToggleStatus = async () => {
    try {
      await updateEndpoint(endpoint._id, {
        isActive: !endpoint.isActive,
      });

      alert("Status updated");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      await updateEndpoint(endpoint._id, {
        label,
      });

      alert("Endpoint updated");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this endpoint permanently?");

    if (!confirmed) return;

    try {
      await deleteEndpoint(endpoint._id);

      navigate(`/dashboard/workspaces/${workspaceId}/projects/${projectId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* General Information */}
      <div className="rounded-lg border border-border-default bg-bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-text-primary">
          General Information
        </h2>
        <p className="mb-5 text-sm text-text-secondary">
          Update the public information for this endpoint.
        </p>

        <div className="space-y-5">
          <div>
            <Input
              label="Endpoint Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />

            <p className="mt-1.5 text-xs text-text-secondary">
              The name used to identify this endpoint in the dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <p className="mb-1 text-sm font-medium text-text-primary">Slug</p>
              <p className="truncate rounded-lg border border-border-default bg-bg-base px-3 py-2 font-mono text-sm text-text-secondary">
                {endpoint.slug}
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm font-medium text-text-primary">
                Endpoint ID
              </p>
              <p className="truncate rounded-lg border border-border-default bg-bg-base px-3 py-2 font-mono text-sm text-text-secondary">
                {endpoint._id}
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm font-medium text-text-primary">
                Total Requests
              </p>
              <p className="rounded-lg border border-border-default bg-bg-base px-3 py-2 font-mono text-sm text-text-secondary">
                {endpoint.requestCount}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}> Save Changes</Button>
          </div>
        </div>
      </div>

      {/* Webhook URL */}
      <div className="rounded-lg border border-border-default bg-bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-text-primary">Webhook URL</h2>
        <p className="mb-5 text-sm text-text-secondary">
          The destination address for your webhook events.
        </p>

        <div className="flex items-center gap-3">
          <code className="flex-1 overflow-x-auto rounded-lg border border-border-default bg-bg-base px-3 py-2 font-mono text-sm text-text-accent">
            {webhookUrl}
          </code>

          <CopyButton content={webhookUrl} />
        </div>
      </div>

      {/* Endpoint Status */}
      <div className="rounded-lg border border-border-default bg-bg-card p-6 shadow-sm">
        <div className="mb-1 flex items-start justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            Endpoint Status
          </h2>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              endpoint.isActive
                ? "bg-success-bg text-success"
                : "bg-danger-bg text-danger"
            }`}
          >
            {endpoint.isActive ? "● Active" : "● Disabled"}
          </span>
        </div>

        <p className="mb-5 text-sm text-text-secondary">
          Temporarily pause incoming requests.
        </p>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-text-secondary">
            {endpoint.isActive
              ? "This endpoint is currently processing incoming payloads and executing configured triggers."
              : "This endpoint is paused and will not process incoming payloads until re-enabled."}
          </p>

          <button
            onClick={handleToggleStatus}
            className={`flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-fast ${
              endpoint.isActive
                ? "border-warning-border bg-warning-bg text-warning hover:bg-warning-border/40"
                : "border-success-border bg-success-bg text-success hover:bg-success-border/40"
            }`}
          >
            {endpoint.isActive ? <Pause size={16} /> : <Play size={16} />}
            {endpoint.isActive ? "Pause Endpoint" : "Enable Endpoint"}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-danger-border bg-danger-bg p-6">
        <h2 className="mb-4 text-lg font-semibold text-danger">Danger Zone</h2>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text-primary">
              Delete this endpoint
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Once you delete an endpoint, there is no going back. Please be
              certain. All historical request data will be purged.
            </p>
          </div>

          <Button
            className="bg-danger hover:bg-danger-hover"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
            Delete Endpoint
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EndpointSettings;
