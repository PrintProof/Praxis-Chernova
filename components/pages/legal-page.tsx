import {PageShell} from '@/components/page-shell';
import {Section} from '@/components/section';
import type {Locale} from '@/lib/i18n';
import {getTranslator} from '@/lib/i18n';
import type {RouteKey} from '@/lib/routing';

export function LegalPage({
  locale,
  routeKey,
  translationPrefix
}: {
  locale: Locale;
  routeKey: Extract<RouteKey, 'legal' | 'privacy'>;
  translationPrefix: 'legalPage' | 'privacyPage';
}) {
  const t = getTranslator(locale);

  return (
    <PageShell locale={locale} routeKey={routeKey}>
      <section className="page-hero">
        <div className="container">
          <p className="page-hero__eyebrow">{t(`${translationPrefix}.eyebrow`)}</p>
          <h1>{t(`${translationPrefix}.title`)}</h1>
          <p>{t(`${translationPrefix}.lead`)}</p>
        </div>
      </section>

      <Section title={t(`${translationPrefix}.sectionTitle`)} description={t(`${translationPrefix}.sectionBody`)}>
        <div className="legal-placeholder">
          <p>{t(`${translationPrefix}.placeholderOne`)}</p>
          <p>{t(`${translationPrefix}.placeholderTwo`)}</p>
          <p>{t(`${translationPrefix}.placeholderThree`)}</p>
        </div>
      </Section>
    </PageShell>
  );
}
