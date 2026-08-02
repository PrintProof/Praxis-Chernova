import type {SubstitutePractice, VacationPeriod} from '@/content/practice';

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
 * Läuft der Zeitraum am Stichtag bereits? (start <= heute <= end, inklusiv)
 *
 * Unterscheidet auf Start- und Kontaktseite die Beschriftung des Hinweisbands
 * ("Praxis derzeit geschlossen" statt "Praxisurlaub") und wählt in der
 * Übersicht die Statusmarke.
 */
export function isOngoing(period: VacationPeriod, now: Date): boolean {
  const today = startOfDay(now).getTime();

  return parseIsoDate(period.start).getTime() <= today && parseIsoDate(period.end).getTime() >= today;
}

/** Zwei Vertretungen gelten als dieselbe, wenn Name und Rufnummer übereinstimmen. */
function isSameSubstitute(a: SubstitutePractice, b: SubstitutePractice): boolean {
  const norm = (value?: string) => (value ?? '').trim().toLowerCase();

  return norm(a.name) === norm(b.name) && norm(a.phone) === norm(b.phone);
}

/**
 * Fasst Zeiträume mit identischem Start- UND Enddatum zu einem einzigen
 * zusammen und hängt deren Vertretungen aneinander.
 *
 * WARUM ES DAS GIBT
 * -----------------
 * Bis August 2026 kannte das Pages-CMS-Formular nur EINE Vertretung je
 * Zeitraum (`substitute`, Einzahl). Das Praxisteam hat sich beholfen, indem es
 * denselben Urlaub mehrfach angelegt hat — einen Eintrag je Vertretungspraxis.
 * Auf der Website erschien das als mehrere getrennte Urlaube.
 *
 * Das Formular erlaubt inzwischen mehrere Vertretungen pro Zeitraum, aber die
 * bereits erfassten Daten bleiben in der alten Form, und niemand soll sie von
 * Hand nachpflegen müssen. Deshalb wird hier zusammengeführt statt migriert:
 * die Anzeige ist damit unabhängig davon, auf welchem Weg die Daten entstanden.
 *
 * Reihenfolge bleibt die der ersten Nennung. Hinweise werden nicht verworfen:
 * unterschiedliche Texte werden aneinandergehängt, gleiche nur einmal
 * übernommen.
 */
export function mergePeriodsByRange(periods: VacationPeriod[]): VacationPeriod[] {
  const byRange = new Map<string, {period: VacationPeriod; substitutes: SubstitutePractice[]; notes: string[]}>();

  for (const period of periods) {
    const key = `${period.start}|${period.end}`;
    const entry = byRange.get(key);
    const note = period.note?.trim();

    if (!entry) {
      byRange.set(key, {
        period,
        substitutes: [...(period.substitutes ?? [])],
        notes: note ? [note] : []
      });
      continue;
    }

    for (const substitute of period.substitutes ?? []) {
      if (!entry.substitutes.some((known) => isSameSubstitute(known, substitute))) {
        entry.substitutes.push(substitute);
      }
    }

    if (note && !entry.notes.includes(note)) {
      entry.notes.push(note);
    }
  }

  return [...byRange.values()].map(({period, substitutes, notes}) => ({
    ...period,
    substitutes: substitutes.length > 0 ? substitutes : undefined,
    note: notes.length > 0 ? notes.join(' ') : undefined
  }));
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

/**
 * Der nächste noch nicht beendete Urlaub — laufend oder zukünftig — oder null.
 *
 * Bewusst OHNE die 2-Wochen-Grenze von `getImminentVacation`: das kompakte
 * Hinweisband auf Start- und Kontaktseite soll den nächsten Zeitraum immer
 * zeigen, auch wenn er noch Monate entfernt ist (Kundenentscheidung).
 * Da `getUpcomingVacations` nach start sortiert, steht ein bereits laufender
 * Urlaub (start in der Vergangenheit) automatisch vorn.
 */
export function getNextOrCurrentVacation(
  periods: VacationPeriod[],
  now: Date
): VacationPeriod | null {
  return getUpcomingVacations(periods, now)[0] ?? null;
}

/**
 * Erster Tag NACH dem Urlaub, an dem die Praxis wirklich Sprechstunde hat —
 * als lokale Mitternacht.
 *
 * Gerechnet wird ab `end + 1 Tag`; Tage OHNE Sprechzeit werden übersprungen.
 * Endet ein Urlaub an einem Freitag, ist der Rückkehrtag also der Montag und
 * nicht der Samstag — sonst würden Patientinnen und Patienten auf einen Tag
 * bestellt, an dem niemand in der Praxis ist.
 *
 * `openWeekdays` enthält die Wochentage mit Sprechstunde als
 * `Date.getDay()`-Werte (0 = Sonntag, 1 = Montag …). Die Funktion bleibt
 * dadurch datenfrei und testbar; die echten Sprechtage bindet
 * `lib/vacations.ts` aus `practice.openingHours`.
 *
 * Ist die Menge leer (theoretischer Fall: keine Sprechzeiten gepflegt), gibt
 * es keinen sinnvollen Sprechtag — dann bleibt es bei `end + 1 Tag`. Die
 * Schleife läuft aus demselben Grund höchstens sieben Schritte.
 */
export function getReturnDate(
  period: VacationPeriod,
  openWeekdays: ReadonlySet<number>
): Date {
  const end = parseIsoDate(period.end);
  const firstDayAfter = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1);

  for (let offset = 0; offset < 7; offset += 1) {
    const candidate = new Date(
      firstDayAfter.getFullYear(),
      firstDayAfter.getMonth(),
      firstDayAfter.getDate() + offset
    );

    if (openWeekdays.has(candidate.getDay())) {
      return candidate;
    }
  }

  return firstDayAfter;
}

