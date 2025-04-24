"use client";

import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ScrollEffect } from "@/lib/animations";
import { api } from "@/utils/api";

// Define the FAQ interface
interface FAQ {
  _id: string;
  question: string;
  answer: string;
  active: boolean;
  order: number;
}

const FaqSection = () => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch FAQs from the API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await api.get("/faqs");
        // Filter active FAQs and sort by order
        const activeFaqs = response.data
          .filter((faq: FAQ) => faq.active)
          .sort((a: FAQ, b: FAQ) => a.order - b.order);
        setFaqs(activeFaqs);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleAccordion = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  // Animation variants
  const contentVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.33, 1, 0.68, 1],
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  };

  // Icon animation variants
  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  };

  // Render loading state
  if (loading) {
    return (
      <section id="faqs" className="py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-semibold">{t("faqs.title")}</h2>
            <p className="mt-4 text-[var(--paragraph)]">{t("faqs.subtitle")}</p>
          </div>
          <div className="flex h-40 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-[var(--link-color)]"></div>
          </div>
        </div>
      </section>
    );
  }

  // Render error state
  if (error) {
    return (
      <section id="faqs" className="py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-semibold">{t("faqs.title")}</h2>
            <p className="mt-4 text-[var(--paragraph)]">{t("faqs.subtitle")}</p>
          </div>
          <div className="mx-auto max-w-3xl text-center text-red-500">
            {error}
          </div>
        </div>
      </section>
    );
  }

  // Render empty state
  if (faqs.length === 0) {
    return (
      <section id="faqs" className="py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-semibold">{t("faqs.title")}</h2>
            <p className="mt-4 text-[var(--paragraph)]">{t("faqs.subtitle")}</p>
          </div>
          <div className="mx-auto max-w-3xl text-center text-[var(--paragraph)]">
            {t("faqs.noFaqs", "No FAQs available at the moment.")}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="faqs" className="py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-semibold"
          >
            {t("faqs.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-[var(--paragraph)]"
          >
            {t("faqs.subtitle")}
          </motion.p>
        </div>

        <ScrollEffect type="fadeIn">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-3xl overflow-hidden rounded-xl bg-[var(--card-background)]"
          >
            {faqs.map((faq, index) => (
              <div key={faq._id} role="region">
                <h3>
                  <button
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={activeId === index}
                    className="flex w-full items-center justify-between px-6 py-4 text-left text-[var(--headline)] transition-colors hover:bg-[var(--card-background)]"
                  >
                    <span className="font-medium">{faq.question}</span>
                    <motion.span
                      variants={iconVariants}
                      animate={activeId === index ? "open" : "closed"}
                      transition={{ duration: 0.3 }}
                      className="ml-4 flex items-center justify-center"
                    >
                      {activeId === index ? (
                        <Minus className="h-5 w-5 text-[var(--headline)]" />
                      ) : (
                        <Plus className="h-5 w-5 text-[var(--headline)]" />
                      )}
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {activeId === index && (
                    <motion.div
                      key={`content-${faq._id}`}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={contentVariants}
                    >
                      <div className="px-6 pb-4">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="text-[var(--paragraph)]"
                        >
                          {faq.answer}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </ScrollEffect>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex justify-center"
        >
          <Link
            to="/contact"
            className="inline-flex items-center font-medium text-[var(--link-color)] hover:opacity-80"
          >
            {t("faqs.moreQuestions")}
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
