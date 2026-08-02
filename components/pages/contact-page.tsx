import Link from 'next/link';

import {EmergencyService} from '@/components/emergency-service';
import {Calendar} from '@/components/illustrations';
import {NextVacationBanner} from '@/components/next-vacation-banner';
import {OpeningHours} from '@/components/opening-hours';
import {PageShell} from '@/components/page-shell';
import {Section} from '@/components/section';
import {practice} from '@/content/practice';
import {getTranslator} from '@/lib/i18n';
import {getPath} from '@/lib/routing';

/**
 * Kontakt & Anfahrt — der kanonische Ort fuer alle Kontaktdaten, die
 * Sprechzeiten, die Anfahrt und die organisatorischen Ablaeufe.
 *
 * Gestaltungsentscheidungen, die hier bewusst getroffen sind:
 *
 * 1. HIERARCHIE STATT KACHELREIHE. Die Hauptnummer ist der wichtigste Weg und
 *    bekommt als einziges Element der Seite eine Flaeche und die groesste
 *    Schrift. Rezepttelefon und Fax stehen als Nebenanschluesse rechts
 *    daneben, nur durch eine Haarlinie getrennt. Frueher standen alle vier
 *    Angaben als gleich grosse weisse Kaertchen nebeneinander — genau das ist
 *    die kritisierte Optik.
 *
 * 2. JEDE SEKTION SIEHT ANDERS AUS. Kontaktwege = Flaeche + Haarlinien,
 *    Sprechzeiten = Definitionsliste mit Zebra, Anfahrt = grosser Adressblock
 *    neben einer Aktion, Organisatorisches = zweispaltige Linienliste.
 *    Kein wiederholtes Raster.
 *
 * 3. KEINE DEKORATIVEN ICONS. Ein Telefonhoerer neben "Telefon" und eine Uhr
 *    neben "Sprechzeiten" wiederholen nur das Wort. Die Seite kommt ohne
 *    Piktogramme aus; die Illustrationen bleiben Start, Leistungen und
 *    Aktuelles vorbehalten.
 *
 * 4. NUR EIN PRIMAERBUTTON WAERE HIER FALSCH: Online-Buchung und
 *    Rezepttelefon sind beides Zusatzwege und stehen deshalb als
 *    Sekundaerbuttons. Die Hauptaktion ist die grosse Rufnummer selbst.
 *
 * Alle Rufnummern, die Anschrift und die Ablauftexte kommen ausschliesslich
 * aus content/practice.ts. In messages/de.json steht dazu nur die Beschriftung.
 */
