/**
 * Gründliches Testskript für lib/vacation-logic.ts.
 *
 * Reine Assertions mit synthetischen Daten und festen "now"-Werten.
 * Ausführen mit:
 *   node lib/vacation-logic.test.ts
 * oder (falls der type-only Import stört):
 *   npx --yes tsx lib/vacation-logic.test.ts
 *
 * Am Ende: process.exit(1), wenn mindestens ein Test fehlschlägt.
 */
import {
  getUpcomingVacations,
  getImminentVacation,
  formatCompactRange,
  formatVacationRange,
  telHref,
  vacationListYear,
} from './vacation-logic';

// Lokale Strukturtyp-Definition, damit der Import nicht über den
// '@/content/practice'-Alias laufen muss (Node-direkt-Ausführung).
type Vac = {
  start: string;
  end: string;
  substitute?: {name: string; address: string; phone: string};
  note?: string;
};

// ---------------------------------------------------------------------------
// Mini-Test-Harness
// ---------------------------------------------------------------------------
let passed = 0;
let failed = 0;

function show(value: unknown): string {
  return JSON.stringify(value);
}

function check(name: string, cond: boolean, detail?: string): void {
  if (cond) {
    passed += 1;
    console.log(`PASS: ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL: ${name}${detail ? ` -> ${detail}` : ''}`);
  }
}

function eq<T>(name: string, actual: T, expected: T): void {
  const ok = show(actual) === show(expected);
  check(name, ok, ok ? undefined : `erwartet ${show(expected)}, erhalten ${show(actual)}`);
}

// Hilfsfunktionen, um synthetische Daten relativ zu einem festen "now"
// zu erzeugen. now ist immer lokale Mitternacht.
function day(year: number, month1: number, day1: number): Date {
  return new Date(year, month1 - 1, day1);
}

