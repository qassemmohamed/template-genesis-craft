import ContactForm from "@/components/layouts/ContactForm";
import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/navbar/Navbar";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

// Define common styles
const styles = {
  section: "py-10 sm:py-16 lg:py-10 container",
  container: "",
  title:
    "text-3xl font-bold leading-tight text-[var(--headline)] sm:text-4xl lg:text-5xl",
  text: "max-w-xl mx-auto mt-4 text-base leading-relaxed text-[var(--paragraph)]",
};

const Contact = () => {
  const { t } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <div>
      <Navbar />
      <section dir={direction} className={styles.section}>
        <div className={styles.container}>
          <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 lg:gap-x-20">
            <div className="flex flex-col justify-between lg:py-5">
              <div>
                <h2 className={styles.title}>{t("contact.title")}</h2>
                <p className="mt-4 text-base leading-relaxed text-[var(--paragraph)]">
                  {t("contact.intro")}
                </p>

                <div className="mt-8">
                  <h3 className="mb-4 text-xl font-semibold text-[var(--headline)]">
                    {t("contact.servicesHeader")}
                  </h3>
                  <ul className="space-y-2 text-[var(--paragraph)]">
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✅</span>
                      {t("contact.taxService")}
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✅</span>
                      {t("contact.translationService")}
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✅</span>
                      {t("contact.immigrationService")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
