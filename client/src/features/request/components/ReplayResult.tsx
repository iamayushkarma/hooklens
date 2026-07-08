import { JsonSection } from "./JsonSection";
import type { ReplayResponse } from "../api/replayRequest";

interface ReplayResultProps {
  result: ReplayResponse;
}

function ReplayResult({ result }: ReplayResultProps) {
  const success = result.replay.status >= 200 && result.replay.status < 300;

  return (
    <section className="overflow-hidden rounded-lg border border-border-default">
      <div className="border-b border-border-default px-5 py-4">
        <h2 className="text-lg font-semibold">Replay Result</h2>

        <p className="mt-1 text-sm text-text-secondary">
          Response received from the destination webhook.
        </p>
      </div>

      <div className="grid gap-4 border-b border-border-default p-5 md:grid-cols-3">
        <div>
          <p className="text-xs text-text-secondary">Status</p>

          <span
            className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
              success
                ? "bg-green-500/10 text-green-600"
                : "bg-red-500/10 text-red-600"
            }`}
          >
            {result.replay.status}
          </span>
        </div>

        <div>
          <p className="text-xs text-text-secondary">Latency</p>

          <p className="mt-1 text-sm font-medium">
            {result.replay.durationMs} ms
          </p>
        </div>

        <div>
          <p className="text-xs text-text-secondary">Method</p>

          <p className="mt-1 text-sm font-medium">{result.original.method}</p>
        </div>
      </div>

      <div className="space-y-6 p-5">
        <JsonSection title="Response Headers" data={result.replay.headers} />

        <JsonSection title="Response Body" data={result.replay.body} />
      </div>
    </section>
  );
}

export default ReplayResult;
