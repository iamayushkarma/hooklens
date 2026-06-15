// import rateLimit, { Options } from "express-rate-limit";

// const defaultOptions: Partial<Options> = {
//   standardHeaders: true, // Return rate limit info in RateLimit-* headers
//   legacyHeaders: false, // Disable X-RateLimit-* headers
// };

// // Strict - brute-force protection on login/register
// export const authRateLimit = rateLimit({
//   ...defaultOptions,
//   windowMs: 15 * 60 * 1000, // 15 min
//   max: 50,
//   message: {
//     success: false,
//     message: "Too many attempts. Try again in 15 minutes.",
//   },
//   keyGenerator: (req) => req.ip ?? "unknown", // rate limit per IP
// });

// // Generous - real services send bursts of webhooks
// export const captureRateLimit = rateLimit({
//   ...defaultOptions,
//   windowMs: 60 * 1000, // 1 min window
//   max: 120, // 2 req/sec average per IP
//   message: { success: false, message: "Rate limit exceeded." },
//   keyGenerator: (req) => req.ip ?? "unknown",
//   skip: (req) => {
//     // Skip rate limiting for localhost during development
//     return (
//       process.env.NODE_ENV === "development" &&
//       (req.ip === "127.0.0.1" || req.ip === "::1")
//     );
//   },
// });

// // General API protection
// export const apiRateLimit = rateLimit({
//   ...defaultOptions,
//   windowMs: 60 * 1000,
//   max: 300,
//   message: { success: false, message: "Too many requests." },
//   keyGenerator: (req) => req.user?.userId ?? req.ip ?? "unknown",
// });

import rateLimit, { Options } from "express-rate-limit";

const isDev = process.env.NODE_ENV === "development";

const defaultOptions: Partial<Options> = {
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev, // unlimited in dev
};

// Strict - brute-force protection on login/register
export const authRateLimit = rateLimit({
  ...defaultOptions,
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: "Too many attempts. Try again in 15 minutes.",
  },
});

// Generous - real services send bursts of webhooks
export const captureRateLimit = rateLimit({
  ...defaultOptions,
  windowMs: 60 * 1000,
  max: 120,
  message: { success: false, message: "Rate limit exceeded." },
});

// General API protection
export const apiRateLimit = rateLimit({
  ...defaultOptions,
  windowMs: 60 * 1000,
  max: 300,
  message: { success: false, message: "Too many requests." },
});
