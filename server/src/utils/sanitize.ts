// Headers that should never want to store (sensitive / useless)
const BLOCKED_HEADERS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "proxy-authorization",
  "x-api-key",
  "x-auth-token",
]);

const MAX_BODY_BYTES = 100_000; // 100KB
const MAX_QUERY_PARAMS = 50;
const MAX_HEADER_COUNT = 100;

const sanitizeHeaders = (
  headers: Record<string, string | string[] | undefined>,
): Record<string, string> => {
  return Object.entries(headers)
    .filter(([key]) => !BLOCKED_HEADERS.has(key.toLowerCase()))
    .slice(0, MAX_HEADER_COUNT) // cap header count
    .reduce<Record<string, string>>((acc, [key, val]) => {
      // Flatten arrays into comma-separated string
      acc[key.toLowerCase()] = Array.isArray(val)
        ? val.join(", ")
        : (val ?? "");
      return acc;
    }, {});
};

// Cap body size to prevent huge payloads being stored
const sanitizeBody = (body: any, maxBytes = 100_000): any => {
  if (body === null || body === undefined) return null;

  const serialized = JSON.stringify(body);
  if (!serialized) return null;

  if (Buffer.byteLength(serialized, "utf8") > MAX_BODY_BYTES) {
    return { _truncated: true, _reason: "Payload exceeds 100KB storage limit" };
  }

  return body;
};

const sanitizeQuery = (
  query: Record<string, unknown>,
): Record<string, string> => {
  return Object.entries(query)
    .slice(0, MAX_QUERY_PARAMS)
    .reduce<Record<string, string>>((acc, [key, val]) => {
      acc[key] = String(val ?? "");
      return acc;
    }, {});
};
export { sanitizeHeaders, sanitizeBody, sanitizeQuery };
