import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { annotate } from "rough-notation";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Banner() {
  const { t, i18n } = useTranslation();
  const highlightedWordRef = useRef<HTMLSpanElement>(null);

  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (highlightedWordRef.current) {
      const annotation = annotate(highlightedWordRef.current, {
        type: "underline",
        color: "blue",
        padding: 0,
        strokeWidth: 3,
      });
      annotation.show();
    }
  }, []);

  const title = t("banner.title");
  const words = title.split(" ");

  const isEnglish = i18n.language === "en" || i18n.language.startsWith("en-");
  const isFrench = i18n.language === "fr" || i18n.language.startsWith("fr-");
  const isArabic = i18n.language === "ar" || i18n.language.startsWith("ar-");

  let highlightedWord;
  let restOfTitle;

  if (isEnglish) {
    highlightedWord = words[0];
    restOfTitle = words.slice(1).join(" ");
  } else if (isFrench || isArabic) {
    highlightedWord = words.pop()!;
    restOfTitle = words.join(" ");
  }

  return (
    <section className="m-auto mb-14 max-w-4xl text-center lg:max-w-full">
      <section className="overflow-hidden">
        <div className="relative mx-auto max-w-5xl px-6 max-md:px-0">
          <div className="relative z-10 mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center gap-6 text-center max-md:gap-0 lg:max-w-full">
            <h1 className="relative text-balance text-3xl font-semibold max-md:w-full max-md:px-0 md:text-5xl lg:text-6xl">
              <span
                className="relative inline-block pb-2 pt-2 text-[var(--headline)]"
                ref={highlightedWordRef}
              >
                {highlightedWord}
              </span>{" "}
              {restOfTitle}
            </h1>
            <p className="text-body mx-auto max-w-2xl text-xl text-[var(--paragraph)] max-md:mt-2 max-md:text-base">
              {t("banner.description")}
            </p>

            {isAuthenticated && (
              <Link className="max-md:mt-5 max-md:w-max" to="/dashboard">
                <Button className="max-md:w-max">
                  Go to dashboard
                  <span>
                    <ArrowRight className="flex h-4 w-4 items-center justify-center gap-0" />
                  </span>
                </Button>
              </Link>
            )}

            {!isAuthenticated && (
              <Link className="max-md:mt-5 max-md:w-max" to="/login">
                <Button className="max-md:w-max">
                  {t("banner.getStarted")}
                  <span>
                    <ArrowRight className="flex h-4 w-4 items-center justify-center gap-0" />
                  </span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}