/**
 * Deutsche Wochentagsnamen, indiziert über `Date.getDay()` (0 = Sonntag).
 *
 * Bewusst als feste Tabelle statt über `Intl`: das Ergebnis ist damit
 * unabhängig von der ICU-Ausstattung der Laufzeit und im Test exakt
 * vorhersagbar. `messages/de.json` scheidet als Quelle aus, weil dort nur
 * die fünf Sprechtage Montag–Freitag stehen, ein Urlaubsende aber auf jeden
 * beliebigen Wochentag fallen kann.
 */
const weekdayNames = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag'
] as const;

/** Deutscher Wochentagsname eines Datums, z.B. "Montag". */
export function formatWeekday(date: Date): string {
  return weekdayNames[date.getDay()];
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/** Deutsches Datumsformat DD.MM.YYYY. */
export function formatDate(date: Date): string {
  return `${pad2(date.getDate())}.${pad2(date.getMonth() + 1)}.${String(date.getFullYear())}`;
}

function formatGermanDate(iso: string): string {
  return formatDate(parseIsoDate(iso));
}

/**
 * Bausteine für den Satz "Ab {weekday}, den {date} sind wir wieder für Sie da."
 * Der Satz selbst steht in `messages/de.json`; hier entsteht nur das Datum.
 *
 * `openWeekdays` wird unverändert an `getReturnDate` durchgereicht — genannt
 * wird also immer ein Tag mit Sprechstunde.
 */
export function formatReturnDate(
  period: VacationPeriod,
  openWeekdays: ReadonlySet<number>
): {weekday: string; date: string} {
  const returnDate = getReturnDate(period, openWeekdays);

  return {
    weekday: formatWeekday(returnDate),
    date: formatDate(returnDate)
  };
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

/**
 * Aufsteigend sortierte, eindeutige START-Jahre aller anstehenden Urlaube.
 *
 * Grundlage für die Überschrift der Jahresübersicht: liegt alles in genau
 * einem Jahr, darf die Überschrift die Jahreszahl nennen ("Schließzeiten
 * 2026"); reichen die Zeiträume über den Jahreswechsel, wäre eine einzelne
 * Jahreszahl falsch und die Überschrift bleibt allgemein.
 *
 * Bewusst über den START gebildet: ein Urlaub vom 23.12. bis 01.01. wird dem
 * Jahr zugeordnet, in dem er beginnt — so, wie ihn auch das Praxisteam
 * einplant.
 */
export function getVacationYears(periods: VacationPeriod[], now: Date): number[] {
  const years = getUpcomingVacations(periods, now).map((period) =>
    parseIsoDate(period.start).getFullYear()
  );

  return [...new Set(years)].sort((a, b) => a - b);
}
