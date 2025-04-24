import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { MagicCard } from "../ui/magic-card";
import { ArrowRight } from "lucide-react";
import { scrollToTop } from "@/helper";
import { ScrollEffect } from "@/lib/animations";

export default function CallToAction() {
  const { t } = useTranslation();

  return (
    <section className="section">
      <MagicCard
        gradientColor={"var(--magic-card)"}
        className="relative mx-auto max-w-5xl rounded-[2rem] border px-6 py-16"
        ref={undefined}
      >
        {/* <BackgroundEffect /> */}

        <div className="z-50 flex flex-col gap-3 text-center">
          <ScrollEffect type="fadeIn">
            <h2 className="text-title text-balance text-4xl font-semibold lg:text-5xl">
              {t("cta.startTaxJourney")}
            </h2>
          </ScrollEffect>
          <ScrollEffect type="fadeIn">
            <p className="text-body mx-auto max-w-[70%]">
              {t("cta.description")}
            </p>
          </ScrollEffect>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button onClick={scrollToTop} icon={<ArrowRight />}>
                {t("cta.getStarted")}
              </Button>
            </Link>
          </div>
        </div>
      </MagicCard>
    </section>
  );
}
