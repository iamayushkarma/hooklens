import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/Button";
import BackButton from "@/shared/components/ui/BackButton";
import {
  Radio,
  Search,
  RotateCw,
  Sparkles,
  Users,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
  KeyRound,
  GitCompare,
  Lock,
  Globe,
} from "lucide-react";
import { useState } from "react";

function Divider({ label }: { label: string }) {
  return (
    <div className="flex mx-auto items-center gap-4">
      <div className="h-px flex-1 bg-border-subtle" />
      <span className="text-sm text-text-secondary">{label}</span>
      <div className="h-px flex-1 bg-border-subtle" />
    </div>
  );
}

/* Same white-card treatment as the register form panel:
   bg-white, p-8, rounded-xl, shadow-sm */
function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-white p-8 rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

/* Small monospace pill for URLs, field names, and route paths */
function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-bg-base text-[.85em] font-mono text-text-primary">
      {children}
    </code>
  );
}

const STEPS = [
  {
    icon: Radio,
    title: "Capture",
    body: "Sign up and a workspace, project, and first endpoint are created automatically — you get a URL like /h/abc123xyz. That route is intentionally public and unauthenticated, the same way Stripe's or GitHub's real receivers work, so any webhook sender can hit it with zero setup on their end.",
  },
  {
    icon: Search,
    title: "Inspect",
    body: "The capture route writes a RequestLog and pushes it over a Socket.io room scoped to that endpoint's slug — your dashboard updates without a refresh. Open a request to see method, headers, query params, and both the raw body and parsed JSON, exactly as they arrived.",
  },
  {
    icon: RotateCw,
    title: "Replay",
    body: "Pick any captured request and re-fire it at a new target URL — localhost, staging, wherever. HookLens re-issues the same method, headers, and body, then records the response status, headers, body, and latency as its own ReplayLog entry, separate from the original.",
  },
  {
    icon: Sparkles,
    title: "Explain",
    body: 'The "Explain with AI" button sends the method, headers, and body to Groq\'s LLaMA 3.3 70B model, which returns a 3–4 sentence read on which service likely sent it, what event it represents, and what the key fields mean — no more parsing 40 lines of Stripe JSON by eye.',
  },
];

const ARCHITECTURE = [
  {
    label: "User",
    note: "Signs up, owns nothing directly — everything lives under a workspace.",
  },
  {
    label: "Workspace",
    note: "Top-level container for a team, created automatically on sign-up.",
  },
  {
    label: "Project",
    note: 'Groups related endpoints, e.g. "Stripe Integration" or "GitHub Automation".',
  },
  {
    label: "Endpoint",
    note: "The actual /h/:slug URL — has its own secret, retention window, and active/paused state.",
  },
  {
    label: "Request Log",
    note: "One document per inbound request, with a TTL index for automatic expiry.",
  },
  {
    label: "Replay Job",
    note: "One document per re-fire, holding the response diff against the original.",
  },
];

const REQUEST_FIELDS = [
  ["method", "GET / POST / PUT / PATCH / DELETE"],
  ["headers", "Full header map, unfiltered"],
  ["rawBody", "Preserved byte-for-byte, before any parsing"],
  ["parsedBody", "JSON-parsed version, when the content type allows it"],
  ["query", "Parsed query-string params"],
  ["ip / userAgent", "Sender IP and user agent"],
  ["contentType / size", "Content-Type header and body size in bytes"],
];

const ROLES = [
  [
    "Owner",
    "Full control, including deleting the workspace and transferring ownership.",
  ],
  [
    "Admin",
    "Manage projects, endpoints, and members — can't delete the workspace.",
  ],
  [
    "Member",
    "Create and inspect endpoints, replay requests, use the AI explainer.",
  ],
  [
    "Viewer",
    "Read-only access to the live feed and request detail — no replay, no config changes.",
  ],
];

const TECH = [
  {
    group: "Frontend",
    items: [
      "React + TypeScript",
      "Vite",
      "Tailwind CSS",
      "Zustand",
      "socket.io-client",
      "Prism.js",
    ],
  },
  {
    group: "Backend",
    items: [
      "Node.js + Express",
      "Socket.io",
      "Mongoose / MongoDB",
      "JWT + bcrypt",
      "Zod validation",
      "Groq SDK",
    ],
  },
  { group: "Infra", items: ["MongoDB Atlas", "Render.com", "Vercel"] },
];

