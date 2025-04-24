import Navbar from "@/components/layouts/navbar/Navbar";
import { Button } from "@/components/ui/button";
import { RandomizedTextEffect } from "@/components/ui/text-randomized";
import { ArrowLeft } from "lucide-react";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type Props = object;

const Error404: FunctionComponent<Props> = () => {
  const { t } = useTranslation();

  return (
    <div className="h-full w-full bg-[var(--background)]">
      <div className="hidden">
        <Navbar />
      </div>

      <div className="container flex h-max min-h-[100vh] flex-col gap-6 max-md:w-full max-md:p-0">
        <div>
          <div className="grid h-screen place-content-center px-4 max-md:p-0">
            <div className="flex flex-col items-center justify-center gap-6 text-center max-md:w-full">
              <RandomizedTextEffect
                className="mt-6 text-2xl font-bold tracking-tight text-[var(--headline)] sm:text-4xl"
                text={t("errors.404")}
              />

              <Link to="/">
                <Button
                  className="hoverd"
                  variant="default"
                  icon={<ArrowLeft className="h-4 w-4" />}
                >
                  {t("errors.backToHome")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404;
