import Groq from "groq-sdk";

const getEnvOrThrow = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const groq = new Groq({
  apiKey: getEnvOrThrow("GROQ_API_KEY"),
});

const MODEL = "llama-3.3-70b-versatile";
const MAX_INPUT_CHARS = 10_000;

const SYSTEM_PROMPT = `
You are a webhook debugging expert.

Given raw HTTP request data:
1. Identify what service/platform likely sent the request
2. Explain what event/action it represents
3. Explain the important payload fields

Rules:
- Be concise and developer-friendly
- Respond in 3-4 short sentences
- If uncertain, make a reasonable inference instead of pretending certainty
- Never mention that you are an AI model
`;

const safeStringify = (value: unknown): string => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "[Unable to serialize payload]";
  }
};

// Remove sensitive headers before sending to LLM
const sanitizeHeaders = (
  headers: Record<string, string>,
): Record<string, string> => {
  const blocked = new Set([
    "authorization",
    "cookie",
    "set-cookie",
    "x-api-key",
    "proxy-authorization",
  ]);

  return Object.fromEntries(
    Object.entries(headers).filter(([key]) => !blocked.has(key.toLowerCase())),
  );
};

export const explainPayload = async (
  method: string,
  headers: Record<string, string>,
  body: unknown,
): Promise<string> => {
  try {
    const sanitizedHeaders = sanitizeHeaders(headers);

    const payload = safeStringify({
      method: method.toUpperCase(),
      headers: sanitizedHeaders,
      body,
    });

    // Prevent massive token usage / slow requests
    const truncatedPayload =
      payload.length > MAX_INPUT_CHARS
        ? `${payload.slice(0, MAX_INPUT_CHARS)}\n\n[Payload truncated...]`
        : payload;

    const completion = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 300,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT.trim(),
        },
        {
          role: "user",
          content: truncatedPayload,
        },
      ],
    });

    const explanation = completion.choices[0]?.message?.content?.trim();

    return explanation || "Could not generate explanation.";
  } catch (err) {
    console.error("[Groq explainPayload]", err);

    return "AI explanation is temporarily unavailable.";
  }
};