const FAQS = [
  {
    q: "How long is request data stored?",
    a: "7 days by default, enforced by a MongoDB TTL index on the request's createdAt field — not a cron job, so nothing is left sitting around if a cleanup task fails. You can set a longer or shorter retentionDays per endpoint.",
  },
  {
    q: "Is the capture endpoint authenticated?",
    a: "No — /h/:slug is intentionally public, the same way real webhook receivers work. It also always responds 200 immediately, so it never leaks timing information about what happened downstream. Every other route requires a JWT.",
  },
  {
    q: "Can I verify that a webhook really came from Stripe or GitHub?",
    a: "Yes. Each endpoint can hold an optional secret. HookLens uses it to verify the signature header a provider sends against the exact bytes it received, so you can catch spoofed or malformed requests before they matter.",
  },
  {
    q: "Can I replay a request more than once?",
    a: "Yes — every replay is its own ReplayLog entry with its own response status, headers, body, and latency in ms, so you can compare several replays of the same original request side by side.",
  },
  {
    q: "What happens when I add teammates?",
    a: "You invite them into a workspace with a role — Owner, Admin, Member, or Viewer. Everyone with access sees the same live feed for that workspace's endpoints, over the same Socket.io room.",
  },
  {
    q: "What does the AI explainer actually see?",
    a: "Just the method, headers, and body of the specific request you ask it to explain — sent to Groq's LLaMA 3.3 70B for a short summary. It's opt-in per request, not run automatically on everything that arrives.",
  },
];

