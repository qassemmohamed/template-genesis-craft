import { iFrameLink } from "@/data/Links";
import i18n from "@/i18n";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../ui/skeleton";


export const MapComponent = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
  
    const handleMapLoad = () => {
      setLoading(false);
    };
  
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  
    const direction = i18n.language === "ar" ? "rtl" : "ltr";
  
    return (
      <div
        dir={direction}
        className="flex bg-[var(--card)]  rounded-[10px]  h-full w-full items-center justify-center border-2 border-[var(--horder-color)]"
      >
        <iframe
          src={iFrameLink}
          width="100%"
          height="100%"
          style={{ border: 0, display: loading ? "none" : "block" }}
          allowFullScreen={false}
          loading="lazy"
          className="m-0 p-0"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={handleMapLoad}
        ></iframe>
  
        {loading && (
          <Skeleton className="flex h-full w-full items-center justify-center">
            <p className="text-sm">{t("app.loading")}</p>
          </Skeleton>
        )}
      </div>
    );
  };