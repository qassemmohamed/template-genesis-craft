import {
  Briefcase,
  Calculator,
  FileText,
  Globe,
  FileSignature,
} from "lucide-react";

interface ServiceItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  fullDescription: string;
}

export const servicesData: ServiceItem[] = [
  {
    icon: Calculator,
    title: "services.tax_efiling.title",
    description: "services.tax_efiling.description",
    fullDescription: "services.tax_efiling.fullDescription",
    href: "#services",
  },
  {
    icon: FileText,
    title: "services.bookkeeping.title",
    description: "services.bookkeeping.description",
    fullDescription: "services.bookkeeping.fullDescription",
    href: "#services",
  },
  {
    icon: Globe,
    title: "services.translation.title",
    description: "services.translation.description",
    fullDescription: "services.translation.fullDescription",

    href: "#services",
  },
  {
    icon: Briefcase,
    title: "services.immigration.title",
    description: "services.immigration.description",
    fullDescription: "services.immigration.fullDescription",
    href: "#services",
  },
  {
    icon: FileSignature,
    title: "services.notary.title",
    description: "services.notary.description",
    fullDescription: "services.notary.fullDescription",
    href: "#services",
  },
];
