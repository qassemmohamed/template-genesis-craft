"use client";

import { MagicCard } from "../ui/magic-card";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import API_LINKS from "@/utils/apis";

const styles = {
  container: "container",
  sectionPadding: "py-12 max-md:pt-[10px] container",
  card: "flex item-center justify-center bg-[var(--card-background)] p-[20px] border-2 border-[var(--card-border-color)] rounded-[18px] variant-outlined",
  cardText: "text-center font-semibold text-3xl text-title",
  cardIcon:
    "w-fit block mx-auto text-5xl font-semibold text-[var(--card-headline)] text-transparent bg-clip-text bg-gradient-to-br from-primary-300 to-primary-700 dark:from-primary-400 dark:to-primary-700",
  cardHeading: "mt-0 text-center font-semibold text-3xl text-title",
  cardInnerContent:
    "relative aspect-square rounded-full size-32 flex border mx-auto border-[var(--card-border-color)]",
  cardContent: "mt-0 pb-10 text-center relative z-10 h-max space-y-2",
  cardHeadingSmall:
    "text-lg font-medium transition group-hover:text-secondary-950",
  cardDescription: "text-[var(--paragraph)]",
  gridCard: "grid sm:grid-cols-2",
  gridItem:
    "flex flex-col justify-between relative z-10 space-y-12 lg:space-y-6",
  imageCard: "h-full grid sm:grid-cols-2",
  imageItem: "size-7 ring-4 ring-[--ui-bg]",
  userInfo:
    "flex items-center justify-end gap-2 w-[calc(50%+0.875rem)] relative",
  seeMoreButton: "mt-3 text-sm font-medium transition-colors",
  descriptionContainer: "mt-4 text-sm text-left overflow-hidden",
  expandedDescription:
    "max-h-[200px] text-[var(--paragraph)] text-center overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary-200 scrollbar-track-transparent",
};

export default function ServicesSection() {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(API_LINKS.SERVICES);
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section id="services">
      <div className={styles.sectionPadding}>
        <div className="mx-auto mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold">{t("services.title")}</h2>
          <p className="mx-auto max-w-2xl text-[var(--card-paragraph)]">
            {t("services.subtitle")}
          </p>
        </div>

        {loading ? (
          <div className="text-center">{t("app.loading")}</div>
        ) : (
          <div className="relative">
            <div className="relative z-10 grid grid-cols-6 gap-3">
              {services.map((service, index) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  size={
                    index < 2 ? "lg:col-span-3" : "sm:col-span-3 lg:col-span-2"
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const ServiceCard = ({ service, size }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, 0]);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const { t } = useTranslation();

  const descriptionVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  return (
    <MagicCard
      gradientColor={"var(--magic-card)"}
      className={`${styles.card} col-span-full ${size} relative overflow-hidden`}
      ref={cardRef}
    >
      <motion.div style={{ opacity, y }}>
        <div className={styles.cardContent}>
          <h2 className={styles.cardHeadingSmall}>{service.title}</h2>
          <p className={styles.cardDescription}>{service.description}</p>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                className={styles.descriptionContainer}
                variants={descriptionVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
              >
                <div className={styles.expandedDescription}>
                  {service.fullDescription}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={toggleExpand}
            className="text-[var(--link-color)]"
            aria-expanded={isExpanded}
          >
            <span className="flex items-center justify-center gap-1">
              <span>{isExpanded ? t("app.hide") : t("app.seemore")}</span>
              <span className="text-sm">{isExpanded ? "▲" : "▼"}</span>
            </span>
          </button>
        </div>
      </motion.div>
    </MagicCard>
  );
};
