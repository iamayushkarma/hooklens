import { useEffect, useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useCurrentEndpoint } from "../hooks/useCurrentEndpoint";
import { updateEndpoint } from "../api/updateEndpoint";
import { deleteEndpoint } from "../api/deleteEndpoint";

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
    return (
      <div className="rounded-lg border border-border-default p-6">
        Loading endpoint...
      </div>
    );
  }

  const webhookUrl = `${import.meta.env.VITE_WEBHOOK_BASE_URL}/h/${endpoint?.slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
    } catch (error) {
      console.error(error);
    }
  };

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
      {/* Endpoint Information */}
      <div className="rounded-lg border border-border-default p-5">
        <h2 className="mb-4 text-lg font-semibold">Endpoint Information</h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-text-secondary">
              Label
            </label>

            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-background px-3 py-2"
            />
          </div>

          <div>
            <p className="text-sm text-text-secondary">Endpoint Slug</p>

            <p className="font-mono text-sm">{endpoint.slug}</p>
          </div>

          <div>
            <p className="text-sm text-text-secondary">Endpoint ID</p>

            <p className="font-mono text-sm break-all">{endpoint._id}</p>
          </div>

          <div>
            <p className="text-sm text-text-secondary">Total Requests</p>

            <p className="text-xl font-semibold">{endpoint.requestCount}</p>
          </div>

          <div>
            <p className="mb-2 text-sm text-text-secondary">Status</p>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  endpoint.isActive
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {endpoint.isActive ? "Active" : "Disabled"}
              </span>

              <button
                onClick={handleToggleStatus}
                className="rounded-lg border border-border-default px-3 py-1 text-sm"
              >
                {endpoint.isActive ? "Disable Endpoint" : "Enable Endpoint"}
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="rounded-lg bg-primary px-4 py-2 text-white"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Webhook URL */}
      <div className="rounded-lg border border-border-default p-5">
        <h2 className="mb-4 text-lg font-semibold">Webhook URL</h2>

        <div className="flex items-center gap-3">
          <code className="flex-1 overflow-x-auto rounded-lg bg-background p-3 text-sm">
            {webhookUrl}
          </code>

          <button
            onClick={handleCopy}
            className="rounded-lg border border-border-default p-3"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-500/30 p-5">
        <h2 className="mb-4 text-lg font-semibold text-red-500">Danger Zone</h2>

        <p className="mb-4 text-sm text-text-secondary">
          Permanently delete this endpoint and all associated requests. This
          action cannot be undone.
        </p>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white"
        >
          <Trash2 size={16} />
          Delete Endpoint
        </button>
      </div>
    </div>
  );
}

export default EndpointSettings;
