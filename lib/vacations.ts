import type {OpeningHoursEntry, VacationPeriod} from '@/content/practice';
import {getVacationPeriods, practice} from '@/content/practice';
import {
  formatReturnDate as formatReturnDateFor,
  getImminentVacation,
  getNextOrCurrentVacation,
  getReturnDate as getReturnDateFor,
  getUpcomingVacations,
  getVacationYears,
  mergePeriodsByRange
} from '@/lib/vacation-logic';

/**
 * lib/vacations.ts — die Brücke zwischen der reinen Logik und den echten Daten.
 *
 * `lib/vacation-logic.ts` bleibt frei von Daten und von React und ist damit
 * direkt mit `node lib/vacation-logic.test.ts` prüfbar. Hier — und nur hier —
 * werden die vom Praxisteam über Pages CMS gepflegten Zeiträume aus
 * `content/vacation.json` (via `content/practice.ts`) eingebunden.
 * Ist die Datei leer oder fehlerhaft, liefert `getVacationPeriods()` eine leere Liste;
 * alle Funktionen liefern dann sauber `[]` bzw. `null`.
 */

export {
  formatCompactRange,
  formatDate,
  formatVacationRange,
  formatWeekday,
  isOngoing,
  telHref,
  vacationListYear
} from '@/lib/vacation-logic';

/**
 * Die gepflegten Zeiträume, aufbereitet für die Anzeige.
 *
 * `mergePeriodsByRange` fasst Einträge mit identischem Zeitraum zusammen. Das
 * Praxisteam hat mehrere Vertretungen früher als mehrere Urlaube mit demselben
 * Datum erfasst, weil das CMS-Formular nur eine Vertretung zuließ — so wird
 * daraus wieder EIN Urlaub mit allen Vertretungen. Siehe vacation-logic.ts.
 */
function displayPeriods(): VacationPeriod[] {
  return mergePeriodsByRange(getVacationPeriods());
}

/**
 * `Date.getDay()`-Werte der fünf Sprechtage. Die Zuordnung ist die einzige
 * Stelle, an der ein `dayKey` aus `content/practice.ts` zu einer Zahl wird.
 */
const weekdayIndexByDayKey: Record<OpeningHoursEntry['dayKey'], number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5
};

/**
 * Die Wochentage MIT Sprechstunde, abgeleitet aus `practice.openingHours`.
 *
 * Damit gibt es genau eine Quelle dafür, wann die Praxis geöffnet ist: trägt
 * das Praxisteam einen Tag aus oder nach, wandert der genannte Rückkehrtag
 * automatisch mit. Aktuell Montag bis Freitag — samstags und sonntags ist die
 * Praxis geschlossen.
 */
const openWeekdays: ReadonlySet<number> = new Set(
  practice.openingHours.map((entry) => weekdayIndexByDayKey[entry.dayKey])
);

/**
 * Erster Sprechtag nach dem Urlaub — mit den echten Sprechtagen der Praxis.
 * Überspringt Tage ohne Sprechzeit (siehe `getReturnDate` in vacation-logic).
 */
export function getReturnDate(period: VacationPeriod): Date {
  return getReturnDateFor(period, openWeekdays);
}

/** Wochentag und Datum des ersten Sprechtags nach dem Urlaub. */
export function formatReturnDate(period: VacationPeriod): {weekday: string; date: string} {
  return formatReturnDateFor(period, openWeekdays);
}

/**
 * Alle noch nicht beendeten Urlaube (end >= heute), nach start aufsteigend.
 * Datenquelle der vollständigen Übersicht auf /aktuelles.
 */
export function getUpcomingVacationsNow(now: Date): VacationPeriod[] {
  return getUpcomingVacations(displayPeriods(), now);
}

/**
 * Der nächste oder gerade laufende Urlaub — ohne Zeitgrenze — oder null.
 * Datenquelle des kompakten Hinweisbands auf Start- und Kontaktseite.
 */
export function getNextOrCurrentVacationNow(now: Date): VacationPeriod | null {
  return getNextOrCurrentVacation(displayPeriods(), now);
}

/**
 * Der unmittelbar anstehende Urlaub gemäß 2-Wochen-Regel oder null.
 * Bleibt erhalten, damit vorhandene Aufrufer nicht brechen; das Hinweisband
 * benutzt inzwischen `getNextOrCurrentVacationNow`.
 */
export function getImminentVacationNow(now: Date): VacationPeriod | null {
  return getImminentVacation(displayPeriods(), now);
}

/**
 * Start-Jahre aller anstehenden Urlaube, aufsteigend und ohne Wiederholung.
 * Entscheidet, ob die Jahresübersicht eine Jahreszahl in der Überschrift
 * tragen darf.
 */
export function getVacationYearsNow(now: Date): number[] {
  return getVacationYears(displayPeriods(), now);
}
