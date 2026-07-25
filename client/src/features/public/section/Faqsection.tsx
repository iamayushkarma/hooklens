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
    id: "volume",
    question: "Do you offer volume discounts?",
    answer:
      "Yes. Discounts apply automatically across all your titles — you don't need to ask for them or negotiate per game. As your combined DAU crosses each tier, your rate drops on the next invoice, and every title you run counts toward the total.",
  },
  {
    id: "multiple",
    question: "What if I have multiple games?",
    answer:
      "Every game you add pools into the same volume discount — no separate contracts, no separate dashboards. Add a new title from your account in a couple of clicks and it starts contributing to your tier immediately.",
  },
  {
    id: "fees",
    question: "Are there hidden fees?",
    answer:
      "No. What's on your invoice is what you pay, every month. No setup fees, no per-seat charges, no surprise line items for support or integrations. If a price ever changes, we tell you at least 30 days before it takes effect.",
  },
  {
    id: "setup",
    question: "How long does setup take?",
    answer:
      "Most teams are integrated and live within a day. Drop in the SDK, verify events are flowing in the dashboard, and you're done — there's no approval queue or onboarding call required to get started.",
  },
  {
    id: "dau",
    question: "Can I start below 10k DAU?",
    answer:
      "Yes. There's no minimum to get started — pricing scales as you grow, so you're never paying for headroom you don't need yet. Plenty of teams start on their very first build and scale up from there.",
  },
  {
    id: "cancel",
    question: "Can I cancel anytime?",
    answer:
      "Yes, there's no lock-in. Cancel from your account settings whenever you like and you'll keep access through the end of your current billing period — no cancellation fee, no exit call required.",
  },
  {
    id: "support",
    question: "What kind of support do I get?",
    answer:
      "Every plan includes email support with same-day responses on business days. Larger teams also get a shared Slack channel with our engineers, so integration questions get answered in minutes instead of ticket queues.",
  },
  {
    id: "data",
    question: "Who owns the data?",
    answer:
      "You do, fully. We never sell or share your data with third parties, and you can export everything — raw events, aggregates, and reports — at any time from the dashboard or the API.",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<string>(faqs[0].id);

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? "" : id));
  };

  return (
    <section className="bg-bg-base font-sans antialiased">
      <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-[1fr_560px] gap-x-16 gap-y-10 items-start">
        <h2 className="text-[4rem] leading-none font-extrabold tracking-tight text-text-primary pt-1">
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
                  className="w-full flex items-start justify-between gap-6 px-7 py-5 text-left cursor-pointer hover:bg-base-hover transition-colors"
                >
                  <span className="text-[17px] font-semibold text-text-primary">
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
                      <p className="px-7 pb-5 text-[15px] leading-relaxed text-text-secondary">
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