function iso(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

function isoPlus(now: Date, n: number): string {
  return iso(addDays(now, n));
}

// Fester Referenzpunkt für die meisten Tests.
const NOW = day(2026, 6, 22); // 22.06.2026, lokale Mitternacht

// ---------------------------------------------------------------------------
// 1) Leere Liste
// ---------------------------------------------------------------------------
{
  const periods: Vac[] = [];
  eq('leere Liste -> upcoming []', getUpcomingVacations(periods as any, NOW), []);
  eq('leere Liste -> imminent null', getImminentVacation(periods as any, NOW), null);
  eq('leere Liste -> year null', vacationListYear(periods as any, NOW), null);
}

// ---------------------------------------------------------------------------
// 2) Zukünftiger Urlaub, now > 14 Tage vor start
// ---------------------------------------------------------------------------
{
  // start in 20 Tagen
  const v: Vac = {start: isoPlus(NOW, 20), end: isoPlus(NOW, 27)};
  const periods = [v];
  eq('>14 Tage vor start -> upcoming enthält ihn', getUpcomingVacations(periods as any, NOW), [v]);
  eq('>14 Tage vor start -> imminent null', getImminentVacation(periods as any, NOW), null);
}

// ---------------------------------------------------------------------------
// 3) now exakt 14 Tage vor start (Grenze) -> imminent gesetzt
// ---------------------------------------------------------------------------
{
  const v: Vac = {start: isoPlus(NOW, 14), end: isoPlus(NOW, 21)};
  const periods = [v];
  eq('exakt 14 Tage vor start -> imminent gesetzt', getImminentVacation(periods as any, NOW), v);
  eq('exakt 14 Tage vor start -> upcoming enthält ihn', getUpcomingVacations(periods as any, NOW), [v]);
}

// ---------------------------------------------------------------------------
// 4) now 13 Tage vor start -> imminent gesetzt
// ---------------------------------------------------------------------------
{
  const v: Vac = {start: isoPlus(NOW, 13), end: isoPlus(NOW, 20)};
  const periods = [v];
  eq('13 Tage vor start -> imminent gesetzt', getImminentVacation(periods as any, NOW), v);
}

// 15 Tage vor start -> KEIN imminent (Gegenprobe zur Grenze)
{
  const v: Vac = {start: isoPlus(NOW, 15), end: isoPlus(NOW, 20)};
  const periods = [v];
  eq('15 Tage vor start -> imminent null (Gegenprobe)', getImminentVacation(periods as any, NOW), null);
}

// ---------------------------------------------------------------------------
// 5) now == start (laufend, erster Tag) -> imminent gesetzt, in upcoming
// ---------------------------------------------------------------------------
{
  const v: Vac = {start: iso(NOW), end: isoPlus(NOW, 7)};
  const periods = [v];
  eq('now == start -> imminent gesetzt', getImminentVacation(periods as any, NOW), v);
  eq('now == start -> upcoming enthält ihn', getUpcomingVacations(periods as any, NOW), [v]);
}

// ---------------------------------------------------------------------------
// 6) now zwischen start und end -> imminent gesetzt
// ---------------------------------------------------------------------------
{
  const v: Vac = {start: isoPlus(NOW, -3), end: isoPlus(NOW, 3)};
  const periods = [v];
  eq('now zwischen start und end -> imminent gesetzt', getImminentVacation(periods as any, NOW), v);
  eq('now zwischen start und end -> in upcoming', getUpcomingVacations(periods as any, NOW), [v]);
}

// ---------------------------------------------------------------------------
// 7) now == end (Grenze, inklusiv) -> noch in upcoming UND imminent
// ---------------------------------------------------------------------------
{
  const v: Vac = {start: isoPlus(NOW, -5), end: iso(NOW)};
  const periods = [v];
  eq('now == end -> noch in upcoming', getUpcomingVacations(periods as any, NOW), [v]);
  eq('now == end -> imminent gesetzt', getImminentVacation(periods as any, NOW), v);
}

// ---------------------------------------------------------------------------
// 8) now == end + 1 Tag -> NICHT in upcoming, imminent null
// ---------------------------------------------------------------------------
{
  const v: Vac = {start: isoPlus(NOW, -5), end: isoPlus(NOW, -1)};
  const periods = [v];
  eq('now == end+1 -> nicht in upcoming', getUpcomingVacations(periods as any, NOW), []);
  eq('now == end+1 -> imminent null', getImminentVacation(periods as any, NOW), null);
  eq('now == end+1 -> year null', vacationListYear(periods as any, NOW), null);
}

// ---------------------------------------------------------------------------
// 9) Laufender langer Urlaub (start vor >14 Tagen, end in Zukunft)
//    -> imminent gesetzt (laufender zählt unabhängig von der 14-Tage-Grenze)
// ---------------------------------------------------------------------------
{
  const v: Vac = {start: isoPlus(NOW, -30), end: isoPlus(NOW, 10)};
  const periods = [v];
  eq('laufender langer Urlaub -> imminent gesetzt', getImminentVacation(periods as any, NOW), v);
  eq('laufender langer Urlaub -> in upcoming', getUpcomingVacations(periods as any, NOW), [v]);
}

// ---------------------------------------------------------------------------
// 10) Zwei Urlaube beide unmittelbar -> imminent = der mit frühestem start
// ---------------------------------------------------------------------------
{
  const early: Vac = {start: isoPlus(NOW, 2), end: isoPlus(NOW, 5)};
  const later: Vac = {start: isoPlus(NOW, 10), end: isoPlus(NOW, 13)};
  // Unsortiert übergeben.
  const periods = [later, early];
  eq('beide unmittelbar -> imminent = frühester start', getImminentVacation(periods as any, NOW), early);
  eq('beide unmittelbar -> upcoming sortiert', getUpcomingVacations(periods as any, NOW), [early, later]);
}

// ---------------------------------------------------------------------------
// 11) Zwei Urlaube, einer unmittelbar, einer weit weg
//     -> imminent = der nahe; upcoming = beide sortiert
// ---------------------------------------------------------------------------
{
  const near: Vac = {start: isoPlus(NOW, 5), end: isoPlus(NOW, 8)};
  const far: Vac = {start: isoPlus(NOW, 60), end: isoPlus(NOW, 70)};
  const periods = [far, near];
  eq('einer nah einer fern -> imminent = der nahe', getImminentVacation(periods as any, NOW), near);
  eq('einer nah einer fern -> upcoming sortiert', getUpcomingVacations(periods as any, NOW), [near, far]);
}

// Variante: erster (chronologisch) ist fern, zweiter nah -> imminent muss
// trotzdem auf den nahen zeigen, NICHT auf den ferneren ersten Eintrag.
{
  const far: Vac = {start: isoPlus(NOW, 30), end: isoPlus(NOW, 40)};
  const near: Vac = {start: isoPlus(NOW, 3), end: isoPlus(NOW, 6)};
  const periods = [far, near];
  eq('fern zuerst, nah danach -> imminent = der nahe', getImminentVacation(periods as any, NOW), near);
}

// ---------------------------------------------------------------------------
// 12) Abgelaufener + zukünftiger -> abgelaufener fällt aus upcoming
// ---------------------------------------------------------------------------
{
  const expired: Vac = {start: isoPlus(NOW, -20), end: isoPlus(NOW, -10)};
  const future: Vac = {start: isoPlus(NOW, 5), end: isoPlus(NOW, 9)};
  const periods = [expired, future];
  eq('abgelaufener + zukünftiger -> upcoming nur zukünftiger', getUpcomingVacations(periods as any, NOW), [future]);
  eq('abgelaufener + zukünftiger -> imminent = zukünftiger (nah)', getImminentVacation(periods as any, NOW), future);
}

// ---------------------------------------------------------------------------
// 13) Einzeltag (start === end)
// ---------------------------------------------------------------------------
{
  // Einzeltag heute -> noch in upcoming und imminent (end == now).
  const single: Vac = {start: iso(NOW), end: iso(NOW)};
  eq('Einzeltag heute -> upcoming', getUpcomingVacations([single] as any, NOW), [single]);
  eq('Einzeltag heute -> imminent', getImminentVacation([single] as any, NOW), single);

  // Einzeltag gestern -> aus upcoming raus.
  const past: Vac = {start: isoPlus(NOW, -1), end: isoPlus(NOW, -1)};
  eq('Einzeltag gestern -> upcoming []', getUpcomingVacations([past] as any, NOW), []);
  eq('Einzeltag gestern -> imminent null', getImminentVacation([past] as any, NOW), null);

  // formatCompactRange für Einzeltag (start === end) -> "DD.MM."
  const sd: Vac = {start: '2026-07-05', end: '2026-07-05'};
  eq('formatCompactRange Einzeltag == "05.07."', formatCompactRange(sd as any), '05.07.');
  // formatVacationRange für Einzeltag -> nur ein volles Datum
  eq('formatVacationRange Einzeltag == "05.07.2026"', formatVacationRange(sd as any), '05.07.2026');
}

// ---------------------------------------------------------------------------
// 14) Format: formatCompactRange Bereich, formatVacationRange voll, telHref
// ---------------------------------------------------------------------------
{
  const range: Vac = {start: '2026-07-20', end: '2026-08-07'};
  eq('formatCompactRange Bereich == "20.07.-07.08."', formatCompactRange(range as any), '20.07.-07.08.');
  eq('formatVacationRange Bereich == "20.07.2026 – 07.08.2026"', formatVacationRange(range as any), '20.07.2026 – 07.08.2026');

  const range2: Vac = {start: '2026-10-26', end: '2026-10-30'};
  eq('formatCompactRange Bereich2 == "26.10.-30.10."', formatCompactRange(range2 as any), '26.10.-30.10.');

  // telHref: Leerzeichen entfernt, führende 0 -> +49
  eq("telHref('0521 55 77 133 ')", telHref('0521 55 77 133 '), 'tel:+495215577133');
  // Zusatzproben für telHref
  eq("telHref('0521 123456')", telHref('0521 123456'), 'tel:+49521123456');
  eq("telHref('+49 521 123456')", telHref('+49 521 123456'), 'tel:+49521123456');
  eq("telHref(' 521123456 ') (keine führende 0, kein +)", telHref(' 521123456 '), 'tel:521123456');
}

// ---------------------------------------------------------------------------
// 15) vacationListYear gibt das Jahr des ersten upcoming
// ---------------------------------------------------------------------------
{
  // Erster (chronologisch) liegt in 2026, fern in 2027. Unsortiert übergeben.
  const a: Vac = {start: '2027-01-10', end: '2027-01-20'};
  const b: Vac = {start: '2026-07-20', end: '2026-08-07'};
  const periods = [a, b];
  eq('vacationListYear == Jahr des ersten upcoming (2026)', vacationListYear(periods as any, NOW), 2026);

  // Wenn der einzige verbleibende upcoming in 2027 liegt.
  const onlyNext: Vac = {start: '2027-03-01', end: '2027-03-10'};
  eq('vacationListYear == 2027 bei nur 2027-Urlaub', vacationListYear([onlyNext] as any, NOW), 2027);
}

// ---------------------------------------------------------------------------
// 16) Sortierung: unsortierte Eingabe wird in upcoming chronologisch
// ---------------------------------------------------------------------------
{
  const v1: Vac = {start: '2026-07-20', end: '2026-08-07'};
  const v2: Vac = {start: '2026-10-26', end: '2026-10-30'};
  const v3: Vac = {start: '2026-09-01', end: '2026-09-05'};
  // Absichtlich durcheinander.
  const periods = [v2, v3, v1];
  eq('unsortiert -> upcoming chronologisch', getUpcomingVacations(periods as any, NOW), [v1, v3, v2]);

  // Eingabe wird nicht mutiert (slice() in der Implementierung).
  eq('Eingabe unverändert (keine Mutation)', periods, [v2, v3, v1]);
}

// ---------------------------------------------------------------------------
// Zusammenfassung
// ---------------------------------------------------------------------------
console.log('');
console.log(`Ergebnis: ${passed} PASS, ${failed} FAIL (gesamt ${passed + failed})`);

if (failed > 0) {
  process.exit(1);
}
