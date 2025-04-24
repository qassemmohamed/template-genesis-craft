import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { servicesData } from "@/data/ServicesData";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import {
  DialogDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function Services() {
  const { t } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <section dir={direction} id="services" className="section container">
      <h2 className="section-title">{t("services.title")}</h2>
      <p className="section-subtitle pb-12 text-center max-md:pb-10">
        {t("services.subtitle")}
      </p>
      <div className="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-3">
        {servicesData.map((service, index) => (
          <Dialog>
            <DialogTrigger>
              <ServiceCard key={index} {...service} t={t} />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t(service.title)}</DialogTitle>
                <DialogDescription className="py-3 leading-6">
                  {t(service.fullDescription)}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  );
}

function ServiceCard({
  icon: Icon,
  title,
  description,
  t,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  t: (key: string) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="h-full text-start"
    >
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-8 w-8 text-[var(--headline)]" />{" "}
            <span>{t(title)}</span>{" "}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{t(description)}</CardDescription>{" "}
        </CardContent>
      </Card>
    </motion.div>
  );
}
