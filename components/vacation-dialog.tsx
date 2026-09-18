import Link from 'next/link';

import {Close, Info} from '@/components/illustrations';
import {getTranslator} from '@/lib/i18n';
import {getPath} from '@/lib/routing';
import {
  formatReturnDate,
  formatVacationRange,
  getNextOrCurrentVacationNow,
  isOngoing
} from '@/lib/vacations';

/**
 * Der naechste oder gerade laufende Praxisurlaub als Overlay, das sich beim
 * Aufruf der Startseite von selbst zeigt und weggeklickt werden muss.
 *
 * WARUM ES DEN KASTEN UEBERHAUPT GIBT
 * Bis September 2026 stand der Urlaubshinweis ausschliesslich als schmales
 * Sandband unter der Kopfzeile (components/next-vacation-banner.tsx) — bewusst
 * "niemals Modal oder Overlay". Die Praxis hat das im September 2026
 * ausdruecklich geaendert: der Hinweis werde ueberlesen, er solle "aufploppen"
 * und der Nutzer muesse ihn wegklicken. Das Band BLEIBT: nach dem Wegklicken
 * steht der Hinweis weiterhin auf der Seite, sonst waere die Information nach
 * einem Klick verschwunden.
 *
 * KEIN JAVASCRIPT — das ist die eigentliche Arbeit hier.
 * Die Website hat kein einziges 'use client' und laedt kein eigenes Skript in
 * den Browser (siehe CLAUDE.md). Das Overlay ist deshalb eine Checkbox, die im
 * ausgelieferten HTML bereits `checked` ist; Hintergrund und Kasten haengen per
 * Geschwisterselektor an ihrem Zustand. Wer auf den Hintergrund, auf das Kreuz
 * oder auf "Verstanden" klickt, trifft ein <label>, das die Checkbox leert —
 * damit verschwindet das Overlay. Reines CSS, kein Skript, kein Flackern.
 *
 * Die Checkbox steht VOR der Kopfzeile im Dokument und ist zwar unsichtbar,
 * aber fokussierbar: mit der Tastatur ist sie das erste erreichbare Element,
 * Leertaste schliesst. Ihr Fokus faerbt sichtbar den "Verstanden"-Knopf
 * (Selektor in components.css) — sonst waere der Fokus unsichtbar. Sobald sie
 * leer ist, nimmt CSS sie per `display: none` aus der Tabulatorreihenfolge;
 * ein unsichtbares Bedienelement soll nicht fuer immer im Weg stehen.
 *
 * Bewusst KEIN `aria-modal="true"`: ohne Skript laesst sich der Fokus nicht im
 * Kasten halten, und die Zusage waere damit unwahr. `role="dialog"` mit
 * sprechendem Namen (Label + Zeitraum) genuegt hier.
 *
 * Gibt es keinen anstehenden Urlaub, rendert die Komponente nichts — dann
 * bleibt die Seite ruhig. Dieselbe Datenquelle wie das Band; die beiden
 * koennen nicht auseinanderlaufen.
 */

/** Verbindet Checkbox und alle drei Schliessflaechen (Hintergrund, Kreuz, Knopf). */
const TOGGLE_ID = 'vacation-dialog-toggle';
const LABEL_ID = 'vacation-dialog-label';
const RANGE_ID = 'vacation-dialog-range';

export function VacationDialog() {
  const t = getTranslator();
  const now = new Date();
  const period = getNextOrCurrentVacationNow(now);

  if (!period) {
    return null;
  }

  const running = isOngoing(period, now);
  const back = formatReturnDate(period);

  return (
    <div className="vacation-dialog">
      {/* Im HTML bereits `checked` — deshalb ist der Kasten schon beim ersten
          Bildaufbau da und ploppt nicht nachtraeglich auf. `autoComplete="off"`
          verhindert, dass der Browser den Zustand beim Neuladen wiederherstellt:
          der Hinweis soll bei jedem Aufruf erscheinen, nicht abhaengig davon,
          ob jemand vorher schon einmal hier war. */}
      <input
        type="checkbox"
        id={TOGGLE_ID}
        className="vacation-dialog__toggle"
        defaultChecked
        autoComplete="off"
        aria-label={t('vacation.dialog.closeAria')}
      />

      {/* Klick daneben schliesst. Rein zum Bedienen da, deshalb aria-hidden:
          dieselbe Funktion tragen das Kreuz und der Knopf im Kasten. */}
      <label className="vacation-dialog__backdrop" htmlFor={TOGGLE_ID} aria-hidden="true" />

      <div
        className="vacation-dialog__panel"
        role="dialog"
        aria-labelledby={`${LABEL_ID} ${RANGE_ID}`}
      >
        <label className="vacation-dialog__dismiss" htmlFor={TOGGLE_ID} aria-hidden="true">
          <Close className="icon" />
        </label>

        <p className="vacation-dialog__label" id={LABEL_ID}>
          <Info className="icon icon--sm vacation-dialog__icon" />
          {running ? t('vacation.compact.currentLabel') : t('vacation.compact.upcomingLabel')}
        </p>

        <p className="vacation-dialog__range" id={RANGE_ID}>
          {formatVacationRange(period)}
        </p>

        <p className="vacation-dialog__return">
          {t('closures.vacation.returnLine', {weekday: back.weekday, date: back.date})}
        </p>

        {period.note ? <p className="vacation-dialog__note">{period.note}</p> : null}

        {/* Zuerst der Weg zu den Details (Vertretungen stehen kanonisch auf
            /urlaubszeiten), daneben das Schliessen. Der Link schliesst das
            Overlay nicht selbst — er fuehrt ohnehin auf eine andere Seite. */}
        <div className="vacation-dialog__actions">
          <label className="button button--primary vacation-dialog__confirm" htmlFor={TOGGLE_ID}>
            {t('vacation.dialog.confirm')}
          </label>

          <Link
            className="link link--arrow vacation-dialog__link"
            href={getPath('closures')}
            aria-label={t('vacation.compact.linkAria')}
          >
            {t('vacation.compact.link')}
          </Link>
        </div>
      </div>
    </div>
  );
}
