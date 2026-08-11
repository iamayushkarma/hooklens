import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/Button";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LayoutGroup, motion } from "motion/react";

function Section({
  id,
  eyebrow,
  title,
  children,
  registerRef,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  registerRef: (id: string, el: HTMLElement | null) => void;
}) {
  return (
    <motion.section
      id={id}
      ref={(el: HTMLElement | null) => registerRef(id, el)}
      className="scroll-mt-28 pt-16 first:pt-0"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="text-xs tracking-[0.15em] font-semibold text-accent uppercase">
        {eyebrow}
      </span>
      <h2 className="text-2xl md:text-[1.75rem] font-semibold mt-2 tracking-tight text-text-primary">
        {title}
      </h2>
      <div className="mt-4 text-text-secondary font-normal leading-relaxed [&>p+p]:mt-3">
        {children}
      </div>
    </motion.section>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-bg-base text-[.85em] font-mono font-medium text-text-primary">
      {children}
    </code>
  );
}

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "data-we-collect", label: "Data we collect" },
  { id: "webhook-payloads", label: "Webhook payloads" },
  { id: "how-we-use-it", label: "How we use it" },
  { id: "retention", label: "Retention" },
  { id: "third-parties", label: "Third parties" },
  { id: "security", label: "Security" },
  { id: "your-rights", label: "Your rights" },
  { id: "contact", label: "Contact" },
];

const DATA_FIELDS: [string, string][] = [
  ["name, email", "Collected at sign-up to create your account."],
  [
    "passwordHash",
    "Bcrypt-hashed, salt rounds 12. We never store or transmit your raw password.",
  ],
  [
    "workspace / project data",
    "Names and descriptions you create for organizing endpoints.",
  ],
  [
    "JWT session token",
    "Stored in your browser and sent as a Bearer token on each request. Not a tracking cookie.",
  ],
];

const PAYLOAD_FIELDS: [string, string][] = [
  ["method, headers, body", "Captured exactly as sent to your endpoint's URL."],
  ["query params", "Parsed from the request URL."],
  [
    "ip, user agent",
    "Of whoever sent the request to your endpoint — this may or may not be you.",
  ],
  [
    "endpoint secret",
    "Optional, used only to verify provider signatures. Never sent to third parties.",
  ],
];

