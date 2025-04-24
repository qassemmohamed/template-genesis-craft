import { useTranslation } from 'react-i18next';
import { ScrollEffect } from "@/lib/animations";
import { NumberTicker } from "../ui/number-ticker";
import MorphingText from "../ui/morphing-text";

export default function StatsSection() {
  const { t } = useTranslation();

  const texts = [
    t('stats.taxReturns'),
    t('stats.happyClients'),
    t('stats.maximizedRefunds'),
    t('stats.clientSavings'),
    t('stats.taxExpertise'),
    t('stats.successfulAudits'),
    t('stats.onTimeFilings'),
    t('stats.businessClients'),
    t('stats.taxDeductions'),
    t('stats.newClients'),
    t('stats.financialPlans'),
    t('stats.eFilingSubmissions'),
    t('stats.clientRetention'),
    t('stats.taxCompliance'),
    t('stats.consultationSessions'),
    t('stats.servedIndustries'),
    t('stats.irsPartnerships')
  ];

  return (
    <section className="py-20">
      <div className="mx-auto w-full space-y-16 container ">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <ScrollEffect type="fadeUp">
            <h2 className="text-title text-4xl font-medium lg:text-5xl">
              {t('stats.trustedServices')}
            </h2>
          </ScrollEffect>

          <ScrollEffect type="fadeUp">
            <p className="text-body px-4">
              {t('stats.description')}
            </p>
          </ScrollEffect>
        </div>

        <ScrollEffect type="fadeUp">
          <div className="grid gap-12 divide-y md:divide-y-0 md:divide-x *:text-center md:grid-cols-3 md:gap-2">
            <div className="space-y-4">
              <p className="text-title text-5xl font-bold">
                <NumberTicker suffix="%" value={100} />
              </p>
              <p className="text-title text-5xl font-bold">
                <MorphingText texts={texts} />
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-title text-5xl font-bold">
                <NumberTicker suffix=" Million" value={22} />
              </p>
              <p className="text-body px-4">
                {t('stats.millionDescription')}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-title text-5xl font-bold">
                <NumberTicker suffix="+" value={20} />
              </p>
              <p className="text-body px-4">
                {t('stats.yearsExperience')}
              </p>
            </div>
          </div>
        </ScrollEffect>
      </div>
    </section>
  );
}
