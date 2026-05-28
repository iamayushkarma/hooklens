// Headers that should never want to store (sensitive / useless)
const BLOCKED_HEADERS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "x-forwarded-for",
  "proxy-authorization",
]);

const sanitizeHeaders = (headers: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(headers).filter(
      ([key]) => !BLOCKED_HEADERS.has(key.toLowerCase()),
    ),
  );
};

// Cap body size to prevent huge payloads being stored
const sanitizeBody = (body: any, maxBytes = 100_000): any => {
  if (!body) return null;
  const str = JSON.stringify(body);
  if (str.length > maxBytes) return { _error: "Payload too large to store" };
  return body;
};

export { sanitizeHeaders, sanitizeBody };