function PrivacyPolicyPage() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState("overview");
  const [scrolled, setScrolled] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const suppressScrollSpy = useRef(false);
  const suppressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const registerRef = (id: string, el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const ACTIVATION_LINE = 140;
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (suppressScrollSpy.current) return;
      let current = NAV[0].id;
      for (const item of NAV) {
        const el = sectionRefs.current[item.id];
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - ACTIVATION_LINE <= 0) current = item.id;
        else break;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jumpTo = (id: string) => {
    setActiveId(id);
    suppressScrollSpy.current = true;
    if (suppressTimeout.current) clearTimeout(suppressTimeout.current);
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    suppressTimeout.current = setTimeout(() => {
      suppressScrollSpy.current = false;
    }, 700);
  };

  return (
    <div className="w-full bg-bg-base min-h-screen">
      <header
        className={`sticky top-0 z-30 bg-bg-base/80 backdrop-blur-md transition-shadow duration-300 ${
          scrolled
            ? "border-b border-border-subtle"
            : "border-b border-transparent"
        }`}
      >
        <div className="w-[92%] max-w-5xl mx-auto h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 select-none">
            <span className="font-semibold tracking-tight">HookLens</span>
            <span className="text-xs text-text-secondary border border-border-subtle rounded-full px-2 py-0.5">
              Legal
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <Link
              to="/"
              className="hidden sm:block text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Home
            </Link>
            <Button
              onClick={() => navigate("/register")}
              className="bg-gray-950 hover:bg-gray-900 h-8 px-3 text-sm flex items-center gap-1.5 select-none"
            >
              Get started <ArrowUpRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="w-[92%] max-w-5xl mx-auto pt-16 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <span className="text-xs tracking-[0.15em] font-semibold text-text-secondary uppercase">
            Legal
          </span>
          <h1 className="text-4xl md:text-[2.75rem] font-bold tracking-tight mt-3 leading-[1.1] text-text-primary">
            Privacy policy
          </h1>
          <p className="text-text-secondary font-normal mt-4 text-base leading-relaxed">
            HookLens exists to capture and replay HTTP requests you send to your
            own endpoints. This page explains exactly what we store, for how
            long, and who else — if anyone — ever sees it.
          </p>
          <p className="text-text-muted text-sm mt-3">
            Last updated: August 11, 2026
          </p>
        </motion.div>
      </div>
      <div className="w-[92%] max-w-5xl mx-auto border-t border-border-subtle" />

      <div className="w-[92%] max-w-5xl mx-auto py-12 flex gap-16 items-start">
        <aside className="hidden md:block w-48 shrink-0 sticky top-24 self-start">
          <span className="text-xs tracking-[0.15em] font-medium text-text-secondary uppercase">
            On this page
          </span>
          <LayoutGroup id="toc-nav">
            <nav
              className="mt-4 flex flex-col gap-0.5"
              onMouseLeave={() => setHoveredId(null)}
            >
              {NAV.map((item) => {
                const isActive = activeId === item.id;
                const isHovered = hoveredId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => jumpTo(item.id)}
                    onMouseEnter={() => setHoveredId(item.id)}
                    className="relative text-left rounded-md cursor-pointer"
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-md bg-white border border-border-subtle z-10" />
                    )}
                    {!isActive && isHovered && (
                      <motion.div
                        layoutId="toc-hover-pill"
                        className="absolute inset-0 rounded-md bg-black/[0.05]"
                        transition={{
                          type: "spring",
                          stiffness: 700,
                          damping: 35,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-20 block text-sm py-1.5 px-3 rounded-md transition-colors duration-150 ${
                        isActive
                          ? "text-text-primary font-semibold"
                          : "text-text-secondary font-normal hover:text-text-primary"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </LayoutGroup>
        </aside>

        <div className="flex-1 min-w-0 max-w-2xl">
          <Section
            id="overview"
            eyebrow="Overview"
            title="What this policy covers"
            registerRef={registerRef}
          >
            <p>
              HookLens gives you a disposable URL that captures whatever HTTP
              requests are sent to it, so you can inspect and replay them. That
              means two kinds of data pass through the product: the account data
              you give us directly, and the request data your endpoints receive
              from wherever you point them — Stripe, GitHub, your own scripts,
              anything.
            </p>
            <p>
              We only collect what's needed to run those two things. There's no
              ad network, no analytics pixel, and no data sold to anyone.
            </p>
          </Section>

          <Section
            id="data-we-collect"
            eyebrow="Account data"
            title="What we collect when you sign up"
            registerRef={registerRef}
          >
            <div className="mt-2 flex flex-col">
              {DATA_FIELDS.map(([field, note], i) => (
                <div
                  key={field}
                  className={`flex justify-between gap-4 py-2.5 text-sm ${i > 0 ? "border-t border-border-subtle" : ""}`}
                >
                  <Code>{field}</Code>
                  <span className="text-text-secondary font-normal text-right">
                    {note}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="webhook-payloads"
            eyebrow="Webhook payloads"
            title="What we store for every captured request"
            registerRef={registerRef}
          >
            <p>
              Every request that hits an endpoint you create —{" "}
              <Code>/h/:slug</Code> — is stored exactly as it arrived, so you
              can debug it later.
            </p>
            <div className="mt-4 flex flex-col">
              {PAYLOAD_FIELDS.map(([field, note], i) => (
                <div
                  key={field}
                  className={`flex justify-between gap-4 py-2.5 text-sm ${i > 0 ? "border-t border-border-subtle" : ""}`}
                >
                  <Code>{field}</Code>
                  <span className="text-text-secondary font-normal text-right">
                    {note}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4">
              Because this data is whatever a third-party service sends to your
              endpoint, you're responsible for not pointing HookLens at a source
              that sends data you don't have the right to store — for example,
              real customer PII in a production integration.
            </p>
          </Section>

          <Section
            id="how-we-use-it"
            eyebrow="How we use it"
            title="Data is used to run the product, not to profile you"
            registerRef={registerRef}
          >
            <p>
              Account data authenticates you and scopes your workspaces.
              Captured request data is shown back to you in your dashboard,
              pushed to you live over your endpoint's socket channel, and used
              for the replay engine when you choose to re-fire a request.
              Nothing is used for advertising, and nothing is shared with data
              brokers.
            </p>
          </Section>

          <Section
            id="retention"
            eyebrow="Retention"
            title="Requests delete themselves automatically"
            registerRef={registerRef}
          >
            <p>
              Captured requests expire on a MongoDB TTL index,{" "}
              <Code>7 days</Code> by default, enforced at the database level
              rather than a cron job that could silently fail. You can configure
              a shorter or longer retention window per endpoint. Account data
              persists until you delete your account, at which point your
              workspaces, projects, endpoints, and any remaining request logs
              are deleted with it.
            </p>
          </Section>

          <Section
            id="third-parties"
            eyebrow="Third parties"
            title="Who else touches your data"
            registerRef={registerRef}
          >
            <p>
              We use a small number of infrastructure providers to run HookLens,
              and none of them use your data for their own purposes:
            </p>
            <div className="mt-4 flex flex-col">
              {[
                [
                  "MongoDB Atlas",
                  "Stores account, workspace, and request-log data.",
                ],
                [
                  "Render / Vercel",
                  "Hosts the backend API and frontend application.",
                ],
                [
                  "Groq",
                  "Only when you click \"Explain with AI\" on a specific request — that request's method, headers, and body are sent to Groq's API to generate a plain-English summary. This never runs automatically.",
                ],
              ].map(([name, note], i) => (
                <div
                  key={name}
                  className={`flex justify-between gap-4 py-2.5 text-sm ${i > 0 ? "border-t border-border-subtle" : ""}`}
                >
                  <span className="font-semibold text-text-primary shrink-0">
                    {name}
                  </span>
                  <span className="text-text-secondary font-normal text-right">
                    {note}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="security"
            eyebrow="Security"
            title="How your data is protected"
            registerRef={registerRef}
          >
            <p>
              Passwords are hashed with bcrypt and never stored or returned in
              plain text. Sessions use signed JWTs sent as a <Code>Bearer</Code>{" "}
              token, not a persistent tracking cookie. API inputs are validated
              with Zod, security headers are set with Helmet, and auth routes
              are rate-limited. Your capture endpoint's public route always
              responds immediately, so it never leaks timing information about
              what's behind it. If you set a secret on an endpoint, incoming
              signatures are checked against it so spoofed requests are easy to
              catch.
            </p>
          </Section>

          <Section
            id="your-rights"
            eyebrow="Your rights"
            title="Access, export, and deletion"
            registerRef={registerRef}
          >
            <p>
              You can view, replay, or delete any captured request from your
              dashboard at any time. You can delete an endpoint, a project, or
              your entire account, which removes the associated data. If you'd
              like a copy of your account data or have a question about what we
              hold, reach out using the contact details below.
            </p>
          </Section>

          <Section
            id="contact"
            eyebrow="Contact"
            title="Questions about this policy"
            registerRef={registerRef}
          >
            <p>
              {/* TODO: replace with your real support/legal email and entity name */}
              Email us at <Code>privacy@hooklens.app</Code> and we'll get back
              to you. If HookLens is operated by a registered entity, its name
              and address should be listed here.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
