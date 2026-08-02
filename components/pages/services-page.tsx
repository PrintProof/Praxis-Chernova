import Link from 'next/link';

import {CareIllustration} from '@/components/illustrations';
import {NextVacationBanner} from '@/components/next-vacation-banner';
import {PageShell} from '@/components/page-shell';
import {Section} from '@/components/section';
import {practice} from '@/content/practice';
import {getTranslator} from '@/lib/i18n';
import {getPath} from '@/lib/routing';

/**
 * Leistungen — bewusst NUR die eine Aussage, keine Unterpunkte.
 *
 * Die Praxis hat sich ausdruecklich gegen eine aufgeschluesselte Leistungsliste
 * entschieden (siehe Commit 9d7bed2 "Leistungsseite: nur die Aussage, keine
 * Unterpunkte"). `practice.services` wird hier deshalb NICHT gerendert — die
 * Daten bleiben in content/practice.ts fuer JSON-LD und spaetere Verwendung
 * erhalten, aber die Seite zaehlt weder die Leistungen noch die DMP auf.
 *
 * Wer hier etwas ergaenzen will: erst mit der Praxis abstimmen.
 */
export function ServicesPage() {
  const t = getTranslator();

  return (
    /* Hinweisband wie auf Start- und Kontaktseite: diese Seite ist ein
       haeufiger Einstieg aus der Suche und verweist auf die telefonische
       Terminvereinbarung — ohne das Band stuende dort waehrend einer
       Schliesszeit eine Aufforderung zum Anruf, die gerade niemand
       entgegennimmt. */
    <PageShell routeKey="services" notice={<NextVacationBanner />}>
      <section className="page-hero page-hero--muted">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">{t('services.eyebrow')}</p>
          <h1 className="page-hero__title">{t('services.title')}</h1>
          <p className="page-hero__lead">{t('services.lead')}</p>
        </div>
      </section>

      {/* Kein Abschnittskopf: die Aussage steht bereits im Hero. Hier traegt
          allein die Zeichnung, damit die Seite nicht als nackter Textblock
          endet — sie fuegt keine inhaltliche Aussage hinzu.
          Der frueher hier stehende Block "Termin vereinbaren" ist auf die
          eigene Seite /termine gewandert; hierher bleibt nur der Verweis. */}
      <Section spacing="sm" ariaLabel={t('services.appointment.title')}>
        <div className="grid grid--split-center services-care">
          <div className="services-appointment">
            <h2 className="services-appointment__title">{t('services.appointment.title')}</h2>
            <p className="services-appointment__body">{t('services.appointment.body')}</p>
            <p>
              <Link className="link--arrow" href={getPath('appointments')}>
                {t('services.appointment.link')}
              </Link>
            </p>
          </div>
          {/* Rein dekorativ (aria-hidden im SVG selbst): zwei Stuehle, Tisch, Lampe. */}
          <div className="services-care__figure">
            <CareIllustration className="illustration" />
          </div>
        </div>
      </Section>

    </PageShell>
  );
}
