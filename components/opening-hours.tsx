import {practice} from '@/content/practice';
import {getTranslator} from '@/lib/i18n';

/**
 * Zerlegt "08:00-13:00, 16:00-18:00" in die einzelnen Zeitbloecke.
 * Rein formal: die Zeichenketten selbst bleiben unveraendert, es wird nichts
 * umformatiert und nichts hinzugedichtet.
 */
function splitSlots(value: string) {
  return value
    .split(',')
    .map((slot) => slot.trim())
    .filter((slot) => slot.length > 0);
}

/**
 * Sprechzeiten als Definitionsliste (Tag -> Uhrzeit).
 *
 * Die Komponente rendert ausschliesslich die Datenliste. Ueberschrift und
 * Erklaersatz liegen in der umgebenden <Section> auf der Kontaktseite — so
 * gibt es fuer beides genau eine Quelle.
 *
 * KEIN "heute"-Marker: die Seite wird statisch exportiert (`output: 'export'`).
 * Ein zur Build-Zeit berechneter Wochentag waere ab dem naechsten Tag falsch
 * und wuerde Patientinnen und Patienten in die Irre fuehren; eine
 * client-seitige Hervorhebung scheidet aus (kein Browser-JavaScript).
 *
 * Tage mit zwei Sprechzeiten (Montag, Donnerstag) werden in ihre Bloecke
 * zerlegt und mit Abstand gesetzt. So sieht man den Unterschied zu den
 * uebrigen Tagen sofort, ohne dass ein Wort erfunden werden muesste.
 */
export function OpeningHours() {
  const t = getTranslator();

  return (
    <dl className="hours-list" aria-label={t('contact.hours.ariaLabel')}>
      {practice.openingHours.map((entry) => (
        <div key={entry.dayKey} className="hours-list__row">
          <dt className="hours-list__day">{t(`days.${entry.dayKey}`)}</dt>
          <dd className="hours-list__time contact-hours__times">
            {splitSlots(entry.value).map((slot, index) => (
              <span key={`${entry.dayKey}-${index}`} className="contact-hours__slot">
                {slot}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
