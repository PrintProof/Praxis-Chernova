import Link from 'next/link';

import {AlertCircle, Mask, Phone, PracticeIllustration} from '@/components/illustrations';
import {NextVacationBanner} from '@/components/next-vacation-banner';
import {OpeningHours} from '@/components/opening-hours';
import {PageShell} from '@/components/page-shell';
import {Section} from '@/components/section';
import {practice} from '@/content/practice';
import {getTranslator} from '@/lib/i18n';
import {getPath} from '@/lib/routing';

/**
 * Startseite.
 *
 * Sie beantwortet drei Fragen und hoert dann auf: Wer ist das? Wie erreiche
 * ich die Praxis sofort? Wann ist geoeffnet?
 *
 * Die beiden Wege zu einem Termin stehen im Hero: anrufen (gilt fuer alle)
 * und online buchen (gilt fuer Bestandspatientinnen und Bestandspatienten).
 * Genau dieser Unterschied steht als kurzer Hinweis darunter — die
 * ausfuehrliche Fassung bleibt auf /kontakt.
 *
 * WARUM HIER DIE SPRECHZEITEN STEHEN
 * Frueher endete die Seite mit drei gleich grossen weissen Karten, deren
 * Ueberschriften woertlich die drei Hauptnavigationspunkte wiederholten —
 * ein zweites Menue als Kachelraster, ohne eine einzige Information, die
 * nicht schon in der Kopfzeile stand. An ihre Stelle tritt das, was auf einer
 * Praxis-Startseite tatsaechlich gesucht wird: die Sprechzeiten.
 * Das ist KEINE Doppelung im kritisierten Sinn: die Tabelle rendert genau eine
 * Komponente (components/opening-hours.tsx) aus genau einer Quelle
 * (practice.openingHours) — sie kann nicht auseinanderlaufen. Wiederholte
 * PROSA gibt es hier weiterhin nicht.
 *
 * Bewusst NICHT auf dieser Seite (jede dieser Angaben hat genau einen
 * kanonischen Ort und wird von hier nur verlinkt):
 *   - Adresse, Rezepttelefon, Fax, organisatorische Ablaeufe -> /kontakt
 *   - Urlaubsdetails samt Vertretungspraxen -> /schliesszeiten
 * Vom Urlaub steht hier nur das zeitkritische Hinweisband; es rendert sich
 * selbst nur, wenn wirklich ein Urlaub ansteht.
 *
 * Drei Abschnitte, drei verschiedene Strukturmuster (zweispaltiger Hero mit
 * Illustration, ruhiges Roséband, Datenliste mit Randspalte) — statt
 * dreimal derselben Kachelreihe.
 */
export function HomePage() {
  const t = getTranslator();

  return (
    <PageShell routeKey="home" notice={<NextVacationBanner />}>
      <section className="page-hero page-hero--split home-hero">
        <div className="container page-hero__inner">
          <div className="home-hero__copy">
            <h1 className="page-hero__title">{practice.name}</h1>

            {/* Genau zwei Aktionen mit klarer Rangfolge.
                PRIMAER ist der Anruf: er gilt fuer alle Anliegen und fuer alle
                Menschen — auch fuer neue Patientinnen und Patienten, die nicht
                online buchen koennen. Die Rufnummer steht sichtbar im Button
                UND im aria-label, sonst waere der zugaengliche Name nicht im
                sichtbaren Text enthalten (WCAG 2.5.3 Label in Name).
                SEKUNDAER der Online-Termin: derselbe externe Link wie in der
                Kopfzeile, aber hier mit dem vollstaendigen Hinweis darunter.
                Wer die Startseite nur ueberfliegt, sieht die Regel damit
                genau einmal — die Details zu Terminen, Rezepten und
                Ablaeufen bleiben auf /kontakt. */}
            <div className="page-hero__actions home-hero__actions">
              <div className="button-row">
                <a
                  className="button button--primary button--phone"
                  href={practice.phoneHref}
                  aria-label={t('cta.callAria', {phone: practice.phone})}
                >
                  <Phone className="button__icon" />
                  <span className="button__text">
                    <span className="button__label">{t('cta.call')}</span>
                    <span className="button__value">{practice.phone}</span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Leitmotiv der Startseite. Rein dekorativ: die Grafik traegt keine
              Information, die nicht auch im Text steht. */}
          <div className="page-hero__figure home-hero__figure">
            <PracticeIllustration className="illustration home-hero__illustration" />
          </div>
        </div>
      </section>

      {/* "Die Praxis" — ein ruhiger Block im Roséband, EINE Spalte.
          Bewusst ohne schmalen mittigen Container: der begann rund 200px
          weiter rechts als Hero, Kopfzeile und Fusszeile und erzeugte beim
          Scrollen einen sichtbaren Versatz. Die Zeilenlaenge begrenzt jetzt
          der Absatz selbst (page-home.css), die Kante bleibt die der Seite. */}
      <Section tone="muted" containerClassName="home-about">
        <h2 className="home-about__title">{t('home.about.title')}</h2>
        <p className="home-about__body">{t('home.about.body')}</p>
      </Section>

      {/* Sprechzeiten — die meistgesuchte Angabe einer Praxis-Startseite.
          Links die Datenliste, rechts eine schmale Randspalte mit dem Hinweis
          auf abweichende Zeiten und den zwei Saetzen, die frueher als
          Kartenraster gesetzt waren. Fliesstext mit Inline-Links statt
          Kacheln: ein Wegweiser ist eine Zeile Text, kein Raster. */}
      <Section className="home-hours" title={t('home.hours.title')} tone="surface">
        <div className="home-hours__layout">
          <OpeningHours />

          <div className="home-hours__aside">
            <p className="home-hours__note">{t('home.hours.note')}</p>
            <Link className="link link--arrow" href={getPath('closures')}>
              {t('home.hours.link')}
            </Link>
            <p className="home-hours__guide">
              {t.rich('home.guide.body', {
                appointments: (chunks) => (
                  <Link href={getPath('appointments')}>{chunks}</Link>
                ),
                prescriptions: (chunks) => (
                  <Link href={getPath('prescriptions')}>{chunks}</Link>
                ),
                housecalls: (chunks) => <Link href={getPath('housecalls')}>{chunks}</Link>,
                contact: (chunks) => <Link href={getPath('contact')}>{chunks}</Link>
              })}
            </p>
          </div>
        </div>
      </Section>

      {/* Terminpflicht und Hygienehinweis standen bis August 2026 auf /termine.
          Die Praxis wollte beide auf der Startseite haben — es sind die zwei
          Regeln, an denen sonst jemand vergeblich vor der Tuer steht bzw. ohne
          Maske hereinkommt. Auf /termine stehen sie deshalb NICHT mehr. */}
      <Section titleHidden title={t('home.rules.title')}>
        <div className="callout home-rules__rule">
          <p className="callout__title">
            <AlertCircle className="icon icon--sm callout__icon" />
            <span>{t('home.rules.appointmentOnly')}</span>
          </p>
          <p className="callout__body">{practice.appointments.byAppointmentOnly}</p>
        </div>

        <div className="note home-rules__mask">
          <p className="note__title">
            <Mask className="icon note__icon" />
            <span>{t('home.rules.mask')}</span>
          </p>
          <p className="note__body">{practice.maskNote}</p>
          <p className="note__thanks">{t('home.rules.thanks')}</p>
        </div>
      </Section>

    </PageShell>
  );
}
