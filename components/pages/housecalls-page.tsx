import {HouseCall} from '@/components/illustrations';
import {NextVacationBanner} from '@/components/next-vacation-banner';
import {PageShell} from '@/components/page-shell';
import {PhoneSentence} from '@/components/phone-sentence';
import {Section} from '@/components/section';
import {practice} from '@/content/practice';
import {getTranslator} from '@/lib/i18n';

/**
 * /hausbesuche — auf ausdruecklichen Wunsch der Praxis eine eigene Seite.
 *
 * Der Inhalt ist bewusst knapp: die Praxis hat genau EINEN Satz dazu
 * formuliert, und erfunden wird hier nichts dazu. Damit die Seite trotzdem
 * traegt, steht neben der Voraussetzung auch, WIE man einen Hausbesuch
 * vereinbart — telefonisch, wie jeden anderen Termin auch.
 */
export function HouseCallsPage() {
  const t = getTranslator();

  return (
    <PageShell routeKey="housecalls" notice={<NextVacationBanner />}>
      <section className="page-hero page-hero--muted">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">{t('housecalls.eyebrow')}</p>
          <h1 className="page-hero__title">{t('housecalls.title')}</h1>
        </div>
      </section>

      <Section titleHidden title={t('housecalls.title')}>
        <p className="housecalls__lead">
          <HouseCall className="icon housecalls__icon" />
          <span>{practice.houseCallsNote}</span>
        </p>
      </Section>

      {/* Ein Hausbesuch wird vereinbart wie jeder Termin: telefonisch. Deshalb
          hier derselbe Satz und dieselbe Rufnummer wie auf /termine, aus
          derselben Quelle — nicht neu formuliert. */}
      <Section className="housecalls-arrange" title={t('housecalls.arrangeTitle')} tone="surface">
        <PhoneSentence
          className="housecalls-arrange__line"
          text={practice.appointments.appOptOut}
          href={practice.phoneHref}
          display={practice.phone}
        />
        <p className="housecalls-arrange__window">{practice.appointments.phoneWindowLine}</p>
      </Section>
    </PageShell>
  );
}
