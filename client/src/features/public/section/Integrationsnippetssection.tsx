"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import {
  SiStripe,
  SiGithub,
  SiTwilio,
  SiSlack,
  SiSendgrid,
  SiRazorpay,
} from "react-icons/si";
import type { IconType } from "react-icons";

interface Service {
  id: string;
  name: string;
  icon: IconType;
  filename: string;
  endpoint: string;
  headers: string[];
  body: string;
}

const services: Service[] = [
  {
    id: "stripe",
    name: "Stripe",
    icon: SiStripe,
    filename: "stripe-webhook.sh",
    endpoint: "https://hooklens.dev/h/abc123xyz",
    headers: ['"Content-Type: application/json"'],
    body: '\'{"type": "payment_intent.succeeded"}\'',
  },
  {
    id: "github",
    name: "GitHub",
    icon: SiGithub,
    filename: "github-webhook.sh",
    endpoint: "https://hooklens.dev/h/abc123xyz",
    headers: ['"X-GitHub-Event: push"', '"Content-Type: application/json"'],
    body: '\'{"ref": "refs/heads/main"}\'',
  },
  {
    id: "twilio",
    name: "Twilio",
    icon: SiTwilio,
    filename: "twilio-webhook.sh",
    endpoint: "https://hooklens.dev/h/abc123xyz",
    headers: ['"Content-Type: application/x-www-form-urlencoded"'],
    body: "'MessageStatus=delivered&To=%2B14155552671'",
  },
  {
    id: "slack",
    name: "Slack",
    icon: SiSlack,
    filename: "slack-webhook.sh",
    endpoint: "https://hooklens.dev/h/abc123xyz",
    headers: ['"Content-Type: application/json"'],
    body: '\'{"event": "app_mention", "text": "hello"}\'',
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    icon: SiSendgrid,
    filename: "sendgrid-webhook.sh",
    endpoint: "https://hooklens.dev/h/abc123xyz",
    headers: ['"Content-Type: application/json"'],
    body: '\'[{"event": "delivered", "email": "a@b.com"}]\'',
  },
  {
    id: "razorpay",
    name: "Razorpay",
    icon: SiRazorpay,
    filename: "razorpay-webhook.sh",
    endpoint: "https://hooklens.dev/h/abc123xyz",
    headers: [
      '"X-Razorpay-Signature: t=..."',
      '"Content-Type: application/json"',
    ],
    body: '\'{"event": "payment.captured"}\'',
  },
];

function buildSnippet(service: Service) {
  const headerLines = service.headers.map((h) => `  -H ${h} \\`).join("\n");
  return `curl -X POST \\\n  ${service.endpoint} \\\n${headerLines}\n  -d ${service.body}`;
}

export default function IntegrationSnippetsSection() {
  const [activeId, setActiveId] = useState(services[0].id);
  const [copied, setCopied] = useState(false);
  const active = services.find((s) => s.id === activeId)!;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildSnippet(active));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-10 text-center">
        <span className="inline-block rounded-full bg-accent-subtle px-3 py-1 text-xs font-medium text-accent">
          integrations
        </span>
        <h2 className="mt-3 text-2xl font-medium text-text-primary sm:text-3xl">
          Point any service at HookLens
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary sm:text-base">
          Stripe, GitHub, Twilio, Slack, SendGrid, Razorpay. Swap the tab, copy
          the url, paste it in — your dashboard is already listening.
        </p>
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-sm md:flex-row">
        {/* Service tabs */}
        <div className="flex overflow-x-auto border-b border-border-subtle md:w-40 md:flex-col md:overflow-visible md:border-b-0 md:border-r">
          {services.map((service) => {
            const Icon = service.icon;
            const isActive = service.id === activeId;
            return (
              <button
                key={service.id}
                onClick={() => setActiveId(service.id)}
                className="relative flex shrink-0 items-center gap-2 px-4 py-3 text-sm transition-colors md:w-full"
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-bg-surface md:border-l-2 md:border-l-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <Icon
                  className={`relative z-10 h-4 w-4 shrink-0 ${
                    isActive ? "text-accent" : "text-text-secondary"
                  }`}
                />
                <span
                  className={`relative z-10 whitespace-nowrap ${
                    isActive
                      ? "font-medium text-text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  {service.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Code panel */}
        <div className="flex-1">
          <div className="flex items-center gap-1.5 border-b border-border-subtle px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-border-strong" />
            <span className="h-2 w-2 rounded-full bg-border-strong" />
            <span className="h-2 w-2 rounded-full bg-border-strong" />
            <span className="ml-2 font-mono text-xs text-text-muted">
              {active.filename}
            </span>
            <button
              onClick={handleCopy}
              className="ml-auto flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-text-primary"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1 text-success"
                  >
                    <Check className="h-3.5 w-3.5" />
                    copied
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    copy
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.pre
              key={active.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="overflow-x-auto whitespace-pre-wrap px-4 py-4 font-mono text-[13px] leading-7 text-text-primary"
            >
              <code>
                curl -X POST \{"\n"}
                {"  "}
                <span className="text-text-accent">{active.endpoint}</span> \
                {"\n"}
                {active.headers.map((header, i) => (
                  <span key={i}>
                    {"  "}-H{" "}
                    <span className="text-text-secondary">{header}</span> \
                    {"\n"}
                  </span>
                ))}
                {"  "}-d{" "}
                <span className="text-text-secondary">{active.body}</span>
              </code>
            </motion.pre>
          </AnimatePresence>

          <div className="flex items-center justify-between border-t border-success-border bg-success-bg px-4 py-2.5">
            <span className="font-mono text-xs text-success">200 OK</span>
            <span className="text-xs text-success">captured in 43ms</span>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-text-muted">
        Works with any service that sends a webhook — not just the six above.
      </p>
    </section>
  );
}
