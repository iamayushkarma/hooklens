import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/Button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LayoutGroup, motion, AnimatePresence } from "motion/react";

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

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-border-subtle rounded-xl p-5 bg-white transition-colors hover:border-accent/40">
      <h3 className="font-semibold text-[.95rem] text-text-primary">{title}</h3>
      <p className="text-sm text-text-secondary font-normal mt-1.5 leading-relaxed">
        {body}
      </p>
    </div>
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
  { id: "architecture", label: "Architecture" },
  { id: "live-capture", label: "Live capture" },
  { id: "inspecting", label: "Inspecting a request" },
  { id: "replay", label: "Replay engine" },
  { id: "ai", label: "AI explanations" },
  { id: "teams", label: "Teams & roles" },
  { id: "retention", label: "Retention" },
  { id: "api", label: "API surface" },
  { id: "faq", label: "FAQ" },
];

const OVERVIEW_CARDS = [
  {
    title: "Full request anatomy",
    body: "Headers, raw body, parsed JSON, query params, IP, user agent, and byte size — nothing summarized away.",
  },
  {
    title: "Live, no refresh",
    body: "Requests reach your dashboard over a socket the instant they're captured — you never poll for them.",
  },
  {
    title: "Replay with a diff",
    body: "Re-fire any request at a new URL and get back status, headers, body, and latency as its own record.",
  },
  {
    title: "One-click explanation",
    body: "Ask an LLM what a payload means and get the sender, event type, and key fields in plain English.",
  },
];

const REQUEST_FIELDS: [string, string][] = [
  ["method", "GET / POST / PUT / PATCH / DELETE"],
  ["headers", "Full header map, unfiltered"],
  ["rawBody", "Preserved byte-for-byte, before parsing"],
  ["parsedBody", "JSON-parsed version, when possible"],
  ["query", "Parsed query-string params"],
  ["ip / userAgent", "Sender IP and user agent"],
];

const ROLES: [string, string][] = [
  ["Owner", "Full control, including deleting the workspace."],
  ["Admin", "Manage projects, endpoints, and members."],
  ["Member", "Create endpoints, inspect and replay requests."],
  ["Viewer", "Read-only access to the live feed and detail view."],
];

const METHOD_STYLES: Record<string, string> = {
  GET: "bg-blue-50 text-blue-600",
  POST: "bg-emerald-50 text-emerald-600",
  PUT: "bg-amber-50 text-amber-600",
  PATCH: "bg-violet-50 text-violet-600",
  DELETE: "bg-red-50 text-red-600",
};

const API_ROUTES: [string, string, string][] = [
  [
    "POST",
    "/h/:slug",
    "Public capture route — no auth, always returns 200 immediately.",
  ],
  [
    "GET",
    "/api/endpoints/:id/requests",
    "Paginated request log for one endpoint.",
  ],
  [
    "POST",
    "/api/requests/:id/replay",
    "Re-fires a captured request at a target URL.",
  ],
];

const FAQS = [
  {
    q: "How long is request data stored?",
    a: "7 days by default, enforced by a MongoDB TTL index on each request's timestamp — not a cron job, so nothing lingers if a cleanup task fails. You can set a different retention window per endpoint.",
  },
  {
    q: "Is the capture endpoint authenticated?",
    a: "No — /h/:slug is intentionally public, the same way real webhook receivers work. It also always responds 200 immediately, so it never leaks timing information. Every other route requires a valid token.",
  },
  {
    q: "Can I verify a webhook really came from Stripe or GitHub?",
    a: "Yes. Give an endpoint a secret and HookLens checks the provider's signature header against the exact bytes it received, so spoofed or malformed requests are easy to spot.",
  },
  {
    q: "Can I replay a request more than once?",
    a: "Yes — every replay is logged separately with its own status, body, and latency, so you can compare several attempts against the same original request.",
  },
];

