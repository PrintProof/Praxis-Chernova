import {PageShell} from '@/components/page-shell';
import {Section} from '@/components/section';
import {getTranslator} from '@/lib/i18n';

export function ServicesPage() {
  const t = getTranslator();
  const serviceCards = ['internalMedicine', 'primaryCare'] as const;

  return (
    <PageShell routeKey="services">
      <section className="page-hero">
        <div className="container">
          <h1>{t('services.title')}</h1>
        </div>
      </section>

      <Section
        title={t('services.sections.overview.title')}
        description={t('services.sections.overview.body')}
      >
        <div className="service-list">
          {serviceCards.map((card) => (
            <article key={card} className="service-list__item">
              <h3>{t(`services.cards.${card}.title`)}</h3>
              <p>{t(`services.cards.${card}.body`)}</p>
            </article>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
