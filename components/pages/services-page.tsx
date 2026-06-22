import {PageShell} from '@/components/page-shell';
import {getTranslator} from '@/lib/i18n';

export function ServicesPage() {
  const t = getTranslator();

  return (
    <PageShell routeKey="services">
      <section className="page-hero">
        <div className="container">
          <h1>{t('services.title')}</h1>
          <p>{t('services.sections.overview.body')}</p>
        </div>
      </section>
    </PageShell>
  );
}
