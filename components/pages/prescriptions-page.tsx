import {Clock, Info, Prescription} from '@/components/illustrations';
import {LinkedSentence} from '@/components/linked-sentence';
import {NextVacationBanner} from '@/components/next-vacation-banner';
import {PageShell} from '@/components/page-shell';
import {Section} from '@/components/section';
import {practice} from '@/content/practice';
import {getTranslator} from '@/lib/i18n';

/**
 * /rezepte — der vollstaendige Ablauf fuer Rezepte und Ueberweisungen.
 *
 * Vorher lag das an zwei Orten: ein grosses Panel auf der Startseite (nur die
 * Rund-um-die-Uhr-Erreichbarkeit) und der Rest unter "Organisatorisches" auf
 * /kontakt. Jetzt steht alles hier, und beide alten Orte verweisen hierher.
 *
 * Der Blickfang bleibt die RUND-UM-DIE-UHR-Erreichbarkeit: sie entlastet die
 * Hauptnummer, die morgens zwischen 7:30 und 8:30 fuer Termine gebraucht wird.
 * Die Aerztin hat ausdruecklich darum gebeten, dass dieser Punkt gut zu sehen
 * ist — deshalb steht er ganz oben und in Lead-Groesse, im Wortlaut der Praxis.
 */
export function PrescriptionsPage() {
  const t = getTranslator();

  return (
    <PageShell routeKey="prescriptions" notice={<NextVacationBanner />}>
      <section className="page-hero page-hero--muted">
        {/* Nur der Titel. Kurzzeile ("Ohne in die Praxis zu kommen") und Lead
            ("Rezepte und Ueberweisungen fordern Sie an, ohne dafuer in die
            Praxis zu kommen.") sind im September 2026 von der Praxis
            gestrichen worden: dreimal derselbe Gedanke uebereinander, zweimal
            woertlich derselbe Titel. Was zu tun ist, sagt der Abschnitt
            darunter — deshalb traegt auch der keine Ueberschrift mehr. */}
        <div className="container page-hero__inner">
          <h1 className="page-hero__title">{t('prescriptions.title')}</h1>
        </div>
      </section>

      {/* Der Anforderungssatz. Beide Wege darin sind anklickbar: die Praxis-App
          fuehrt zu arzt-direkt, die Rufnummer waehlt. Halbfett, damit man den
          Woertern ansieht, dass sie Links sind — ausdruecklicher Wunsch der
          Praxis (September 2026), weil der App-Weg vorher nur Text war. */}
      <Section className="prescription-how">
        <LinkedSentence
          className="prescription-how__body"
          text={practice.prescriptionNotes.orderLine}
          links={[
            {
              token: 'app',
              href: practice.bookingUrl,
              label: t('prescriptions.appLinkLabel'),
              className: 'prescription-how__app',
              external: true
            },
            {
              token: 'phone',
              href: practice.prescriptionPhoneHref,
              label: practice.prescriptionPhoneDisplay,
              className: 'prescription-how__phone'
            }
          ]}
        />
      </Section>

      {/* Danach die Rufnummer mit der Rund-um-die-Uhr-Erreichbarkeit. Sie
          steht bewusst NICHT ganz oben: die Praxis wollte, dass zuerst
          die App kommt. Prominent bleibt sie trotzdem — eigenes Panel,
          Satz in Lead-Groesse.

          DIREKT DARUNTER die Voraussetzung fuers eRezept. Sie stand bis
          September 2026 eine Sektion hoeher, gleich unter dem Anforderungssatz;
          die Praxis wollte sie unter den Rezepttelefon-Block. Das passt auch
          sachlich: die Voraussetzung gilt fuer BEIDE Wege, also gehoert sie
          hinter beide und nicht zwischen sie. */}
      <Section className="prescription-intro" titleHidden title={t('prescriptions.phoneLabel')} tone="surface">
        <div className="prescription-panel">
          <div className="prescription-panel__phone">
            <p className="prescription-panel__label">
              <Prescription className="icon prescription-panel__icon" />
              <span>{t('prescriptions.phoneLabel')}</span>
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
          </div>
        </div>

        <div className="note prescription-intro__note">
          <p className="note__title">
            <Info className="icon note__icon" />
            <span>{t('common.pleaseNote')}</span>
          </p>
          <p className="note__body">{practice.prescriptionNotes.cardRequirement}</p>
        </div>
      </Section>

      <Section className="prescription-timing" title={t('prescriptions.timingTitle')}>
        <p className="prescription-timing__line">
          <Clock className="icon prescription-timing__icon" />
          <span>{practice.prescriptionNotes.processingLine}</span>
        </p>
        <p className="prescription-timing__body">{practice.prescriptionNotes.pickupLine}</p>
      </Section>
    </PageShell>
  );
}
