import {AlertCircle, Mask} from '@/components/illustrations';
import {practice} from '@/content/practice';
import {getTranslator} from '@/lib/i18n';

/**
 * Die zwei Regeln zum Praxisbesuch: Terminpflicht und Hygienehinweis.
 *
 * Beide standen bis August 2026 nur auf /termine, dann nur auf der Startseite.
 * Die Praxis wollte sie danach ausdruecklich an BEIDEN Orten haben: wer zum
 * Buchen direkt auf /termine landet, soll dort am Seitenende noch einmal
 * lesen, dass man nur mit Termin und bei Erkaeltung nur mit Maske kommt.
 *
 * Genau dafuer gibt es diese Komponente. Die Ein-Ort-Regel aus CLAUDE.md
 * bleibt gewahrt, wo sie zaehlt: die Saetze selbst existieren weiterhin genau
 * einmal im Repo (`practice.appointments.byAppointmentOnly`, `practice.maskNote`
 * und die Ueberschriften in messages/de.json) — sie koennen nicht auseinander-
 * laufen. Wiederholt wird die Darstellung, nicht der Inhalt.
 *
 * Die Komponente rendert bewusst NUR die zwei Kaesten, nicht die umgebende
 * `<Section>`: Flaeche, Position und Ueberschrift entscheidet jede Seite
 * selbst (Startseite: Ueberschrift nur fuer Screenreader, /termine: sichtbar).
 *
 * Sand traegt die verbindliche Regel, der ruhigere `.note`-Kasten den
 * Hygienehinweis — zwei gleich laute Kaesten uebereinander heben sich
 * gegenseitig auf.
 */
export function VisitRules() {
  const t = getTranslator();

  return (
    <>
      <div className="callout visit-rules__rule">
        <p className="callout__title">
          <AlertCircle className="icon icon--sm callout__icon" />
          <span>{t('home.rules.appointmentOnly')}</span>
        </p>
        <p className="callout__body">{practice.appointments.byAppointmentOnly}</p>
      </div>

      <div className="note visit-rules__mask">
        <p className="note__title">
          <Mask className="icon note__icon" />
          <span>{t('home.rules.mask')}</span>
        </p>
        <p className="note__body">{practice.maskNote}</p>
        <p className="note__thanks">{t('home.rules.thanks')}</p>
      </div>
    </>
  );
}
