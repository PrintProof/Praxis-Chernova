import Link from 'next/link';

import {EmergencyService} from '@/components/emergency-service';
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
 *   - Urlaubsdetails samt Vertretungspraxen -> /urlaubszeiten
 * Vom Urlaub steht hier nur das zeitkritische Hinweisband; es rendert sich
 * selbst nur, wenn wirklich ein Urlaub ansteht.
 *
 * REIHENFOLGE:
 *   Hero (Bildmarke) -> "Die Praxis" -> "Sprechzeiten" ->
 *   die zwei Besuchsregeln -> 116 117 / 112. Ende.
 * Die Regeln standen vorher am Seitenende, dann folgte ihnen noch ein
 * Wegweiser-Absatz in die Unterseiten. Die Praxis wollte die Regeln hoeher,
 * aber ausdruecklich NICHT ganz nach oben ("direkt nach den Sprechzeiten",
 * August 2026) — und hat den Wegweiser im September 2026 gestrichen und
 * stattdessen den Notdienstblock ans Ende gesetzt.
 *
 * Fuenf Abschnitte, fuenf verschiedene Strukturmuster (zweispaltiger Hero mit
 * Bildmarke, ruhiges Roséband, Datenliste mit Randspalte, zwei Hinweiskaesten,
 * zwei Sandkaesten mit Rufnummer) — statt fuenfmal derselben Kachelreihe.
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
          Links die Datenliste, rechts eine schmale Randspalte mit dem Link zu
          den Urlaubszeiten.
          Der erklaerende Satz "Waehrend der Schliesszeiten der Praxis gelten
          abweichende Zeiten." stand bis September 2026 ueber dem Link und ist
          von der Praxis gestrichen worden (Screenshot vom 07.09.2026): der
          Link sagt dasselbe in der Haelfte der Woerter, und wer wirklich
          betroffen ist, klickt ohnehin. */}
      <Section className="home-hours" title={t('home.hours.title')} tone="surface">
        <div className="home-hours__layout">
          <OpeningHours />

          <div className="home-hours__aside">
            <Link className="link link--arrow" href={getPath('closures')}>
              {t('home.hours.link')}
            </Link>
          </div>
        </div>
      </Section>

      {/* Terminpflicht und Hygienehinweis — der ABSCHLUSS der Seite, direkt
          nach den Sprechzeiten.
          Genau diese Stelle hat die Praxis benannt (Sprachnachricht vom
          09.08.2026, 17:11): nicht ganz nach oben, sondern hinter die Zeiten
          und noch vor den Wegweiser. Wer nachgesehen hat, wann geoeffnet ist,
          liest als naechstes, was beim Kommen gilt.
          Dieselben zwei Kaesten stehen am Ende von /termine (components/
          visit-rules.tsx erklaert, warum das keine Inhaltsdoppelung ist).

          DANACH KOMMT NICHTS MEHR. Bis September 2026 schloss die Seite mit
          einem Wegweiser-Absatz ("Termine, Rezepte und Hausbesuche sind unter
          ... erklaert. Alle Kontaktwege und die Anfahrt stehen unter ...").
          Die Praxis hat ihn gestrichen (Screenshot vom 07.09.2026, ganzer
          Absatz gelb markiert): er sagte in zwei Zeilen Fliesstext genau das,
          was die sechs Punkte der Hauptnavigation ohnehin sagen. */}
      <Section titleHidden title={t('home.rules.title')}>
        <VisitRules />
      </Section>

      {/* 116 117 / 112 als LETZTER Block — von der Praxis im September 2026
          ausdruecklich auch auf die Startseite gewuenscht ("unter bei
          Erkaeltungssymptomen"). Wer abends oder am Wochenende auf der
          Startseite landet, findet damit sofort die Nummer, die dann gilt,
          statt erst /urlaubszeiten oeffnen zu muessen.
          Dieselbe Komponente wie dort und auf /kontakt: die Nummern koennen
          nicht auseinanderlaufen, und der Bereitschaftsdienst bleibt sauber
          getrennt vom Urlaubshinweis (KV-Vorgabe, siehe
          components/emergency-service.tsx). */}
      <EmergencyService />

    </PageShell>
  );
}
