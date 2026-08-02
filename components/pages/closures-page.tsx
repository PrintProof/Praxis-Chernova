import Link from 'next/link';

import {EmergencyService} from '@/components/emergency-service';
import {PageShell} from '@/components/page-shell';
import {Section} from '@/components/section';
import {VacationOverview} from '@/components/vacation-overview';
import {getTranslator} from '@/lib/i18n';
import {getPath} from '@/lib/routing';

/**
 * /schliesszeiten — ausschliesslich zeitkritische Betriebsinformationen:
 * Schliesszeiten samt Vertretung und die Nummern fuer Zeiten ausserhalb der
 * Sprechstunde. Bewusst kein Praxis-Blog: ein veralteter Beitrag wuerde die
 * einzige wirklich wichtige Information verdecken.
 *
 * Kein Hinweisband auf dieser Seite — die Vollansicht steht direkt darunter,
 * ein Band waere ein Link auf die eigene Seite.
 */
export function ClosuresPage() {
  const t = getTranslator();

  return (
    <PageShell routeKey="closures">
      <section className="page-hero page-hero--muted">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">{t('closures.eyebrow')}</p>
          <h1 className="page-hero__title">{t('closures.title')}</h1>
          <p className="page-hero__lead">{t('closures.lead')}</p>
        </div>
      </section>

      <VacationOverview />

      <EmergencyService />

      <Section
        title={t('closures.hours.title')}
        description={t('closures.hours.body')}
        spacing="sm"
        className="news-hours"
      >
        <Link className="link link--arrow" href={getPath('contact')}>
          {t('cta.contactAndHours')}
        </Link>
      </Section>
    </PageShell>
  );
}
