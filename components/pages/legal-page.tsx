import {PageShell} from '@/components/page-shell';
import {Section} from '@/components/section';
import {datenschutz, impressum, type LegalSection} from '@/content/legal';
import {getTranslator} from '@/lib/i18n';
import type {RouteKey} from '@/lib/routing';

export function LegalPage({
  routeKey,
  translationPrefix
}: {
  routeKey: Extract<RouteKey, 'legal' | 'privacy'>;
  translationPrefix: 'legalPage' | 'privacyPage';
}) {
  const t = getTranslator();
  const sections: LegalSection[] = routeKey === 'legal' ? impressum : datenschutz;

  return (
    <PageShell routeKey={routeKey}>
      <section className="page-hero">
        <div className="container">
          <p className="page-hero__eyebrow">{t(`${translationPrefix}.eyebrow`)}</p>
          <h1>{t(`${translationPrefix}.title`)}</h1>
        </div>
      </section>

      {sections.map((section) => (
        <Section key={section.heading} title={section.heading}>
          <div className="legal-content">
            {section.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Section>
      ))}
    </PageShell>
  );
}
