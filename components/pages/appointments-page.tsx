import {Calendar, Phone, Video} from '@/components/illustrations';
import {NextVacationBanner} from '@/components/next-vacation-banner';
import {PageShell} from '@/components/page-shell';
import {Section} from '@/components/section';
import {VisitRules} from '@/components/visit-rules';
import {practice} from '@/content/practice';
import {getTranslator} from '@/lib/i18n';

/**
 * /termine — alles, was mit einem Besuch in der Praxis zu tun hat.
 *
 * Zusammengezogen aus drei fruher verstreuten Orten: dem Abschnitt "Termin
 * vereinbaren" der Startseite, dem Block "Termin vereinbaren" auf /leistungen
 * und der Zeile "Termine" unter "Organisatorisches" auf /kontakt. Genau diese
 * Verteilung hat die Praxis als unuebersichtlich kritisiert.
 *
 * Reihenfolge folgt dem Ablauf einer Patientin:
 *   1. Wie bekomme ich einen Termin?   (zwei Wege mit Uhrzeit)
 *   2. Geht es auch ohne herzukommen?  (Videosprechstunde)
 *   3. Was gilt, wenn ich komme?       (Terminpflicht, Maske bei Erkaeltung)
 * Schritt 3 wiederholt die zwei Kaesten der Startseite — auf ausdruecklichen
 * Wunsch der Praxis (August 2026), weil viele direkt hier landen. Warum das
 * die Ein-Ort-Regel nicht verletzt, steht in components/visit-rules.tsx.
 *
 * Hausbesuche standen bis September 2026 auf einer eigenen Seite; die hat die
 * Praxis abgeschafft. Sie werden seither nirgends auf der Website erwaehnt —
 * die Saetze dazu liegen ungerendert in content/practice.ts.
 */
export function AppointmentsPage() {
  const t = getTranslator();

  return (
    <PageShell routeKey="appointments" notice={<NextVacationBanner />}>
      <section className="page-hero page-hero--muted">
        <div className="container page-hero__inner">
          <h1 className="page-hero__title">{t('appointments.title')}</h1>
          <p className="page-hero__lead">{t('appointments.lead')}</p>
        </div>
      </section>

      {/* 1. Die beiden Wege. Traeger der Karten ist die UHRZEIT, nicht die
             Ueberschrift: wer die Seite ueberfliegt, sucht genau diese Zahl.
             Deshalb steht ueber ihnen auch keine Ueberschrift mehr: "Termin
             vereinbaren" wiederholte nur die <h1> "Termine" zwei Zeilen
             darunter — von der Praxis im September 2026 gestrichen, wie die
             Kurzzeile "So kommen Sie zu uns" ueber dem Titel. */}
      <Section className="appointment-ways">
        <div className="appointment-ways__grid">
          <article className="way">
            <p className="way__head">
              <Calendar className="icon way__icon" />
              <span className="way__title">{t('appointments.onlineTitle')}</span>
            </p>
            <p className="way__when">{t('appointments.onlineWhen')}</p>
            <p className="way__scope">{t('appointments.forToday')}</p>
            <p className="way__body">{practice.appointments.onlineAudience}</p>
          </article>

          {/* Die Telefon-Karte spiegelt die Online-Karte: dort steht, fuer wen
              der Weg gedacht ist ("bereits bekannte Patientinnen und
              Patienten"), hier steht das Gegenstueck.
              Bis September 2026 stand unter beiden Karten ein ganzer Absatz
              dazu ("Patientinnen und Patienten, die unsere Praxis-App noch
              nicht nutzen, melden sich bitte telefonisch unter ... bei uns.").
              Die Praxis hat ihn gestrichen; die Aussage ist in drei Woerter
              in die Karte gewandert, wo sie beim Vergleich der beiden Wege
              ohnehin gebraucht wird. Massgeblich bleibt die APP-NUTZUNG, nicht
              "neu in der Praxis" — so von der Praxis ausdruecklich korrigiert. */}
          <article className="way">
            <p className="way__head">
              <Phone className="icon way__icon" />
              <span className="way__title">{t('appointments.phoneTitle')}</span>
            </p>
            <p className="way__when">{t('appointments.phoneWhen')}</p>
            <p className="way__scope">{t('appointments.forToday')}</p>
            <p className="way__body">{t('appointments.phoneNoApp')}</p>
            <p className="way__body">
              <a className="way__phone" href={practice.phoneHref}>
                {practice.phone}
              </a>
            </p>
          </article>
        </div>
      </Section>

      {/* 2. Videosprechstunde — bewusst KEINE dritte Karte neben den beiden
             Wegen: sie ist kein Weg, einen Termin zu bekommen, sondern eine
             Behandlungsform, die ueber genau dieselben zwei Wege vereinbart
             wird. Als gleichrangige Karte haette sie eine dritte Uhrzeit
             suggeriert, die es nicht gibt. */}
      <Section
        className="appointment-video"
        title={t('appointments.videoTitle')}
        tone="surface"
      >
        {/* Ohne eigene Ueberschrift: die traegt der Abschnitt darueber. Das
            Symbol bleibt als Schmuck, der Text steht daneben. */}
        <div className="way way--offer appointment-video__panel">
          <Video className="icon appointment-video__icon" />
          <p className="way__body">{practice.appointments.videoLine}</p>
        </div>
      </Section>

      {/* 3. Die zwei Besuchsregeln als Abschluss. Anders als auf der
             Startseite traegt der Abschnitt hier eine SICHTBARE Ueberschrift:
             sie steht am Ende einer langen Seite und muss sich vom
             Videosprechstunden-Band darueber absetzen. */}
      <Section className="appointment-rules" title={t('appointments.rulesTitle')}>
        <VisitRules />
      </Section>

    </PageShell>
  );
}
