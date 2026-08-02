import Link from 'next/link';

import {
  AlertCircle,
  Calendar,
  Mask,
  Phone,
  PracticeIllustration,
  Prescription,
  Video
} from '@/components/illustrations';
import {NextVacationBanner} from '@/components/next-vacation-banner';
import {OpeningHours} from '@/components/opening-hours';
import {PageShell} from '@/components/page-shell';
import {PhoneSentence} from '@/components/phone-sentence';
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
 *   - Urlaubsdetails samt Vertretungspraxen -> /aktuelles
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
            <p className="page-hero__eyebrow">{t('home.hero.eyebrow')}</p>
            <h1 className="page-hero__title">{practice.name}</h1>
            <p className="page-hero__specialty">{t('common.specialtyShort')}</p>
            <p className="page-hero__lead">{t('home.hero.lead')}</p>

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
                <a
                  className="button button--secondary button--booking"
                  href={practice.bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Calendar className="button__icon" />
                  <span className="button__text">
                    <span className="button__label">{t('cta.bookOnlineShort')}</span>
                    <span className="button__note">{t('cta.bookOnlineAudience')}</span>
                  </span>
                  <span className="visually-hidden"> ({t('accessibility.newTabHint')})</span>
                </a>
              </div>
              {/* Die Einschraenkung selbst steht IM Button. Hier bleibt nur,
                  was der Button nicht sagen kann: wer stattdessen anruft.
                  Massgeblich ist die APP-NUTZUNG, nicht "neu in der Praxis" —
                  so von der Praxis ausdruecklich korrigiert.
                  Ohne das Zeitfenster: das steht im Abschnitt "Termin
                  vereinbaren" direkt darunter in der Telefon-Karte. */}
              <PhoneSentence
                className="hint home-hero__hint"
                text={practice.appointments.appOptOut}
                href={practice.phoneHref}
                display={practice.phone}
              />
            </div>
          </div>

          {/* Leitmotiv der Startseite. Rein dekorativ: die Grafik traegt keine
              Information, die nicht auch im Text steht. */}
          <div className="page-hero__figure home-hero__figure">
            <PracticeIllustration className="illustration home-hero__illustration" />
          </div>
        </div>
      </section>

      {/* Terminvereinbarung — der kanonische Ort fuer die Frage "Wie bekomme
          ich einen Termin?".
          Bewusst auf der STARTSEITE und nicht auf /kontakt: es ist die
          haeufigste Frage an eine Hausarztpraxis, und die beiden Zeitfenster
          erklaeren die Buttons im Hero direkt darueber. /kontakt verweist
          hierher, statt den Block zu wiederholen.
          Die Karten tragen KEINE eigenen Buttons — die stehen unmittelbar
          darueber im Hero. Vier Buttons auf einem Bildschirm waeren Laerm.
          Quelle aller Texte: das Merkblatt der Praxis (content/practice.ts). */}
      <Section
        id="termin"
        className="home-appointment"
        eyebrow={t('home.appointment.eyebrow')}
        title={t('home.appointment.title')}
        description={t('home.appointment.description')}
        tone="surface"
      >
        <div className="home-appointment__ways">
          <article className="way">
            <p className="way__head">
              <Calendar className="icon way__icon" />
              <span className="way__title">{t('home.appointment.onlineTitle')}</span>
            </p>
            <p className="way__when">{t('home.appointment.onlineWhen')}</p>
            <p className="way__scope">{t('home.appointment.forToday')}</p>
            <p className="way__body">{practice.appointments.onlineAudience}</p>
          </article>

          <article className="way">
            <p className="way__head">
              <Phone className="icon way__icon" />
              <span className="way__title">{t('home.appointment.phoneTitle')}</span>
            </p>
            <p className="way__when">{t('home.appointment.phoneWhen')}</p>
            <p className="way__scope">{t('home.appointment.forToday')}</p>
            <p className="way__body">
              <a className="way__phone" href={practice.phoneHref}>
                {practice.phone}
              </a>
            </p>
          </article>
        </div>

        {/* Videosprechstunde — bewusst NICHT als dritte Karte neben den beiden
            Buchungswegen: sie ist kein Weg, einen Termin zu bekommen, sondern
            eine Behandlungsform, die man ueber genau dieselben zwei Wege
            vereinbart. Als gleichrangige Karte haette sie eine dritte Uhrzeit
            suggeriert, die es nicht gibt. Gleiche Kartenform (Wiedererkennung),
            aber getoente Flaeche: ein Angebot, keine Anleitung. */}
        <article className="way way--offer home-appointment__video">
          <p className="way__head">
            <Video className="icon way__icon" />
            <span className="way__title">{t('home.appointment.videoTitle')}</span>
          </p>
          <p className="way__body">{practice.appointments.videoLine}</p>
        </article>

        {/* Die verbindliche Regel auf der reservierten Sandflaeche — sie ist
            der Hinweis, wegen dem sonst jemand vergeblich vor der Tuer steht. */}
        <div className="callout home-appointment__rule">
          <p className="callout__title">
            <AlertCircle className="icon icon--sm callout__icon" />
            <span>{t('home.appointment.ruleTitle')}</span>
          </p>
          <p className="callout__body">{practice.appointments.byAppointmentOnly}</p>
        </div>

        {/* Hygienehinweis: bewusst NICHT auf der Sandflaeche, sondern ruhiger.
            Sand ist fuer 116 117 und Schliesszeiten reserviert; zwei gleich
            laute Kaesten nebeneinander heben sich gegenseitig auf. */}
        <div className="note home-appointment__mask">
          <p className="note__title">
            <Mask className="icon note__icon" />
            <span>{t('home.appointment.maskTitle')}</span>
          </p>
          <p className="note__body">{practice.maskNote}</p>
          <p className="note__thanks">{t('home.appointment.thanks')}</p>
        </div>
      </Section>

      {/* Rezepttelefon — auf ausdruecklichen Wunsch der Aerztin prominent.
          Der Kern ist die RUND-UM-DIE-UHR-Erreichbarkeit: sie entlastet die
          Hauptnummer, die morgens zwischen 7:30 und 8:30 fuer Termine gebraucht
          wird. Bisher stand der Satz nur auf /kontakt, tief unten in
          "Organisatorisches" — dort findet ihn nur, wer ohnehin sucht.

          Der Satz der Praxis wird WOERTLICH uebernommen und allein durch seine
          Groesse hervorgehoben (--step-2), statt ihn fuer die Startseite neu zu
          texten. So gibt es die Aussage nur in einer Formulierung, hier wie auf
          /kontakt, aus derselben Quelle in content/practice.ts.
          Der vollstaendige Ablauf (App, 10:00 Uhr, Gesundheitskarte) bleibt auf
          /kontakt; hierher fuehrt nur der Link am Ende. */}
      <Section
        id="rezept"
        className="home-prescription"
        eyebrow={t('home.prescription.eyebrow')}
        title={t('home.prescription.title')}
      >
        <div className="prescription-panel">
          <div className="prescription-panel__phone">
            <p className="prescription-panel__label">
              <Prescription className="icon prescription-panel__icon" />
              <span>{t('home.prescription.phoneLabel')}</span>
            </p>
            <p className="prescription-panel__number">
              <a href={practice.prescriptionPhoneHref}>
                {practice.prescriptionPhoneDisplay}
              </a>
            </p>
          </div>

          <div className="prescription-panel__body">
            <p className="prescription-panel__lead">
              {practice.prescriptionNotes.phoneAvailability}
            </p>
            <p className="prescription-panel__processing">
              {practice.prescriptionNotes.processingLine}
            </p>
            <p>
              <Link className="link--arrow" href={`${getPath('contact')}#rezepte`}>
                {t('home.prescription.link')}
              </Link>
            </p>
          </div>
        </div>
      </Section>

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
            <Link className="link link--arrow" href={getPath('news')}>
              {t('home.hours.link')}
            </Link>
            <p className="home-hours__guide">
              {t.rich('home.guide.body', {
                services: (chunks) => <Link href={getPath('services')}>{chunks}</Link>,
                contact: (chunks) => <Link href={getPath('contact')}>{chunks}</Link>
              })}
            </p>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