function FaqItem({
  q,
  a,
  isOpen,
  onToggle,
  showDivider,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
  showDivider: boolean;
}) {
  return (
    <div className={showDivider ? "border-t border-border-subtle" : ""}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="font-semibold text-[.95rem] text-text-primary">
          {q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-text-secondary text-xl leading-none shrink-0 ml-4"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-text-secondary pb-4 leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LearnMorePage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
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
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
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
        if (top - ACTIVATION_LINE <= 0) {
          current = item.id;
        } else {
          break;
        }
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
              Docs
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
            Documentation
          </span>
          <h1 className="text-4xl md:text-[2.75rem] font-bold tracking-tight mt-3 leading-[1.1] text-text-primary">
            How HookLens works
          </h1>
          <p className="text-text-secondary font-normal mt-4 text-base leading-relaxed">
            A unique URL, a live dashboard, and a replay button for every
            request that ever hits it — this page covers the capture pipeline,
            the replay engine, and everything in between.
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
                    className="relative text-left rounded-md"
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-md bg-white border border-border-subtle shadow-sm z-10" />
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
            title="What HookLens actually is"
            registerRef={registerRef}
          >
            <p>
              Stripe, GitHub, Razorpay, Twilio, Slack, and SendGrid all talk to
              your app the same way: they fire an HTTP request at a URL. When
              something breaks, you're debugging a conversation you never got to
              see. HookLens gives you a disposable endpoint, shows you every
              request the moment it lands, and lets you re-fire it wherever you
              need to.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {OVERVIEW_CARDS.map((c) => (
                <InfoCard key={c.title} title={c.title} body={c.body} />
              ))}
            </div>
          </Section>

          <Section
            id="architecture"
            eyebrow="Architecture"
            title="One hierarchy, one public route"
            registerRef={registerRef}
          >
            <p>
              Everything nests under a single chain:{" "}
              <Code>
                User → Workspace → Project → Endpoint → Request Log → Replay Job
              </Code>
              . A workspace is created automatically on sign-up, and projects
              group related endpoints — e.g. "Stripe Integration" or "GitHub
              Automation."
            </p>
            <p>
              <Code>/h/:slug</Code> is the only route in the app that skips
              authentication, on purpose — it mirrors how real webhook senders
              behave. Everything past that, from viewing a request to changing a
              role, requires a signed-in session.
            </p>
          </Section>

          <Section
            id="live-capture"
            eyebrow="Live capture"
            title="Requests appear the instant they arrive"
            registerRef={registerRef}
          >
            <p>
              Every endpoint gets a unique URL the moment it's created, e.g.{" "}
              <Code>hooklens.app/h/abc123xyz</Code>. As soon as a request hits
              it, it's written to the log and pushed over a socket scoped to
              that endpoint — your dashboard updates with no polling and no
              refresh.
            </p>
          </Section>

          <Section
            id="inspecting"
            eyebrow="Inspecting a request"
            title="Nothing summarized away"
            registerRef={registerRef}
          >
            <p>
              Open any request to see it exactly as it arrived. Each one is
              stored with:
            </p>
            <div className="mt-4 flex flex-col">
              {REQUEST_FIELDS.map(([field, note], i) => (
                <div
                  key={field}
                  className={`flex justify-between gap-4 py-2.5 text-sm ${
                    i > 0 ? "border-t border-border-subtle" : ""
                  }`}
                >
                  <Code>{field}</Code>
                  <span className="text-text-secondary font-normal text-right">
                    {note}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4">
              If an endpoint has a secret set, HookLens also checks the
              provider's signature header against the exact bytes received, so
              spoofed or malformed payloads are easy to spot.
            </p>
          </Section>

          <Section
            id="replay"
            eyebrow="Replay engine"
            title="Re-fire any request, keep the receipt"
            registerRef={registerRef}
          >
            <p>
              Pick a captured request and send it again — to localhost, staging,
              wherever. HookLens re-issues the same method, headers, and body,
              then records the response status, headers, body, and latency as
              its own entry, separate from the original request.
            </p>
            <p>
              Because every replay is logged individually, you can fire the same
              request several times and compare the responses side by side
              instead of trusting your memory.
            </p>
          </Section>

          <Section
            id="ai"
            eyebrow="AI explanations"
            title="Plain English, on demand"
            registerRef={registerRef}
          >
            <p>
              The "Explain" button sends a request's method, headers, and body
              to an LLM and gets back a short read on which service likely sent
              it, what event it represents, and what the key fields mean —
              useful when you're staring at an unfamiliar payload at 2am. It
              only runs when you ask for it, never automatically.
            </p>
          </Section>

          <Section
            id="teams"
            eyebrow="Teams & roles"
            title="Shared logs, scoped permissions"
            registerRef={registerRef}
          >
            <p>
              Invite teammates into a workspace with a role. Everyone with
              access sees the same live feed for that workspace's endpoints.
            </p>
            <div className="mt-4 flex flex-col">
              {ROLES.map(([role, desc], i) => (
                <div
                  key={role}
                  className={`flex gap-4 py-2.5 text-sm ${
                    i > 0 ? "border-t border-border-subtle" : ""
                  }`}
                >
                  <span className="font-semibold text-text-primary w-16 shrink-0">
                    {role}
                  </span>
                  <span className="text-text-secondary font-normal">
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="retention"
            eyebrow="Retention"
            title="Old requests clean themselves up"
            registerRef={registerRef}
          >
            <p>
              Requests expire automatically on a TTL index — <Code>7 days</Code>{" "}
              by default — rather than a scheduled job, so cleanup can't
              silently fail. You can set a longer or shorter window per endpoint
              if you need requests to stick around, or disappear sooner.
            </p>
          </Section>

          <Section
            id="api"
            eyebrow="API surface"
            title="A few routes you'll actually use"
            registerRef={registerRef}
          >
            <div className="flex flex-col">
              {API_ROUTES.map(([method, path, note], i) => (
                <div
                  key={path}
                  className={`py-3 ${i > 0 ? "border-t border-border-subtle" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold font-mono px-1.5 py-0.5 rounded ${
                        METHOD_STYLES[method] ?? "bg-accent-subtle text-accent"
                      }`}
                    >
                      {method}
                    </span>
                    <Code>{path}</Code>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">{note}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="faq"
            eyebrow="FAQ"
            title="Good to know"
            registerRef={registerRef}
          >
            <div className="flex flex-col -mt-2">
              {FAQS.map((f, i) => (
                <FaqItem
                  key={f.q}
                  q={f.q}
                  a={f.a}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  showDivider={i > 0}
                />
              ))}
            </div>
          </Section>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 border border-border-subtle rounded-xl p-8 text-center bg-white"
          >
            <h2 className="text-lg font-semibold tracking-tight">
              Stop guessing what the webhook sent.
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Get a live endpoint in under a minute. No credit card, no setup.
            </p>
            <div className="flex md:flex-row flex-col gap-3 mt-5 justify-center">
              <Button
                onClick={() => navigate("/register")}
                className="bg-gray-950 hover:bg-gray-900 w-full md:w-fit flex items-center justify-center gap-2 select-none"
              >
                Start capturing requests <ArrowRight className="size-4" />
              </Button>
              <Button
                onClick={() => navigate("/")}
                className="bg-white border border-border-subtle text-text-primary hover:bg-bg-base w-full md:w-fit flex items-center justify-center select-none"
              >
                Back to site
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LearnMorePage;
