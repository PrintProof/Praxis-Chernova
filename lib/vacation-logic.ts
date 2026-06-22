import type {VacationPeriod} from '@/content/practice';

/**
 * Parst ein ISO-Datum (YYYY-MM-DD) robust über Jahr/Monat/Tag-Ganzzahlen.
 * Vermeidet Zeitzonen-Überraschungen, indem die lokale Mitternacht verwendet wird.
 */
export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map((part) => Number.parseInt(part, 10));
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

/**
 * Reduziert ein beliebiges Date auf die lokale Mitternacht desselben Kalendertags.
 */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Liefert alle Urlaubsperioden, deren end-Datum noch nicht vorbei ist
 * (end >= heute), aufsteigend nach start-Datum sortiert. Grenzen inklusiv.
 */
export function getUpcomingVacations(periods: VacationPeriod[], now: Date): VacationPeriod[] {
  const today = startOfDay(now).getTime();

  return periods
    .filter((period) => parseIsoDate(period.end).getTime() >= today)
    .slice()
    .sort((a, b) => parseIsoDate(a.start).getTime() - parseIsoDate(b.start).getTime());
}

/**
 * Liefert den unmittelbar anstehenden Urlaub gemäß 2-Wochen-Regel:
 * unter den noch nicht beendeten Urlauben (end >= heute) diejenigen mit
 * start <= heute + 14 Tage, davon der mit frühestem start. Sonst null.
 * Schließt einen gerade laufenden Urlaub ein (start in der Vergangenheit).
 * Alle Grenzen inklusiv.
 */
export function getImminentVacation(periods: VacationPeriod[], now: Date): VacationPeriod | null {
  const today = startOfDay(now);
  const horizon = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14).getTime();

  const upcoming = getUpcomingVacations(periods, now);

  for (const period of upcoming) {
    if (parseIsoDate(period.start).getTime() <= horizon) {
      return period;
    }
  }

  return null;
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function formatGermanDate(iso: string): string {
  const date = parseIsoDate(iso);
  return `${pad2(date.getDate())}.${pad2(date.getMonth() + 1)}.${String(date.getFullYear())}`;
}

function formatDayMonth(iso: string): string {
  const date = parseIsoDate(iso);
  return `${pad2(date.getDate())}.${pad2(date.getMonth() + 1)}.`;
}

/**
 * Kompaktes Format für die Übersichtszeile:
 * "DD.MM.-DD.MM." bzw. "DD.MM." bei start === end.
 */
export function formatCompactRange(period: VacationPeriod): string {
  const start = formatDayMonth(period.start);

  if (period.start === period.end) {
    return start;
  }

  return `${start}-${formatDayMonth(period.end)}`;
}

/**
 * Formatiert den Zeitraum einer Periode im deutschen Format
 * DD.MM.YYYY – DD.MM.YYYY (mit Gedankenstrich). Bei start === end
 * wird nur ein einzelnes Datum ausgegeben.
 */
export function formatVacationRange(period: VacationPeriod): string {
  const start = formatGermanDate(period.start);

  if (period.start === period.end) {
    return start;
  }

  return `${start} – ${formatGermanDate(period.end)}`;
}

/**
 * Baut aus einer Klartext-Telefonnummer einen tel:-Link.
 *
 * Es werden alle Zeichen außer Ziffern und einem führenden '+' entfernt.
 * Eine führende '0' (typische deutsche Schreibweise) wird zu '+49' normalisiert.
 * Beispiel: "0521 123456" -> "tel:+49521123456".
 */
export function telHref(phone: string): string {
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');

  if (hasPlus) {
    return `tel:+${digits}`;
  }

  if (digits.startsWith('0')) {
    return `tel:+49${digits.slice(1)}`;
  }

  return `tel:${digits}`;
}

/**
 * Jahr des ersten anstehenden Urlaubs (für das Übersichts-Label),
 * sonst null, wenn keine anstehenden Urlaube vorliegen.
 */
export function vacationListYear(periods: VacationPeriod[], now: Date): number | null {
  const upcoming = getUpcomingVacations(periods, now);

  if (upcoming.length === 0) {
    return null;
  }

  return parseIsoDate(upcoming[0].start).getFullYear();
}
