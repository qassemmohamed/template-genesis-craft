import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { footerLinks } from "@/data/FooterLinks";
import { useTranslation } from "react-i18next";
import { MapComponent } from "./MapComponent";
import Logo from "../ui/Logo";
import ThemeSelector from "../common/ThemeSelector";

const FooterLinkSection = ({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; name: string; isLive?: boolean }>;
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <p className="font-medium text-[var(--headline)]">{t(title)}</p>
      <ul className="mt-6 space-y-4 text-sm">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="flex items-center text-primary-foreground/65 transition hover:text-primary-foreground/75"
            >
              {t(link.name)}
              {link.isLive && (
                <span className="relative ml-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-100 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400"></span>
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t-2 border-[var(--border)] bg-[var(--footer-background)]">
      <div className="container mx-auto flex  flex-col py-12">
        <div className="lg:grid lg:grid-cols-2">
          <Card className="border-none bg-transparent lg:order-last">
            <CardHeader className="px-0">
              <CardTitle className="m-0 p-0 text-[var(--headline)]">
                {t("footer.locationTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 p-0 lg:h-96">
              <MapComponent />
            </CardContent>
          </Card>

          <div className="w-full pe-16 max-md:p-0">
            <div className="hidden text-primary-foreground lg:block">
              <Logo />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 text-[var(--paragraph)] sm:grid-cols-3">
              <FooterLinkSection
                title={t("footer.services")}
                links={footerLinks.services}
              />

              <FooterLinkSection
                title={t("footer.company")}
                links={footerLinks.company}
              />
              {/* <FooterLinkSection
                title={t("footer.helpfulLinks")}
                links={footerLinks.helpfulLinks}
              /> */}
            </div>

            <div className="mt-8 space-y-4 text-sm text-primary-foreground/80">
              <p className="flex max-w-md items-center gap-2">
                <MapPin size={16} />
                {t("footer.address")}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} />
                {t("footer.phone")}
              </p>

              <Link
                to={"mailto:" + t("footer.email")}
                className="flex items-center gap-2"
              >
                <Mail className="text-[var(--paragraph)]" size={16} />
                <span className="text-[var(--paragraph)]">
                  {t("footer.email")}
                </span>
              </Link>
            </div>

            {/* <p className="mt-4 text-sm text-primary-foreground/80">
              {t("footer.contactMessage")}
            </p> */}

            <div className="mt-8 border-t border-primary-foreground/10 pt-8">
              {/* <ul className="flex flex-wrap gap-4 text-xs">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-primary-foreground/60 transition hover:text-primary-foreground/75"
                    >
                      {t(link.name)}
                    </Link>
                  </li>
                ))}
              </ul> */}
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full items-center max-md:flex-col max-md:gap-4 justify-between">
          <p className="text-xs text-[var(--paragraph)]">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <ThemeSelector />
        </div>
      </div>
    </footer>
  );
}
