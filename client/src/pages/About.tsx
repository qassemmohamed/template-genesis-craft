"use client";

import i18n from "@/i18n";
import { ScrollEffect } from "@/lib/animations";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { annotate } from "rough-notation";
import tax1 from "@/assets/tax1.svg";

export default function About() {
  const { t } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const highlightedWordsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (highlightedWordsRef.current) {
      const annotation = annotate(highlightedWordsRef.current, {
        type: "underline",
        color: "blue",
        padding: 0,
        strokeWidth: 1,
      });
      annotation.show();
    }
  }, []);

  const description = t("about.description1");
  const words = description.split(" ");

  // Get first two words for any language
  const firstTwoWords = words.slice(0, 2).join(" ");

  // Get the rest of the text (everything after the first two words)
  const restOfText = description.substring(firstTwoWords.length);

  return (
    <section
      dir={direction}
      id="about"
      className="container overflow-hidden py-32"
    >
      <div className="mx-auto w-full space-y-8">
        <ScrollEffect type="fadeUp">
          <h2 className="text-title relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
            {t("about.title")}
          </h2>
        </ScrollEffect>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative mb-6 sm:mb-0">
            <div className="absolute -inset-20 bg-[linear-gradient(to_right,var(--ui-border-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--ui-border-color)_1px,transparent_1px)] bg-[size:24px_24px] sm:-inset-40"></div>
            <div className="bg-gray-9-0 absolute -inset-20"></div>
            <div className="absolute -inset-20"></div>

            <div className="tls-shadow-md rounded-card relative overflow-hidden shadow-gray-950/[0.03]">
              <img
                className="relative hidden grayscale dark:block"
                src={tax1 || "/placeholder.svg"}
                alt=""
              />
            </div>
          </div>
          <ScrollEffect type="fadeUp">
            <div className="relative space-y-4 text-[var(--paragraph)]">
              <p className="annotate relative text-[var(--paragraph)]">
                <span
                  className="text-[var(--paragrph)]"
                  ref={highlightedWordsRef}
                >
                  {firstTwoWords}
                </span>
                {restOfText}
              </p>
              <p className="text-body">{t("about.description2")}</p>
              <div className="pt-6">
                <blockquote className="text-blockquote">
                  {/* <div className="mt-6 space-y-3">
                    <cite className="text-title font-medium">John Doe, CEO</cite>
                    <img
                      className="h-5 w-fit dark:invert"
                      src="/blocks/customers/nvidia.svg"
                      alt="Nvidia Logo"
                      height="20"
                      width="auto"
                    />
                  </div> */}
                </blockquote>
              </div>
            </div>
          </ScrollEffect>
        </div>
      </div>
    </section>
  );
}
