import {Check} from '@/components/illustrations';
import {HandoutLink} from '@/components/handout-link';
import {NextVacationBanner} from '@/components/next-vacation-banner';
import {PageShell} from '@/components/page-shell';
import {Section} from '@/components/section';
import {practice} from '@/content/practice';
import {getTranslator} from '@/lib/i18n';

/**
 * /extra-leistungen — Angebote der Praxis ausserhalb der Regelversorgung.
 *
 * Von der Praxis im September 2026 gewuenscht, zusammen mit dem Aushang zur
 * Vitamin-Kur. Es ist ausdruecklich NICHT die im August 2026 abgeschaffte
 * Seite /leistungen: die zaehlte auf, was eine Hausarztpraxis ohnehin tut, und
 * trug monatelang einen einzigen Satz. Hier steht nur, was man aktiv
 * nachfragen kann und was sonst nirgends auf der Website steht.
 *
 * Der Aufbau ist bewusst offen fuer mehr: ein Abschnitt pro Angebot, jeder mit
 * kurzem Text und dem Aushang der Praxis als PDF. Kommt ein zweites Angebot
 * dazu, kommt ein zweiter Abschnitt darunter — mehr ist nicht noetig.
 *
 * Der Wortlaut bleibt knapp; die Einzelheiten (auch der Preis) stehen auf dem
 * Aushang, siehe `practice.extras` in content/practice.ts.
 */
export function ExtrasPage() {
  const t = getTranslator();
  const vitaminCure = practice.extras.vitaminCure;

  return (
    <PageShell routeKey="extras" notice={<NextVacationBanner />}>
      <section className="page-hero page-hero--muted">
        <div className="container page-hero__inner">
          <h1 className="page-hero__title">{t('extras.title')}</h1>
          <p className="page-hero__lead">{t('extras.lead')}</p>
        </div>
      </section>

      <Section className="extras-offer" title={t('extras.vitaminCure.title')}>
        <p className="extras-offer__lead">{vitaminCure.lead}</p>

        <ul className="extras-offer__list" role="list">
          {vitaminCure.items.map((item) => (
            <li className="extras-offer__item" key={item}>
              <Check className="icon icon--sm extras-offer__check" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="extras-offer__advice">{vitaminCure.advice}</p>

        <HandoutLink
          file={practice.handouts.vitaminCure}
          label={t('extras.vitaminCure.handout')}
        />
      </Section>
    </PageShell>
  );
}
