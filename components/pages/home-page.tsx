import Link from 'next/link';

import {Phone} from '@/components/illustrations';
import {NextVacationBanner} from '@/components/next-vacation-banner';
import {OpeningHours} from '@/components/opening-hours';
import {PageShell} from '@/components/page-shell';
import {PracticeLogo} from '@/components/practice-logo';
import {Section} from '@/components/section';
import {VisitRules} from '@/components/visit-rules';
import {practice} from '@/content/practice';
import {getTranslator} from '@/lib/i18n';
import {getPath} from '@/lib/routing';

/**
 * Startseite.
 *
 * Sie beantwortet vier Fragen und hoert dann auf: Wer ist das? Wie erreiche
 * ich die Praxis sofort? Was muss ich beim Kommen beachten? Wann ist
 * geoeffnet?
 *
 * Im Hero steht genau EINE Aktion: anrufen. Sie gilt fuer alle Anliegen und
 * fuer alle Menschen. Der Online-Termin wurde von der Praxis bewusst aus dem
 * Hero entfernt und steht nur noch in der Kopfzeile; erklaert wird er auf
 * /termine.
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
 * REIHENFOLGE (August 2026 von der Praxis so gewuenscht):
 *   Hero (Bildmarke) -> "Die Praxis" -> "Sprechzeiten" ->
 *   die zwei Besuchsregeln -> Wegweiser in die Unterseiten.
 * Die Regeln standen vorher am Seitenende und der Wegweiser als Randnotiz
 * neben der Sprechzeitentabelle. Die Praxis wollte die Regeln hoeher, aber
 * ausdruecklich NICHT ganz nach oben: "direkt nach den Sprechzeiten" und
 * der Wegweiser danach ans Ende.
 *
 * Fuenf Abschnitte, fuenf verschiedene Strukturmuster (zweispaltiger Hero mit
 * Bildmarke, ruhiges Roséband, zwei Hinweiskaesten, Datenliste mit
 * Randspalte, ein Satz Fliesstext) — statt fuenfmal derselben Kachelreihe.
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

          {/* Leitmotiv der Startseite ist die Bildmarke der Praxis selbst:
              das Stethoskop, das ein Herz umschliesst — dasselbe Zeichen wie
              auf Visitenkarte und Fensterfolie. Es steht hier auf Wunsch der
              Praxis (August 2026) anstelle der frueheren Illustration mit
              Fenster, Pflanze und Tasse.
              Rein dekorativ: die Marke traegt keine Information, die nicht
              auch als Text daneben steht (der Praxisname ist das <h1>). */}
          <div className="page-hero__figure home-hero__figure">
            <div className="home-hero__plate">
              <PracticeLogo className="home-hero__logo" />
            </div>
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
          auf abweichende Zeiten und dem Link zu den Schliesszeiten. Beides
          gehoert sachlich zu den Sprechzeiten; der allgemeine Wegweiser in die
          Unterseiten stand frueher ebenfalls hier und schliesst die Seite
          jetzt als eigener Abschnitt ab. */}
      <Section className="home-hours" title={t('home.hours.title')} tone="surface">
        <div className="home-hours__layout">
          <OpeningHours />

          <div className="home-hours__aside">
            <p className="home-hours__note">{t('home.hours.note')}</p>
            <Link className="link link--arrow" href={getPath('closures')}>
              {t('home.hours.link')}
            </Link>
          </div>
        </div>
      </Section>

      {/* Terminpflicht und Hygienehinweis, DIREKT NACH den Sprechzeiten.
          Genau diese Stelle hat die Praxis benannt (Sprachnachricht vom
          09.08.2026, 17:11): nicht ganz nach oben, sondern hinter die Zeiten
          und noch vor den Wegweiser. Wer nachgesehen hat, wann geoeffnet ist,
          liest als naechstes, was beim Kommen gilt.
          Dieselben zwei Kaesten stehen am Ende von /termine (components/
          visit-rules.tsx erklaert, warum das keine Inhaltsdoppelung ist). */}
      <Section titleHidden title={t('home.rules.title')}>
        <VisitRules />
      </Section>

      {/* Wegweiser in die Unterseiten — der Abschluss der Seite. Er stand bis
          August 2026 als Randnotiz neben der Sprechzeitentabelle; die Praxis
          wollte ihn ganz ans Ende. Fliesstext mit Inline-Links statt Kacheln:
          ein Wegweiser ist ein Satz, kein Raster.
          `flushTop`, weil der Abschnitt direkt auf den Regeln aufsetzt und
          beide auf derselben cremefarbenen Flaeche stehen: mit beidseitigem
          Abstand klaffte dazwischen die doppelte Sektionsluft.
          Die Ueberschrift traegt nur die Vorlesereihenfolge — sichtbar waere
          sie eine leere Geste ueber zwei Zeilen Text. */}
      <Section className="home-guide" titleHidden title={t('home.guide.title')} flushTop>
        <p className="home-guide__body">
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
      </Section>

    </PageShell>
  );
}
