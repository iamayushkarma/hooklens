import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: "how-it-works",
    question: "How does HookLens actually work?",
    answer:
      "You create an endpoint and get a unique URL. Point any webhook Stripe, GitHub, your own backend, anything at that URL, and every request that hits it is captured, sanitized, and logged instantly. You can inspect headers, body, and query params in real time from your dashboard.",
  },
  {
    id: "replay",
    question: "Can I replay a captured request?",
    answer:
      "Yes. Any request you've captured can be replayed against a different target URL with one click same method, headers, and body. This is useful for testing how your local server or a staging environment handles a real payload without waiting for the original event to fire again.",
  },
  {
    id: "disabled-endpoint",
    question: "What happens if I disable an endpoint?",
    answer:
      "Incoming requests to a disabled endpoint are silently dropped the sender still gets a 200 OK, so you won't trigger retries or failure alerts on their end, but nothing gets stored or shown in your dashboard until you reactivate it.",
  },
  {
    id: "ai-explain",
    question: "What does the AI payload explanation do?",
    answer:
      "For any captured request, you can ask HookLens to explain the payload in plain English what event it represents, what fields matter, and anything unusual about the structure. Handy when you're debugging a webhook from a provider you're not familiar with.",
  },
  {
    id: "projects-workspaces",
    question: "How are projects and workspaces organized?",
    answer:
      "A workspace is your team's home base invite members, manage roles, and see everything happening across your webhooks. Inside a workspace, you create projects to group related endpoints, so a checkout flow's webhooks stay separate from your CI notifications.",
  },
  {
    id: "team-roles",
    question: "Can I invite teammates and control their access?",
    answer:
      "Yes. Workspace owners and admins can invite members by email, assign roles, and remove access at any time. Only the owner can delete a workspace, and ownership must be transferred before an owner can delete their account.",
  },
  {
    id: "realtime",
    question: "Do I see requests live, or do I need to refresh?",
    answer:
      "Requests stream into your dashboard in real time over a socket connection the moment they're captured no polling or manual refresh needed. You'll see new requests, replays, and endpoint status changes as they happen.",
  },
  {
    id: "data-safety",
    question: "Is sensitive data in my webhooks safe?",
    answer:
      "Incoming headers, bodies, and query params are sanitized before they're ever stored, stripping common sensitive fields. You can delete any individual request permanently, and deleting an endpoint removes all of its logged requests along with it.",
  },
];
export default function FAQSection() {
  const [openId, setOpenId] = useState<string>("");

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? "" : id));
  };

  return (
    <section id="faq" className="bg-bg-base font-sans antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-24 grid grid-cols-1 lg:grid-cols-[1fr_560px] gap-x-16 gap-y-6 sm:gap-y-10 items-start">
        <h2 className="text-[2.75rem] sm:text-[3.25rem] lg:text-[4rem] leading-none font-extrabold tracking-tight text-text-primary pt-1">
          FAQ<span className="italic font-serif font-normal">s</span>
        </h2>

        <div className="w-full bg-bg-card border border-border-default rounded-lg overflow-hidden">
          {faqs.map((faq, i) => {
            const isOpen = faq.id === openId;
            return (
              <div
                key={faq.id}
                className={i !== 0 ? "border-t border-border-default" : ""}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-start justify-between gap-4 sm:gap-6 px-4 sm:px-7 py-4 sm:py-5 text-left cursor-pointer hover:bg-bg-sidebar/70 transition-colors"
                >
                  <span className="text-[15px] sm:text-[17px] font-semibold text-text-primary">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="shrink-0 mt-0.5 text-text-primary"
                  >
                    <Plus size={18} strokeWidth={2} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 sm:px-7 pb-4 sm:pb-5 mt-2 text-sm sm:text-[15px] leading-relaxed text-text-secondary">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
