import { EyeOff, Terminal, Bug, Wrench, Clock, Users } from "lucide-react";

const items = [
  {
    id: "visibility",
    icon: EyeOff,
    title: "No payload visibility",
    body: "Headers and body vanish the moment a request hits your server.",
  },
  {
    id: "local",
    icon: Terminal,
    title: "Can't reproduce locally",
    body: "ngrok tunnels, copy-pasted curl commands, every single time.",
  },
  {
    id: "signature",
    icon: Bug,
    title: "Signature errors, silently",
    body: "No easy way to verify what the sender actually signed.",
  },
  {
    id: "tools",
    icon: Wrench,
    title: "Four tools, one bug",
    body: "Terminal, Postman, browser devtools, and a prayer.",
  },
  {
    id: "expiry",
    icon: Clock,
    title: "Logs disappear too fast",
    body: "By the time you notice a bug, the request is long gone.",
  },
  {
    id: "solo",
    icon: Users,
    title: "Nobody else sees it",
    body: "Debugging alone in a terminal instead of with your team.",
  },
];

function ProblemCard({ item }: { item: (typeof items)[number] }) {
  const Icon = item.icon;
  return (
    <div className="rounded-xl border border-border-default bg-bg-card p-5 shadow-sm">
      <Icon size={20} strokeWidth={1.75} className="mb-4 text-text-secondary" />
      <h3 className="m-0 mb-1.5 text-[15px] font-semibold text-text-primary">
        {item.title}
      </h3>
      <p className="m-0 text-[13px] leading-relaxed text-text-secondary">
        {item.body}
      </p>
    </div>
  );
}

export default function ProblemWeSolve() {
  return (
    <section className="bg-bg-base px-5 py-20 md:py-28">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="m-0 mb-3 text-[34px] font-bold leading-tight text-text-primary md:text-[42px]">
          Webhooks are a black box until something breaks
        </h2>
        <p className="m-0 text-[15px] text-text-secondary">
          Stripe, GitHub, Twilio — they all fire events at you blind. Here's
          what that actually costs.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item) => (
          <ProblemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
