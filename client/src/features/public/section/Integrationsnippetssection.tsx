import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { Copy, Check } from "lucide-react";

interface Service {
  id: string;
  name: string;
  filename: string;
  endpoint: string;
  headers: string[];
  body: string;
}

const services: Service[] = [
  {
    id: "stripe",
    name: "Stripe",
    filename: "stripe-webhook.sh",
    endpoint: "https://hooklens.dev/h/abc123xyz",
    headers: ['"Content-Type: application/json"'],
    body: '\'{"type": "payment_intent.succeeded"}\'',
  },
  {
    id: "github",
    name: "GitHub",
    filename: "github-webhook.sh",
    endpoint: "https://hooklens.dev/h/abc123xyz",
    headers: ['"X-GitHub-Event: push"', '"Content-Type: application/json"'],
    body: '\'{"ref": "refs/heads/main"}\'',
  },
  {
    id: "twilio",
    name: "Twilio",
    filename: "twilio-webhook.sh",
    endpoint: "https://hooklens.dev/h/abc123xyz",
    headers: ['"Content-Type: application/x-www-form-urlencoded"'],
    body: "'MessageStatus=delivered&To=%2B14155552671'",
  },
  {
    id: "slack",
    name: "Slack",
    filename: "slack-webhook.sh",
    endpoint: "https://hooklens.dev/h/abc123xyz",
    headers: ['"Content-Type: application/json"'],
    body: '\'{"event": "app_mention", "text": "hello"}\'',
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    filename: "sendgrid-webhook.sh",
    endpoint: "https://hooklens.dev/h/abc123xyz",
    headers: ['"Content-Type: application/json"'],
    body: '\'[{"event": "delivered", "email": "a@b.com"}]\'',
  },
  {
    id: "razorpay",
    name: "Razorpay",
    filename: "razorpay-webhook.sh",
    endpoint: "https://hooklens.dev/h/abc123xyz",
    headers: [
      '"X-Razorpay-Signature: t=..."',
      '"Content-Type: application/json"',
    ],
    body: '\'{"event": "payment.captured"}\'',
  },
];

function plainSnippet(s: Service): string {
  const h = s.headers.map((x: string) => `  -H ${x} \\`).join("\n");
  return `curl -X POST \\\n  ${s.endpoint} \\\n${h}\n  -d ${s.body}`;
}

export default function IntegrationSnippetsSection() {
  const [activeId, setActiveId] = useState<string>(services[0].id);
  const [copied, setCopied] = useState(false);
  const [latency, setLatency] = useState(43);

  // services is a fixed, non-empty local array and activeId only ever
  // comes from it, so this find can never actually miss.
  const active = services.find((s) => s.id === activeId) as Service;

  const select = (id: string) => {
    if (id === activeId) return;
    setActiveId(id);
    setLatency(18 + Math.floor(Math.random() * 55));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(plainSnippet(active));
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  };

  return (
    <section className="bg-bg-base font-sans antialiased transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-24">
        <span className="block font-mono text-xs font-medium tracking-widest text-accent uppercase mb-5">
          Webhook capture
        </span>

        <h1 className="font-sans font-bold text-4xl sm:text-5xl leading-tight tracking-tight text-text-primary mb-4">
          Send it anywhere.
          <br />
          Watch it land.
        </h1>

        <p className="text-base leading-relaxed text-text-secondary max-w-md mb-12">
          Point any service at{" "}
          <code className="font-mono text-sm bg-bg-surface border border-border-default rounded px-1.5 py-0.5 text-text-primary">
            hooklens.dev/h/abc123xyz
          </code>{" "}
          and every request shows up in your dashboard the moment it arrives.
        </p>

        <div className="bg-bg-card border border-border-default rounded-xl overflow-hidden shadow-md">
          <div className="p-4 border-b border-border-subtle">
            <LayoutGroup id="integration-tabs">
              <div className="flex gap-2 bg-bg-sidebar border border-border-default w-fit rounded-md p-0.75">
                {services.map((s) => {
                  const isActive = s.id === activeId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => select(s.id)}
                      className="relative cursor-pointer"
                    >
                      <div className="relative px-2.5 py-1.5 text-sm">
                        {isActive && (
                          <motion.div
                            layoutId="integration-tab-pill"
                            className="absolute inset-0 rounded-[5px] pointer-events-none bg-bg-card shadow-md border border-border-default"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}
                        <span
                          className={`relative z-10 transition-colors ${
                            isActive
                              ? "font-medium text-text-primary"
                              : "text-text-secondary"
                          }`}
                        >
                          {s.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
          </div>

          <div className="flex items-center gap-2.5 px-5 py-3 border-b border-border-subtle">
            <span className="font-mono text-xs font-semibold tracking-wide text-post-text bg-post-bg rounded px-1.5 py-0.5">
              POST
            </span>
            <span className="font-mono text-xs text-text-muted">
              {active.filename}
            </span>
            <button
              onClick={handleCopy}
              className={`ml-auto flex items-center gap-1.5 bg-bg-surface border border-border-default font-sans text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors ${
                copied
                  ? "text-success border-success-border"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.12 }}
                    className="flex items-center gap-1.5"
                  >
                    <Check size={13} /> Copied
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.12 }}
                    className="flex items-center gap-1.5"
                  >
                    <Copy size={13} /> Copy
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.pre
              key={active.id}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              className="m-0 px-5 py-6 font-mono text-sm leading-loose overflow-x-auto text-text-secondary"
            >
              <code>
                <span className="text-accent font-medium">curl -X POST</span>{" "}
                {"\\"}
                {"\n  "}
                <span className="text-text-primary">
                  {active.endpoint}
                </span>{" "}
                {"\\"}
                {"\n"}
                {active.headers.map((h: string, i: number) => (
                  <span key={i}>
                    {"  "}
                    <span className="text-accent font-medium">-H</span> {h}{" "}
                    {"\\"}
                    {"\n"}
                  </span>
                ))}
                {"  "}
                <span className="text-accent font-medium">-d</span>{" "}
                <span className="text-text-secondary">{active.body}</span>
              </code>
            </motion.pre>
          </AnimatePresence>

          <div className="flex items-center justify-between px-5 py-3 border-t border-border-subtle">
            <span className="flex items-center gap-2 font-mono text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              <span className="text-text-primary font-semibold">200</span>
              <span className="text-text-muted">OK</span>
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={latency}
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
                transition={{ duration: 0.15 }}
                className="font-mono text-xs text-text-muted"
              >
                captured in {latency}ms
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-5 text-sm text-text-secondary">
          Works with anything that sends a webhook these six are just the
          familiar ones.
        </p>
      </div>
    </section>
  );
}