function LearnMorePage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="w-full bg-bg-base min-h-screen relative">
      <BackButton fallbackHref="/" className="absolute top-4 left-4 z-20" />

      <div className="w-[90%] max-w-2xl mx-auto py-16 md:py-20 flex flex-col gap-6">
        {/* Heading */}
        <div className="text-center mx-auto max-w-lg">
          <h1 className="text-3xl md:text-4xl font-medium md:font-semibold">
            How HookLens works
          </h1>
          <p className="text-text-secondary mt-2">
            Stripe, GitHub, Razorpay, Twilio, Slack, and SendGrid all talk to
            your app the same way — an HTTP request fired at a URL. HookLens is
            the window into that request, live, with a replay button attached.
          </p>
          <Button
            onClick={() => navigate("/register")}
            className="mt-6 w-fit mx-auto flex items-center justify-center gap-2 select-none"
          >
            Get your endpoint <ArrowRight className="size-4" />
          </Button>
        </div>

        {/* How it works */}
        <Card className="mt-4">
          <h2 className="text-lg font-semibold">How it works</h2>
          <div className="mt-6 flex flex-col gap-5">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="flex gap-4 items-start">
                  <div className="size-10 rounded-lg bg-accent-subtle flex items-center justify-center shrink-0">
                    <Icon className="size-4.5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[.95rem]">{s.title}</h3>
                    <p className="text-sm text-text-secondary mt-0.5 leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Divider label="Under the hood" />

        {/* Architecture */}
        <Card>
          <div className="flex items-center gap-2">
            <Layers className="size-4.5 text-accent" />
            <h2 className="text-lg font-semibold">Architecture</h2>
          </div>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">
            Every request flows down one hierarchy, and only one route in the
            whole app skips authentication:
          </p>
          <div className="mt-5 flex flex-col">
            {ARCHITECTURE.map((a, i) => (
              <div key={a.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="size-2 rounded-full bg-accent shrink-0 mt-1.5" />
                  {i < ARCHITECTURE.length - 1 && (
                    <div className="w-px flex-1 bg-border-subtle" />
                  )}
                </div>
                <div className="pb-5">
                  <span className="font-medium text-[.95rem]">{a.label}</span>
                  <p className="text-sm text-text-secondary mt-0.5">{a.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-bg-base p-4 flex gap-3 items-start">
            <Globe className="size-4.5 text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary leading-relaxed">
              <Code>/h/:slug</Code> is the one public route in the system —
              anyone can POST to it with no login, matching how real webhook
              senders behave. Every dashboard, replay, and settings route behind
              it requires a valid JWT.
            </p>
          </div>
        </Card>

        {/* Request anatomy */}
        <Card>
          <div className="flex items-center gap-2">
            <Search className="size-4.5 text-accent" />
            <h2 className="text-lg font-semibold">What gets captured</h2>
          </div>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">
            Nothing is summarized away. Each request lands as one document with:
          </p>
          <div className="mt-4 flex flex-col">
            {REQUEST_FIELDS.map(([field, note], i) => (
              <div
                key={field}
                className={`flex justify-between gap-4 py-2.5 ${
                  i > 0 ? "border-t border-border-subtle" : ""
                }`}
              >
                <Code>{field}</Code>
                <span className="text-sm text-text-secondary text-right">
                  {note}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Signature + Replay side by side */}
        <div className="grid sm:grid-cols-2 gap-6">
          <Card>
            <KeyRound className="size-4.5 text-accent" />
            <h3 className="font-medium text-[.95rem] mt-3">
              Signature verification
            </h3>
            <p className="text-sm text-text-secondary mt-1 leading-relaxed">
              Give an endpoint a secret and HookLens checks the provider's
              signature header — Stripe, GitHub, Razorpay — against the exact
              bytes it received, before you ever open the request.
            </p>
          </Card>
          <Card>
            <GitCompare className="size-4.5 text-accent" />
            <h3 className="font-medium text-[.95rem] mt-3">
              Replay with a real diff
            </h3>
            <p className="text-sm text-text-secondary mt-1 leading-relaxed">
              Replaying re-sends the original method, headers, and body to a
              target you choose, then stores the response status, headers, body,
              and latency as its own record — so you can compare replays against
              each other, not just against a guess.
            </p>
          </Card>
        </div>

        <Divider label="Team & data lifecycle" />

        {/* Roles */}
        <Card>
          <div className="flex items-center gap-2">
            <Users className="size-4.5 text-accent" />
            <h2 className="text-lg font-semibold">Roles per workspace</h2>
          </div>
          <div className="mt-5 flex flex-col">
            {ROLES.map(([role, desc], i) => (
              <div
                key={role}
                className={`flex gap-4 py-3 ${
                  i > 0 ? "border-t border-border-subtle" : ""
                }`}
              >
                <span className="font-medium text-[.95rem] w-20 shrink-0">
                  {role}
                </span>
                <span className="text-sm text-text-secondary">{desc}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Retention, security */}
        <div className="grid sm:grid-cols-2 gap-6">
          <Card>
            <Clock className="size-4.5 text-accent" />
            <h3 className="font-medium text-[.95rem] mt-3">
              Automatic retention
            </h3>
            <p className="text-sm text-text-secondary mt-1 leading-relaxed">
              Requests expire on a MongoDB TTL index — <Code>7 days</Code> by
              default, configurable per endpoint — so nothing needs manual
              cleanup and nothing silently piles up.
            </p>
          </Card>
          <Card>
            <Lock className="size-4.5 text-accent" />
            <h3 className="font-medium text-[.95rem] mt-3">
              Security baseline
            </h3>
            <p className="text-sm text-text-secondary mt-1 leading-relaxed">
              JWTs over <Code>Authorization: Bearer</Code>, bcrypt-hashed
              passwords, Zod-validated inputs, rate-limited auth routes, and
              role checks before any destructive action.
            </p>
          </Card>
        </div>

        <Divider label="Good to know" />

        {/* FAQ */}
        <Card>
          <div className="flex flex-col">
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={f.q}
                  className={i > 0 ? "border-t border-border-subtle" : ""}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="font-medium text-[.95rem]">{f.q}</span>
                    <span className="text-text-secondary text-xl leading-none">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="text-sm text-text-secondary pb-4 leading-relaxed">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Final CTA */}
        <Card className="text-center">
          <ShieldCheck className="size-5 text-accent mx-auto" />
          <h2 className="text-lg font-semibold mt-2">
            Stop guessing what the webhook sent.
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Get a live endpoint in under a minute. No credit card, no setup.
          </p>
          <div className="flex md:flex-row flex-col gap-3 mt-5">
            <Button
              onClick={() => navigate("/register")}
              className="flex-1 items-center justify-center gap-2 select-none"
            >
              Start capturing requests <ArrowRight className="size-4" />
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="bg-gray-950 flex-1 items-center justify-center hover:bg-gray-900"
            >
              Back to site
            </Button>
          </div>
        </Card>

        <p className="text-center text-sm text-text-secondary mt-2">
          Already exploring?{" "}
          <Link to="/" className="font-medium text-accent hover:underline">
            Go to homepage
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LearnMorePage;
