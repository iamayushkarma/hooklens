import { useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import { useCurrentEndpoint } from "../hooks/useCurrentEndpoint";
import { updateEndpoint } from "../api/updateEndpoint";
import { deleteEndpoint } from "../api/deleteEndpoint";
import { useNavigate, useParams } from "react-router-dom";
function EndpointSettings() {
  const endpoint = useCurrentEndpoint();

  const [label, setLabel] = useState(endpoint?.label ?? "");

  const webhookUrl = `${import.meta.env.VITE_API_BASE_URL}/h/${endpoint?.slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(webhookUrl);
  };
  const handleToggleStatus = async () => {
    if (!endpoint) return;

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
    if (!endpoint) return;

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
    console.log("Delete endpoint");
  };

  return (
    <div className="space-y-6">
      {/* Endpoint Information */}
      <div className="rounded-lg border border-border-default p-5">
        <h2 className="mb-4 text-lg font-semibold">Endpoint Information</h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-text-secondary">
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

            <p className="font-mono">{endpoint?.slug}</p>
          </div>

          <div>
            <p className="text-sm text-text-secondary">Status</p>

            <span
              className={`rounded-full px-2 py-1 text-xs ${
                endpoint?.isActive
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {endpoint?.isActive ? "Active" : "Disabled"}
            </span>
            <button
              onClick={handleToggleStatus}
              className="rounded-lg border border-border-default px-4 py-2"
            >
              {endpoint?.isActive ? "Disable Endpoint" : "Enable Endpoint"}
            </button>
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
          <code className="flex-1 overflow-hidden rounded-lg bg-background p-3 text-sm">
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
          Permanently delete this endpoint and all associated requests.
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
