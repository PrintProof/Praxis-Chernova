import type {VacationPeriod} from '@/content/practice';
import {vacationPeriods} from '@/content/practice';
import {getImminentVacation, getUpcomingVacations} from '@/lib/vacation-logic';

export {
  formatCompactRange,
  formatVacationRange,
  telHref,
  vacationListYear
} from '@/lib/vacation-logic';

/**
 * Alle noch nicht beendeten Urlaube (end >= heute), nach start aufsteigend.
 * Bindet die echten CMS-Daten aus `content/practice.ts`.
 */
export function getUpcomingVacationsNow(now: Date): VacationPeriod[] {
  return getUpcomingVacations(vacationPeriods, now);
}

/**
 * Der unmittelbar anstehende Urlaub gemäß 2-Wochen-Regel oder null.
 * Bindet die echten CMS-Daten aus `content/practice.ts`.
 */
export function getImminentVacationNow(now: Date): VacationPeriod | null {
  return getImminentVacation(vacationPeriods, now);
}
