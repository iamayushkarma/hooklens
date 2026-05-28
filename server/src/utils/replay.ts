import axios, { AxiosError } from "axios";

interface ReplayResult {
  status: number;
  headers: Record<string, string>;
  body: string;
  durationMs: number;
}

const REPLAY_TIMEOUT_MS = 10_000;
const SKIP_HEADERS = new Set([
  "host",
  "content-length",
  "connection",
  "transfer-encoding",
]);

export const replayRequest = async (
  method: string,
  headers: Record<string, string>,
  body: unknown,
  targetUrl: string,
): Promise<ReplayResult> => {
  // Validate target URL before attempting request
  try {
    new URL(targetUrl);
  } catch {
    throw new Error("Invalid target URL");
  }

  const forwardHeaders = Object.fromEntries(
    Object.entries(headers).filter(
      ([key]) => !SKIP_HEADERS.has(key.toLowerCase()),
    ),
  );

  const hasBody = !["GET", "HEAD"].includes(method.toUpperCase());

  const start = Date.now();

  try {
    const response = await axios({
      method: method.toLowerCase(),
      url: targetUrl,
      headers: forwardHeaders,
      data: hasBody ? body : undefined,
      timeout: REPLAY_TIMEOUT_MS,
      validateStatus: () => true,
      maxRedirects: 0,
    });

    return {
      status: response.status,
      headers: response.headers as Record<string, string>,
      body:
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data),
      durationMs: Date.now() - start,
    };
  } catch (err) {
    // Network-level errors (DNS fail, connection refused, timeout)
    const message =
      err instanceof AxiosError ? (err.code ?? err.message) : "Unknown error";

    throw new Error(`Replay failed: ${message}`);
  }
};
