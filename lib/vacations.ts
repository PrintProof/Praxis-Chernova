import type {VacationPeriod} from '@/content/practice';
import {vacationPeriods} from '@/content/practice';

/**
 * Parst ein ISO-Datum (YYYY-MM-DD) robust über Jahr/Monat/Tag-Ganzzahlen.
 * Vermeidet Zeitzonen-Überraschungen, indem die lokale Mitternacht verwendet wird.
 */
function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map((part) => Number.parseInt(part, 10));
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

/**
 * Liefert alle Urlaubsperioden, deren end-Datum noch nicht vorbei ist
 * (end >= heute), aufsteigend nach start-Datum sortiert.
 */
export function getActiveVacationPeriods(now: Date): VacationPeriod[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return vacationPeriods
    .filter((period) => parseIsoDate(period.end).getTime() >= today.getTime())
    .slice()
    .sort((a, b) => parseIsoDate(a.start).getTime() - parseIsoDate(b.start).getTime());
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

function formatGermanDate(iso: string): string {
  const date = parseIsoDate(iso);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${day}.${month}.${year}`;
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