export function ContactPage() {
  const t = getTranslator();

  return (
    <PageShell routeKey="contact" notice={<NextVacationBanner />}>
      <section className="page-hero page-hero--muted">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">{t('contact.eyebrow')}</p>
          <h1 className="page-hero__title">{t('contact.title')}</h1>
          <p className="page-hero__lead">{t('contact.lead')}</p>
        </div>
      </section>

      {/* --- Telefon und Fax --------------------------------------------- */}
      <Section title={t('contact.channels.title')}>
        <ul className="contact-channels" role="list" aria-label={t('contact.channels.ariaLabel')}>
          <li className="contact-channels__item contact-channels__item--primary phone-line">
            <h3 className="contact-channels__label">{t('contact.channels.phone.title')}</h3>
            <a className="phone-line__number" href={practice.phoneHref}>
              {practice.phone}
            </a>
            <p className="phone-line__description">{t('contact.channels.phone.description')}</p>
          </li>

          <li className="contact-channels__item contact-channels__item--minor phone-line">
            <h3 className="contact-channels__label">
              {t('contact.channels.prescriptionPhone.title')}
            </h3>
            <a className="phone-line__number" href={practice.prescriptionPhoneHref}>
              {practice.prescriptionPhoneDisplay}
            </a>
            <p className="phone-line__description">
              {t('contact.channels.prescriptionPhone.description')}
            </p>
          </li>

          {/* Fax bewusst ohne tel:-Link und ohne Erklaersatz: es gibt keine
              belegte Nutzungsregel dazu, und erfinden werde ich keine. */}
          <li className="contact-channels__item contact-channels__item--minor phone-line">
            <h3 className="contact-channels__label">{t('contact.channels.fax.title')}</h3>
            <p className="phone-line__number phone-line__number--static">{practice.fax}</p>
          </li>
        </ul>
      </Section>

      {/* --- Sprechzeiten -------------------------------------------------- */}
      <Section
        className="contact-hours"
        title={t('contact.hours.title')}
        tone="surface"
        headerExtra={
          <>
            <p className="section__description">{t('contact.hours.description')}</p>
            <Link className="link link--arrow" href={getPath('news')}>
              {t('cta.toNews')}
            </Link>
          </>
        }
      >
        <OpeningHours />
      </Section>

      {/* --- Adresse & Anfahrt --------------------------------------------- */}
      <Section
        className="contact-directions"
        title={t('contact.directions.title')}
        ariaLabel={t('contact.directions.ariaLabel')}
      >
        <div className="contact-directions__layout">
          <address className="address contact-directions__address">
            <span className="visually-hidden">{t('contact.directions.addressLabel')}: </span>
            {practice.address.street}
            <br />
            {practice.address.postalCode} {practice.address.city}-{practice.address.district}
          </address>

          {/* Keine eingebettete Karte, kein iframe: die Verbindung zu Google
              entsteht erst durch den bewussten Klick (DSGVO). */}
          <div className="contact-directions__action">
            <div className="button-row">
              <a
                className="button button--secondary"
                href={practice.mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                {t('cta.openRoute')}
                <span className="visually-hidden"> ({t('accessibility.newTabHint')})</span>
              </a>
            </div>
            <p className="hint">{t('cta.openRouteHint')}</p>
          </div>
        </div>
      </Section>

      {/* --- Organisatorisches --------------------------------------------- */}
      {/* Papierband statt Salbeiband: der anschliessende Notdienst-Block
          (gemeinsame Komponente) ist selbst `muted`. Zwei Salbeibaender
          direkt hintereinander wuerden zu einem einzigen verschmelzen. */}
      <Section className="contact-processes" title={t('contact.processes.title')} tone="surface">
        <ul className="rule-list rule-list--split" role="list">
          <li className="rule-list__item">
            <h3 className="rule-list__title">{t('contact.processes.appointments.title')}</h3>
            <div className="contact-processes__body">
              {/* Die verbindliche Regel steht auch hier — wer auf /kontakt
                  landet, darf nicht erst zur Startseite muessen, um zu
                  erfahren, dass es ohne Termin nicht geht. Ein Satz, EINE
                  Quelle (content/practice.ts), kann nicht auseinanderlaufen.
                  Die beiden Wege mit ihren Zeitfenstern werden NICHT
                  wiederholt; dorthin fuehrt der Link darunter. */}
              <p className="rule-list__body">{practice.appointments.byAppointmentOnly}</p>
              <p className="rule-list__body">
                <Link className="link--arrow" href={`${getPath('home')}#termin`}>
                  {t('contact.processes.appointments.link')}
                </Link>
              </p>
              <div className="button-row">
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
              <div className="contact-processes__hints">
                <p className="hint">{t('cta.bookOnlineHint')}</p>
                <p className="hint">{t('cta.newPatientsHint')}</p>
              </div>
            </div>
          </li>

          <li className="rule-list__item">
            <h3 className="rule-list__title">{t('contact.processes.prescriptions.title')}</h3>
            <div className="contact-processes__body">
              <p className="rule-list__body">{practice.prescriptionNotes.orderLine}</p>
              <p className="rule-list__body">{practice.prescriptionNotes.pickupLine}</p>
              <div className="button-row">
                <a
                  className="button button--secondary"
                  href={practice.prescriptionPhoneHref}
                  aria-label={t('cta.callPrescriptionAria', {
                    phone: practice.prescriptionPhoneDisplay
                  })}
                >
                  {t('cta.callPrescription')}
                </a>
              </div>
            </div>
          </li>

          <li className="rule-list__item">
            <h3 className="rule-list__title">{t('contact.processes.houseCalls.title')}</h3>
            <div className="contact-processes__body">
              <p className="rule-list__body">{practice.houseCallsNote}</p>
            </div>
          </li>
        </ul>
      </Section>

      {/* Steht bewusst am Seitenende: genau dort merkt jemand, dass die Praxis
          gerade nicht erreichbar ist. Gleiche Komponente wie auf /aktuelles,
          hier aber als Kurzfassung — beide Nummern als Anrufziele in einer
          Zeile. Vorher endeten /kontakt und /aktuelles zeichengleich mit
          denselben zwei Sandkaesten; die Vollansicht mit Erklaerung gehoert
          auf /aktuelles, wo die Praxis geschlossen ist. */}
      <EmergencyService variant="compact" />
    </PageShell>
  );
}
