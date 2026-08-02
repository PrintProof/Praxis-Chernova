import {Clock, Info, Prescription} from '@/components/illustrations';
import {NextVacationBanner} from '@/components/next-vacation-banner';
import {PageShell} from '@/components/page-shell';
import {PhoneSentence} from '@/components/phone-sentence';
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
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">{t('prescriptions.eyebrow')}</p>
          <h1 className="page-hero__title">{t('prescriptions.title')}</h1>
          <p className="page-hero__lead">{t('prescriptions.lead')}</p>
        </div>
      </section>

      {/* Rufnummer und Erreichbarkeit zuerst — das ist die Information, wegen
          der die meisten hier landen. */}
      <Section className="prescription-intro" titleHidden title={t('prescriptions.phoneLabel')}>
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
      </Section>

      <Section className="prescription-how" title={t('prescriptions.howTitle')} tone="surface">
        <PhoneSentence
          className="prescription-how__body"
          linkClassName="prescription-how__phone"
          text={practice.prescriptionNotes.orderLine}
          href={practice.prescriptionPhoneHref}
          display={practice.prescriptionPhoneDisplay}
        />

        {/* Voraussetzung fuers eRezept. Steht bewusst hier, direkt beim
            Anfordern — wer sie erst weiter unten liest, hat schon angefordert. */}
        <div className="note prescription-how__note">
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
