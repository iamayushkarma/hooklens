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
    answer: "Yes. Discounts apply automatically across all your titles.",
  },
  {
    id: "multiple",
    question: "What if I have multiple games?",
    answer:
      "Every game you add pools into the same volume discount — no separate contracts.",
  },
  {
    id: "fees",
    question: "Are there hidden fees?",
    answer: "No. What's on your invoice is what you pay, every month.",
  },
  {
    id: "setup",
    question: "How long does setup take?",
    answer: "Most teams are integrated and live within a day.",
  },
  {
    id: "dau",
    question: "Can I start below 10k DAU?",
    answer:
      "Yes. There's no minimum to get started — pricing scales as you grow.",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<string>(faqs[0].id);

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? "" : id));
  };

  return (
    <section className="bg-[#F7F6F1] font-sans antialiased">
      <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-[1fr_560px] gap-x-16 gap-y-10 items-start">
        <h2 className="text-[2.75rem] leading-none font-bold tracking-tight text-[#3A0D06] pt-1">
          FAQ<span className="italic font-serif font-normal">s</span>
        </h2>

        <div className="w-full bg-white border border-[#E7E4DC] rounded-lg overflow-hidden">
          {faqs.map((faq, i) => {
            const isOpen = faq.id === openId;
            return (
              <div
                key={faq.id}
                className={i !== 0 ? "border-t border-[#E7E4DC]" : ""}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-start justify-between gap-6 px-7 py-5 text-left"
                >
                  <span className="text-[17px] font-semibold text-[#1A1A1A]">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="shrink-0 mt-0.5 text-[#1A1A1A]"
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
                      <p className="px-7 pb-5 text-[15px] leading-relaxed text-[#8B8B85] max-w-md">
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
