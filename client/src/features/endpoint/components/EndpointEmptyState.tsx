import { Copy, Send } from "lucide-react";

import { Button } from "@/shared/components/ui/Button";

import { sendTestRequest } from "../api/sendTestRequest";

interface Props {
  endpointId: string;
  slug: string;
}

function EndpointEmptyState({ endpointId, slug }: Props) {
  const webhookUrl = `${import.meta.env.VITE_API_BASE_URL}/h/${slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(webhookUrl);
  };

  const handleTestRequest = async () => {
    try {
      await sendTestRequest(endpointId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rounded-xl border border-border-default p-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-xl font-semibold">No Requests Yet</h2>

        <p className="mt-2 text-text-secondary">
          Send requests to your webhook URL and inspect them in real time.
        </p>

        <div className="mt-6 rounded-lg border border-border-default p-4 text-left">
          <p className="mb-2 text-sm text-text-secondary">Webhook URL</p>

          <code className="block overflow-auto rounded-md bg-background p-3 text-sm">
            {webhookUrl}
          </code>

          <div className="mt-4 flex gap-3">
            <Button onClick={handleCopy}>
              <Copy size={16} />
              Copy URL
            </Button>

            <Button onClick={handleTestRequest}>
              <Send size={16} />
              Send Test Request
            </Button>
          </div>
        </div>

        <div className="mt-6 text-left">
          <h3 className="font-medium">Quick Start</h3>

          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li>• Paste this URL into Stripe</li>

            <li>• Paste this URL into GitHub</li>

            <li>• Use it in Postman</li>

            <li>• Send requests using Axios</li>

            <li>• Send requests using Fetch</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EndpointEmptyState;
