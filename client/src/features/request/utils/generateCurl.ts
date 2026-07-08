import type { RequestLog } from "../types/request.types";

export function generateCurl(request: RequestLog) {
  const method = request.method;

  const headers = Object.entries(request.headers ?? {})
    .map(([key, value]) => `-H "${key}: ${String(value)}"`)
    .join(" \\\n");

  const body =
    method === "GET" || method === "HEAD"
      ? ""
      : ` \\
-d '${JSON.stringify(request.body ?? {})}'`;

  return `curl -X ${method} \\
${headers}${body}`;
}
