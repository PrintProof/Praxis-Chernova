/**
 * Gründliches Testskript für lib/vacation-logic.ts.
 *
 * Reine Assertions mit synthetischen Daten und festen "now"-Werten.
 * In package.json gibt es bewusst kein Test-Skript und keine Testbibliothek —
 * ausgeführt wird direkt:
 *   node lib/vacation-logic.test.ts
 * (Node ab v22.6 entfernt die Typen selbst — kein Build, kein Runner.)
 *
 * Am Ende: process.exit(1), wenn mindestens ein Test fehlschlägt.
 *
 * WARUM DIESER DOPPELTE IMPORT
 * ----------------------------
 * Node braucht zur Laufzeit die vollständige Dateiendung ('./vacation-logic.ts'),
 * `tsc` verbietet sie aber ohne `allowImportingTsExtensions` (TS5097) — und
 * tsconfig.json gehört nicht zu dieser Datei. Deshalb: ein reiner Typ-Import
 * (wird wegkompiliert) für die Typprüfung plus ein dynamischer Import mit
 * Endung für die Ausführung. Über `as typeof VacationLogic` bleibt jede
 * Funktionssignatur voll typgeprüft; ein umbenannter Export fällt in
 * `npm run typecheck` sofort auf.
 */
import type * as VacationLogic from './vacation-logic';

const {
  getUpcomingVacations,
  getImminentVacation,
  getNextOrCurrentVacation,
  getReturnDate,
  getVacationYears,
  isOngoing,
  formatCompactRange,
  formatDate,
  formatReturnDate,
  formatVacationRange,
  formatWeekday,
  telHref,
  vacationListYear,
  mergePeriodsByRange,
} = (await import(new URL('./vacation-logic.ts', import.meta.url).href)) as typeof VacationLogic;

/**
 * Lokale Strukturtyp-Definition, damit der Import nicht über den
 * '@/content/practice'-Alias laufen muss (Node-direkt-Ausführung).
 *
 * Sie ist absichtlich Feld für Feld deckungsgleich mit `VacationPeriod` /
 * `SubstitutePractice` aus content/practice.ts und mit dem CMS-Schema in
 * `.pages.yml`. Genau deshalb sind hier KEINE `as any`-Casts nötig: weicht
 * eine der beiden Seiten ab, bricht `npm run typecheck`.
 */
type Sub = {
  name: string;
  street?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  note?: string;
};

type Vac = {
  start: string;
  end: string;
  substitutes?: Sub[];
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

/**
 * Die Sprechtage der Praxis als `Date.getDay()`-Werte: Montag bis Freitag.
 * Entspricht `practice.openingHours`; gebunden wird das in lib/vacations.ts,
 * hier steht es bewusst als synthetische Eingabe.
 */
const MO_FR: ReadonlySet<number> = new Set([1, 2, 3, 4, 5]);

// ---------------------------------------------------------------------------
// 1) Leere Liste
// ---------------------------------------------------------------------------
{
  const periods: Vac[] = [];
  eq('leere Liste -> upcoming []', getUpcomingVacations(periods, NOW), []);
  eq('leere Liste -> imminent null', getImminentVacation(periods, NOW), null);
  eq('leere Liste -> nextOrCurrent null', getNextOrCurrentVacation(periods, NOW), null);
  eq('leere Liste -> year null', vacationListYear(periods, NOW), null);
  eq('leere Liste -> years []', getVacationYears(periods, NOW), []);
}

// ---------------------------------------------------------------------------
// 2) Zukünftiger Urlaub, now > 14 Tage vor start
// ---------------------------------------------------------------------------
{
  // start in 20 Tagen
  const v: Vac = {start: isoPlus(NOW, 20), end: isoPlus(NOW, 27)};
  const periods = [v];
  eq('>14 Tage vor start -> upcoming enthält ihn', getUpcomingVacations(periods, NOW), [v]);
  eq('>14 Tage vor start -> imminent null', getImminentVacation(periods, NOW), null);
}

// ---------------------------------------------------------------------------
// 3) now exakt 14 Tage vor start (Grenze) -> imminent gesetzt
// ---------------------------------------------------------------------------
{
  const v: Vac = {start: isoPlus(NOW, 14), end: isoPlus(NOW, 21)};
  const periods = [v];
  eq('exakt 14 Tage vor start -> imminent gesetzt', getImminentVacation(periods, NOW), v);
  eq('exakt 14 Tage vor start -> upcoming enthält ihn', getUpcomingVacations(periods, NOW), [v]);
}

// ---------------------------------------------------------------------------
// 4) now 13 Tage vor start -> imminent gesetzt
// ---------------------------------------------------------------------------
{
  const v: Vac = {start: isoPlus(NOW, 13), end: isoPlus(NOW, 20)};
  const periods = [v];
  eq('13 Tage vor start -> imminent gesetzt', getImminentVacation(periods, NOW), v);
}

// 15 Tage vor start -> KEIN imminent (Gegenprobe zur Grenze)
{
  const v: Vac = {start: isoPlus(NOW, 15), end: isoPlus(NOW, 20)};
  const periods = [v];
  eq('15 Tage vor start -> imminent null (Gegenprobe)', getImminentVacation(periods, NOW), null);
}

// ---------------------------------------------------------------------------
// 5) now == start (laufend, erster Tag) -> imminent gesetzt, in upcoming
// ---------------------------------------------------------------------------
{
  const v: Vac = {start: iso(NOW), end: isoPlus(NOW, 7)};
  const periods = [v];
  eq('now == start -> imminent gesetzt', getImminentVacation(periods, NOW), v);
  eq('now == start -> upcoming enthält ihn', getUpcomingVacations(periods, NOW), [v]);
}

// ---------------------------------------------------------------------------
// 6) now zwischen start und end (Urlaub laeuft gerade)
// ---------------------------------------------------------------------------
{
  const v: Vac = {start: isoPlus(NOW, -3), end: isoPlus(NOW, 3)};
  const periods = [v];
  eq('now zwischen start und end -> imminent gesetzt', getImminentVacation(periods, NOW), v);
  eq('now zwischen start und end -> in upcoming', getUpcomingVacations(periods, NOW), [v]);
  eq('now zwischen start und end -> nextOrCurrent', getNextOrCurrentVacation(periods, NOW), v);
  eq('now zwischen start und end -> isOngoing true', isOngoing(v, NOW), true);
}

// ---------------------------------------------------------------------------
// 7) Urlaub endet HEUTE (Grenze, inklusiv) -> ueberall noch sichtbar
// ---------------------------------------------------------------------------
{
  const v: Vac = {start: isoPlus(NOW, -5), end: iso(NOW)};
  const periods = [v];
  eq('endet heute -> noch in upcoming', getUpcomingVacations(periods, NOW), [v]);
  eq('endet heute -> imminent gesetzt', getImminentVacation(periods, NOW), v);
  eq('endet heute -> nextOrCurrent gesetzt', getNextOrCurrentVacation(periods, NOW), v);
  eq('endet heute -> isOngoing true', isOngoing(v, NOW), true);
  eq('endet heute -> year gesetzt', vacationListYear(periods, NOW), 2026);
}

// ---------------------------------------------------------------------------
// 8) Urlaub liegt in der VERGANGENHEIT (end == gestern) -> ueberall weg
// ---------------------------------------------------------------------------
{
  const v: Vac = {start: isoPlus(NOW, -5), end: isoPlus(NOW, -1)};
  const periods = [v];
  eq('vergangen -> nicht in upcoming', getUpcomingVacations(periods, NOW), []);
  eq('vergangen -> imminent null', getImminentVacation(periods, NOW), null);
  eq('vergangen -> nextOrCurrent null', getNextOrCurrentVacation(periods, NOW), null);
  eq('vergangen -> isOngoing false', isOngoing(v, NOW), false);
  eq('vergangen -> year null', vacationListYear(periods, NOW), null);
  eq('vergangen -> years []', getVacationYears(periods, NOW), []);
}

// Deutlich laenger vorbei (voriges Jahr) — dieselbe Erwartung.
{
  const v: Vac = {start: '2025-07-01', end: '2025-07-20'};
  eq('vergangen (Vorjahr) -> upcoming []', getUpcomingVacations([v], NOW), []);
  eq('vergangen (Vorjahr) -> nextOrCurrent null', getNextOrCurrentVacation([v], NOW), null);
}

// ---------------------------------------------------------------------------
// 9) Urlaub beginnt MORGEN -> sichtbar, aber laeuft noch nicht
// ---------------------------------------------------------------------------
{
  const v: Vac = {start: isoPlus(NOW, 1), end: isoPlus(NOW, 8)};
  const periods = [v];
  eq('beginnt morgen -> in upcoming', getUpcomingVacations(periods, NOW), [v]);
  eq('beginnt morgen -> imminent gesetzt', getImminentVacation(periods, NOW), v);
  eq('beginnt morgen -> nextOrCurrent gesetzt', getNextOrCurrentVacation(periods, NOW), v);
  eq('beginnt morgen -> isOngoing false', isOngoing(v, NOW), false);
}

// ---------------------------------------------------------------------------
// 10) Laufender langer Urlaub (start vor >14 Tagen, end in Zukunft)
//     -> imminent gesetzt (laufender zählt unabhängig von der 14-Tage-Grenze)
// ---------------------------------------------------------------------------
{
  const v: Vac = {start: isoPlus(NOW, -30), end: isoPlus(NOW, 10)};
  const periods = [v];
  eq('laufender langer Urlaub -> imminent gesetzt', getImminentVacation(periods, NOW), v);
  eq('laufender langer Urlaub -> in upcoming', getUpcomingVacations(periods, NOW), [v]);
}

// ---------------------------------------------------------------------------
// 11) Zwei Urlaube beide unmittelbar -> imminent = der mit frühestem start
// ---------------------------------------------------------------------------
{
  const early: Vac = {start: isoPlus(NOW, 2), end: isoPlus(NOW, 5)};
  const later: Vac = {start: isoPlus(NOW, 10), end: isoPlus(NOW, 13)};
  // Unsortiert übergeben.
  const periods = [later, early];
  eq('beide unmittelbar -> imminent = frühester start', getImminentVacation(periods, NOW), early);
  eq('beide unmittelbar -> upcoming sortiert', getUpcomingVacations(periods, NOW), [early, later]);
}

// ---------------------------------------------------------------------------
// 12) Zwei Urlaube, einer unmittelbar, einer weit weg
//     -> imminent = der nahe; upcoming = beide sortiert
// ---------------------------------------------------------------------------
{
  const near: Vac = {start: isoPlus(NOW, 5), end: isoPlus(NOW, 8)};
  const far: Vac = {start: isoPlus(NOW, 60), end: isoPlus(NOW, 70)};
  const periods = [far, near];
  eq('einer nah einer fern -> imminent = der nahe', getImminentVacation(periods, NOW), near);
  eq('einer nah einer fern -> upcoming sortiert', getUpcomingVacations(periods, NOW), [near, far]);
}

// Variante: erster (chronologisch) ist fern, zweiter nah -> imminent muss
// trotzdem auf den nahen zeigen, NICHT auf den ferneren ersten Eintrag.
{
  const far: Vac = {start: isoPlus(NOW, 30), end: isoPlus(NOW, 40)};
  const near: Vac = {start: isoPlus(NOW, 3), end: isoPlus(NOW, 6)};
  const periods = [far, near];
  eq('fern zuerst, nah danach -> imminent = der nahe', getImminentVacation(periods, NOW), near);
}

// ---------------------------------------------------------------------------
// 13) Abgelaufener + zukünftiger -> abgelaufener fällt aus upcoming
// ---------------------------------------------------------------------------
{
  const expired: Vac = {start: isoPlus(NOW, -20), end: isoPlus(NOW, -10)};
  const future: Vac = {start: isoPlus(NOW, 5), end: isoPlus(NOW, 9)};
  const periods = [expired, future];
  eq('abgelaufener + zukünftiger -> upcoming nur zukünftiger', getUpcomingVacations(periods, NOW), [future]);
  eq('abgelaufener + zukünftiger -> imminent = zukünftiger (nah)', getImminentVacation(periods, NOW), future);
}

// ---------------------------------------------------------------------------
// 14) Einzeltag (start === end)
// ---------------------------------------------------------------------------
{
  // Einzeltag heute -> noch in upcoming und imminent (end == now).
  const single: Vac = {start: iso(NOW), end: iso(NOW)};
  eq('Einzeltag heute -> upcoming', getUpcomingVacations([single], NOW), [single]);
  eq('Einzeltag heute -> imminent', getImminentVacation([single], NOW), single);

  // Einzeltag gestern -> aus upcoming raus.
  const past: Vac = {start: isoPlus(NOW, -1), end: isoPlus(NOW, -1)};
  eq('Einzeltag gestern -> upcoming []', getUpcomingVacations([past], NOW), []);
  eq('Einzeltag gestern -> imminent null', getImminentVacation([past], NOW), null);

  // formatCompactRange für Einzeltag (start === end) -> "DD.MM."
  const sd: Vac = {start: '2026-07-05', end: '2026-07-05'};
  eq('formatCompactRange Einzeltag == "05.07."', formatCompactRange(sd), '05.07.');
  // formatVacationRange für Einzeltag -> nur ein volles Datum
  eq('formatVacationRange Einzeltag == "05.07.2026"', formatVacationRange(sd), '05.07.2026');
}

// ---------------------------------------------------------------------------
// 15) Format: formatCompactRange Bereich, formatVacationRange voll, telHref
// ---------------------------------------------------------------------------
{
  const range: Vac = {start: '2026-07-20', end: '2026-08-07'};
  eq('formatCompactRange Bereich == "20.07.-07.08."', formatCompactRange(range), '20.07.-07.08.');
  eq('formatVacationRange Bereich == "20.07.2026 – 07.08.2026"', formatVacationRange(range), '20.07.2026 – 07.08.2026');

  const range2: Vac = {start: '2026-10-26', end: '2026-10-30'};
  eq('formatCompactRange Bereich2 == "26.10.-30.10."', formatCompactRange(range2), '26.10.-30.10.');

  // telHref: Leerzeichen entfernt, führende 0 -> +49
  eq("telHref('0521 55 77 133 ')", telHref('0521 55 77 133 '), 'tel:+495215577133');
  // Zusatzproben für telHref
  eq("telHref('0521 123456')", telHref('0521 123456'), 'tel:+49521123456');
  eq("telHref('+49 521 123456')", telHref('+49 521 123456'), 'tel:+49521123456');
  eq("telHref(' 521123456 ') (keine führende 0, kein +)", telHref(' 521123456 '), 'tel:521123456');
  // Schreibweisen, die im CMS realistisch vorkommen
  eq("telHref('0521/55 77-133')", telHref('0521/55 77-133'), 'tel:+495215577133');
  eq("telHref('(0521) 444077')", telHref('(0521) 444077'), 'tel:+49521444077');
}

// ---------------------------------------------------------------------------
// 16) vacationListYear gibt das Jahr des ersten upcoming
// ---------------------------------------------------------------------------
{
  // Erster (chronologisch) liegt in 2026, fern in 2027. Unsortiert übergeben.
  const a: Vac = {start: '2027-01-10', end: '2027-01-20'};
  const b: Vac = {start: '2026-07-20', end: '2026-08-07'};
  const periods = [a, b];
  eq('vacationListYear == Jahr des ersten upcoming (2026)', vacationListYear(periods, NOW), 2026);

  // Wenn der einzige verbleibende upcoming in 2027 liegt.
  const onlyNext: Vac = {start: '2027-03-01', end: '2027-03-10'};
  eq('vacationListYear == 2027 bei nur 2027-Urlaub', vacationListYear([onlyNext], NOW), 2027);
}

// ---------------------------------------------------------------------------
// 17) getVacationYears — Grundlage der Uebersichtsueberschrift
// ---------------------------------------------------------------------------
{
  const a: Vac = {start: '2026-07-20', end: '2026-08-07'};
  const b: Vac = {start: '2026-10-26', end: '2026-10-30'};
  const c: Vac = {start: '2027-01-10', end: '2027-01-20'};

  eq('getVacationYears: alles in einem Jahr -> [2026]', getVacationYears([a, b], NOW), [2026]);
  // Unsortiert und ueber den Jahreswechsel hinweg -> aufsteigend, ohne Doppel.
  eq('getVacationYears: zwei Jahre, unsortiert -> [2026, 2027]', getVacationYears([c, b, a], NOW), [2026, 2027]);
  // Abgelaufene zaehlen nicht mit.
  const expired: Vac = {start: '2025-07-01', end: '2025-07-20'};
  eq('getVacationYears: abgelaufene bleiben aussen vor', getVacationYears([expired, a], NOW), [2026]);
  // Ein Urlaub ueber den Jahreswechsel zaehlt zu seinem START-Jahr.
  const turn: Vac = {start: '2026-12-23', end: '2027-01-01'};
  eq('getVacationYears: Jahreswechsel zaehlt zum Startjahr', getVacationYears([turn], NOW), [2026]);
}

// ---------------------------------------------------------------------------
// 18) Sortierung: unsortierte Eingabe wird in upcoming chronologisch
// ---------------------------------------------------------------------------
{
  const v1: Vac = {start: '2026-07-20', end: '2026-08-07'};
  const v2: Vac = {start: '2026-10-26', end: '2026-10-30'};
  const v3: Vac = {start: '2026-09-01', end: '2026-09-05'};
  // Absichtlich durcheinander.
  const periods = [v2, v3, v1];
  eq('unsortiert -> upcoming chronologisch', getUpcomingVacations(periods, NOW), [v1, v3, v2]);

  // Eingabe wird nicht mutiert (slice() in der Implementierung).
  eq('Eingabe unverändert (keine Mutation)', periods, [v2, v3, v1]);
}

// ---------------------------------------------------------------------------
// 19) isOngoing — laufend ja/nein, Grenzen inklusiv
// ---------------------------------------------------------------------------
{
  const running: Vac = {start: isoPlus(NOW, -3), end: isoPlus(NOW, 3)};
  const firstDay: Vac = {start: iso(NOW), end: isoPlus(NOW, 5)};
  const lastDay: Vac = {start: isoPlus(NOW, -5), end: iso(NOW)};
  const future: Vac = {start: isoPlus(NOW, 1), end: isoPlus(NOW, 5)};
  const past: Vac = {start: isoPlus(NOW, -5), end: isoPlus(NOW, -1)};
  const singleToday: Vac = {start: iso(NOW), end: iso(NOW)};

  eq('isOngoing: mitten drin -> true', isOngoing(running, NOW), true);
  eq('isOngoing: erster Tag (start == now) -> true', isOngoing(firstDay, NOW), true);
  eq('isOngoing: letzter Tag (end == now) -> true', isOngoing(lastDay, NOW), true);
  eq('isOngoing: Einzeltag heute -> true', isOngoing(singleToday, NOW), true);
  eq('isOngoing: startet morgen -> false', isOngoing(future, NOW), false);
  eq('isOngoing: gestern beendet -> false', isOngoing(past, NOW), false);
}

// ---------------------------------------------------------------------------
// 20) getNextOrCurrentVacation — OHNE 2-Wochen-Regel
// ---------------------------------------------------------------------------
{
  // Der entscheidende Unterschied zu getImminentVacation: weit entfernte
  // Urlaube werden trotzdem geliefert (Hinweisband auf Start/Kontakt).
  const far: Vac = {start: isoPlus(NOW, 200), end: isoPlus(NOW, 214)};
  eq('nextOrCurrent: 200 Tage entfernt -> geliefert', getNextOrCurrentVacation([far], NOW), far);
  eq('nextOrCurrent: Gegenprobe imminent bleibt null', getImminentVacation([far], NOW), null);

  // Laufender Urlaub gewinnt gegen einen spaeteren.
  const running: Vac = {start: isoPlus(NOW, -2), end: isoPlus(NOW, 4)};
  const later: Vac = {start: isoPlus(NOW, 40), end: isoPlus(NOW, 50)};
  eq(
    'nextOrCurrent: laufender vor spaeterem (unsortiert)',
    getNextOrCurrentVacation([later, running], NOW),
    running
  );

  // Abgelaufene Zeitraeume werden uebersprungen.
  const expired: Vac = {start: isoPlus(NOW, -20), end: isoPlus(NOW, -10)};
  const next: Vac = {start: isoPlus(NOW, 90), end: isoPlus(NOW, 100)};
  eq(
    'nextOrCurrent: abgelaufener wird uebersprungen',
    getNextOrCurrentVacation([expired, next], NOW),
    next
  );

  // Nur abgelaufene -> null (Banner verschwindet rueckstandslos).
  eq('nextOrCurrent: nur abgelaufene -> null', getNextOrCurrentVacation([expired], NOW), null);

  // Heute endender Urlaub zaehlt noch (Grenze inklusiv).
  const endsToday: Vac = {start: isoPlus(NOW, -4), end: iso(NOW)};
  eq('nextOrCurrent: endet heute -> geliefert', getNextOrCurrentVacation([endsToday], NOW), endsToday);
}

// ---------------------------------------------------------------------------
// 21) JAHRESWECHSEL — Urlaub vom 23.12.2026 bis 01.01.2027
//     Der kritische Fall: alle Vergleiche laufen ueber echte Datumswerte,
//     nicht ueber Tag/Monat. Geprueft an vier Stichtagen.
// ---------------------------------------------------------------------------
{
  const turn: Vac = {
    start: '2026-12-23',
    end: '2027-01-01',
    note: 'Zwischen den Jahren geschlossen',
  };
  const periods = [turn];

  // a) Zwei Wochen vorher (09.12.2026): sichtbar, unmittelbar, laeuft nicht.
  const before = day(2026, 12, 9);
  eq('Jahreswechsel 09.12. -> in upcoming', getUpcomingVacations(periods, before), [turn]);
  eq('Jahreswechsel 09.12. -> imminent (genau 14 Tage)', getImminentVacation(periods, before), turn);
  eq('Jahreswechsel 09.12. -> isOngoing false', isOngoing(turn, before), false);

  // b) Mitten drin, noch im alten Jahr (28.12.2026).
  const inside = day(2026, 12, 28);
  eq('Jahreswechsel 28.12. -> isOngoing true', isOngoing(turn, inside), true);
  eq('Jahreswechsel 28.12. -> in upcoming', getUpcomingVacations(periods, inside), [turn]);
  eq('Jahreswechsel 28.12. -> nextOrCurrent', getNextOrCurrentVacation(periods, inside), turn);
  eq('Jahreswechsel 28.12. -> year = Startjahr 2026', vacationListYear(periods, inside), 2026);

  // c) Letzter Tag, schon im neuen Jahr (01.01.2027) — Grenze inklusiv.
  const lastDay = day(2027, 1, 1);
  eq('Jahreswechsel 01.01. -> isOngoing true', isOngoing(turn, lastDay), true);
  eq('Jahreswechsel 01.01. -> noch in upcoming', getUpcomingVacations(periods, lastDay), [turn]);
  eq('Jahreswechsel 01.01. -> years [2026]', getVacationYears(periods, lastDay), [2026]);

  // d) Erster Tag danach (02.01.2027) -> rueckstandslos verschwunden.
  const after = day(2027, 1, 2);
  eq('Jahreswechsel 02.01. -> upcoming []', getUpcomingVacations(periods, after), []);
  eq('Jahreswechsel 02.01. -> nextOrCurrent null', getNextOrCurrentVacation(periods, after), null);
  eq('Jahreswechsel 02.01. -> imminent null', getImminentVacation(periods, after), null);
  eq('Jahreswechsel 02.01. -> isOngoing false', isOngoing(turn, after), false);
  eq('Jahreswechsel 02.01. -> years []', getVacationYears(periods, after), []);

  // Formatierung ueber den Jahreswechsel.
  eq('Jahreswechsel formatCompactRange', formatCompactRange(turn), '23.12.-01.01.');
  eq('Jahreswechsel formatVacationRange', formatVacationRange(turn), '23.12.2026 – 01.01.2027');
  // 01.01.2027 ist ein Freitag, der 02.01. also ein Samstag: der erste
  // Sprechtag ist Montag, der 04.01.2027.
  eq('Jahreswechsel getReturnDate', iso(getReturnDate(turn, MO_FR)), '2027-01-04');
  eq(
    'Jahreswechsel formatReturnDate',
    formatReturnDate(turn, MO_FR),
    {weekday: 'Montag', date: '04.01.2027'}
  );

  // Sortierung ueber den Jahreswechsel: der Dezember-Urlaub steht vor dem
  // Januar-Urlaub des Folgejahrs, auch wenn er spaeter eingetragen wurde.
  const january: Vac = {start: '2027-01-20', end: '2027-01-25'};
  eq(
    'Jahreswechsel: Sortierung Dezember vor Januar',
    getUpcomingVacations([january, turn], inside),
    [turn, january]
  );
  eq('Jahreswechsel: years [2026, 2027]', getVacationYears([january, turn], inside), [2026, 2027]);
}

// ---------------------------------------------------------------------------
// 22) Datenschema aus .pages.yml — mehrere Vertretungen je Urlaub
//     Die Logik reicht die Eintraege unveraendert durch; kein Feld darf
//     unterwegs verloren gehen.
// ---------------------------------------------------------------------------
{
  const first: Sub = {
    name: 'Dres. med Lankes',
    street: 'Hauptstr. 93',
    postalCode: '33647',
    city: 'Bielefeld',
    phone: '0521 55 77 133 ',
    note: 'Nur Telefonisch erreichbar',
  };
  // Zweite Praxis bewusst nur mit Pflichtfeld: alle uebrigen Felder sind
  // laut .pages.yml optional und duerfen fehlen.
  const second: Sub = {name: 'Hausarztpraxis Am Markt'};

  const withTwo: Vac = {
    start: isoPlus(NOW, 3),
    end: isoPlus(NOW, 10),
    note: 'Betriebsurlaub',
    substitutes: [first, second],
  };
  const withNone: Vac = {start: isoPlus(NOW, 40), end: isoPlus(NOW, 44)};

  const upcoming = getUpcomingVacations([withNone, withTwo], NOW);
  eq('mehrere Vertretungen: Reihenfolge der Urlaube', upcoming, [withTwo, withNone]);
  eq('mehrere Vertretungen: beide Eintraege erhalten', upcoming[0].substitutes, [first, second]);
  eq('ohne Vertretung: Feld bleibt undefined', upcoming[1].substitutes, undefined);
  eq('mehrere Vertretungen: nextOrCurrent liefert denselben Eintrag', getNextOrCurrentVacation([withNone, withTwo], NOW), withTwo);

  // Aus beiden Rufnummern-Schreibweisen entsteht ein gueltiger tel:-Link.
  eq('mehrere Vertretungen: telHref der ersten', telHref(first.phone ?? ''), 'tel:+495215577133');
}

// ---------------------------------------------------------------------------
// 23) getReturnDate / formatWeekday / formatDate / formatReturnDate
// ---------------------------------------------------------------------------
{
  // 07.08.2026 ist ein Freitag. Samstag und Sonntag hat die Praxis keine
  // Sprechstunde -> erster Sprechtag ist Montag, der 10.08.2026.
  const v: Vac = {start: '2026-07-20', end: '2026-08-07'};
  eq('getReturnDate: Ende Freitag -> Montag', iso(getReturnDate(v, MO_FR)), '2026-08-10');
  eq(
    'formatReturnDate == {Montag, 10.08.2026}',
    formatReturnDate(v, MO_FR),
    {weekday: 'Montag', date: '10.08.2026'}
  );

  // Monatsgrenze: 31.08.2026 (Montag) -> 01.09.2026 (Dienstag), ein Sprechtag.
  const monthEnd: Vac = {start: '2026-08-24', end: '2026-08-31'};
  eq('getReturnDate ueber Monatsgrenze', iso(getReturnDate(monthEnd, MO_FR)), '2026-09-01');

  // Jahresgrenze: 31.12.2026 (Donnerstag) -> 01.01.2027 (Freitag).
  const yearEnd: Vac = {start: '2026-12-24', end: '2026-12-31'};
  eq('getReturnDate ueber Jahresgrenze', iso(getReturnDate(yearEnd, MO_FR)), '2027-01-01');
  eq(
    'formatReturnDate ueber Jahresgrenze',
    formatReturnDate(yearEnd, MO_FR),
    {weekday: 'Freitag', date: '01.01.2027'}
  );

  // Schaltjahr: 28.02.2028 (Montag) -> 29.02.2028 (Dienstag).
  const leap: Vac = {start: '2028-02-21', end: '2028-02-28'};
  eq('getReturnDate im Schaltjahr', iso(getReturnDate(leap, MO_FR)), '2028-02-29');

  // Einzeltag am Freitag (01.05.2026) -> Rueckkehr Montag, 04.05.2026.
  const single: Vac = {start: '2026-05-01', end: '2026-05-01'};
  eq('getReturnDate bei Einzeltag (Fr) -> Montag', iso(getReturnDate(single, MO_FR)), '2026-05-04');

  // Wochentage vollstaendig durchgehen (01.03.2026 ist ein Sonntag).
  const expectedWeekdays = [
    'Sonntag',
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
  ];
  const actualWeekdays = expectedWeekdays.map((_, i) => formatWeekday(day(2026, 3, 1 + i)));
  eq('formatWeekday: alle sieben Tage ab So 01.03.2026', actualWeekdays, expectedWeekdays);

  // formatDate: fuehrende Nullen
  eq('formatDate 05.07.2026', formatDate(day(2026, 7, 5)), '05.07.2026');
  eq('formatDate 31.12.2026', formatDate(day(2026, 12, 31)), '31.12.2026');
}

// ---------------------------------------------------------------------------
// 24) getReturnDate springt ueber Tage OHNE Sprechzeit
//     Kernfall: die Praxis hat Mo-Fr Sprechstunde. Ein Urlaubsende am Freitag,
//     Samstag oder Sonntag darf niemals einen Wochenendtag als Rueckkehrtag
//     nennen — sonst kommen Patientinnen und Patienten vor eine leere Praxis.
//     August 2026: 01. Sa | 03. Mo | 05. Mi | 06. Do | 07. Fr | 08. Sa | 09. So
// ---------------------------------------------------------------------------
{
  const endsMonday: Vac = {start: '2026-08-01', end: '2026-08-03'};
  const endsThursday: Vac = {start: '2026-08-01', end: '2026-08-06'};
  const endsFriday: Vac = {start: '2026-08-01', end: '2026-08-07'};
  const endsSaturday: Vac = {start: '2026-08-01', end: '2026-08-08'};
  const endsSunday: Vac = {start: '2026-08-01', end: '2026-08-09'};

  eq('Ende Mo -> Rueckkehr Di', iso(getReturnDate(endsMonday, MO_FR)), '2026-08-04');
  eq('Ende Do -> Rueckkehr Fr', iso(getReturnDate(endsThursday, MO_FR)), '2026-08-07');
  eq('Ende Fr -> Rueckkehr Mo', iso(getReturnDate(endsFriday, MO_FR)), '2026-08-10');
  eq('Ende Sa -> Rueckkehr Mo', iso(getReturnDate(endsSaturday, MO_FR)), '2026-08-10');
  eq('Ende So -> Rueckkehr Mo', iso(getReturnDate(endsSunday, MO_FR)), '2026-08-10');

  eq(
    'Ende Fr -> Wochentagsname Montag',
    formatReturnDate(endsFriday, MO_FR),
    {weekday: 'Montag', date: '10.08.2026'}
  );

  // Nur ein einziger Sprechtag (Mittwoch): der Sprung darf bis zu sechs Tage
  // weit gehen — hier vom Ende an einem Mittwoch auf den Mittwoch darauf.
  const onlyWednesday: ReadonlySet<number> = new Set([3]);
  const endsWednesday: Vac = {start: '2026-08-01', end: '2026-08-05'};
  eq(
    'nur Mittwoch geoeffnet -> naechster Mittwoch',
    iso(getReturnDate(endsWednesday, onlyWednesday)),
    '2026-08-12'
  );

  // Sicherheitsnetz: ohne einen einzigen Sprechtag bleibt es bei end + 1 Tag,
  // die Schleife laeuft nicht endlos.
  const noOpenDays: ReadonlySet<number> = new Set<number>();
  eq(
    'keine Sprechtage -> end + 1 Tag',
    iso(getReturnDate(endsFriday, noOpenDays)),
    '2026-08-08'
  );
}


// ---------------------------------------------------------------------------
// mergePeriodsByRange — mehrere Vertretungen, die als mehrere Urlaube
// mit identischem Zeitraum erfasst wurden (altes CMS-Formular).
// ---------------------------------------------------------------------------
{
  const sub = (name: string, phone?: string): Sub => ({name, phone});

  // Der echte Produktionsfall: ein Urlaub, drei Vertretungen, dreifach erfasst.
  const dreifach: Vac[] = [
    {start: '2026-07-20', end: '2026-08-07', note: 'Betriebsurlaub', substitutes: [sub('Dres. med Lankes', '0521 55 77 133')]},
    {start: '2026-07-20', end: '2026-08-07', substitutes: [sub('Hausarztpraxis am Frölenberg', '0521 44 97 44')]},
    {start: '2026-07-20', end: '2026-08-07', substitutes: [sub('Oxana Berlin', '05209 40 77')]},
  ];

  const merged = mergePeriodsByRange(dreifach);
  eq('merge: drei gleiche Zeitraeume werden zu einem', merged.length, 1);
  eq('merge: alle drei Vertretungen bleiben erhalten', merged[0].substitutes?.length, 3);
  eq('merge: Reihenfolge der Vertretungen bleibt', merged[0].substitutes?.map((s) => s.name), [
    'Dres. med Lankes',
    'Hausarztpraxis am Frölenberg',
    'Oxana Berlin',
  ]);
  eq('merge: Hinweis des ersten Eintrags bleibt', merged[0].note, 'Betriebsurlaub');
  eq('merge: Zeitraum unveraendert', [merged[0].start, merged[0].end], ['2026-07-20', '2026-08-07']);

  // Verschiedene Zeitraeume duerfen NICHT zusammenfallen.
  const getrennt = mergePeriodsByRange([
    {start: '2026-07-20', end: '2026-08-07', substitutes: [sub('A')]},
    {start: '2026-10-05', end: '2026-10-16', substitutes: [sub('B')]},
  ]);
  eq('merge: verschiedene Zeitraeume bleiben getrennt', getrennt.length, 2);

  // Gleicher Start, anderes Ende -> getrennt.
  const halbGleich = mergePeriodsByRange([
    {start: '2026-07-20', end: '2026-08-07'},
    {start: '2026-07-20', end: '2026-08-14'},
  ]);
  eq('merge: gleicher Start aber anderes Ende bleibt getrennt', halbGleich.length, 2);

  // Dieselbe Vertretung doppelt erfasst -> nur einmal.
  const doppelt = mergePeriodsByRange([
    {start: '2026-07-20', end: '2026-08-07', substitutes: [sub('Dres. med Lankes', '0521 55 77 133')]},
    {start: '2026-07-20', end: '2026-08-07', substitutes: [sub('  dres. med lankes ', ' 0521 55 77 133')]},
  ]);
  eq('merge: identische Vertretung wird nicht verdoppelt', doppelt[0].substitutes?.length, 1);

  // Gleicher Name, andere Nummer -> zwei Eintraege (echte Zweigstelle).
  const gleicherName = mergePeriodsByRange([
    {start: '2026-07-20', end: '2026-08-07', substitutes: [sub('Praxis Muster', '0521 111')]},
    {start: '2026-07-20', end: '2026-08-07', substitutes: [sub('Praxis Muster', '0521 222')]},
  ]);
  eq('merge: gleicher Name mit anderer Nummer bleibt erhalten', gleicherName[0].substitutes?.length, 2);

  // Unterschiedliche Hinweise gehen nicht verloren.
  const hinweise = mergePeriodsByRange([
    {start: '2026-07-20', end: '2026-08-07', note: 'Betriebsurlaub'},
    {start: '2026-07-20', end: '2026-08-07', note: 'Rezepte vorher anfordern.'},
  ]);
  eq('merge: unterschiedliche Hinweise werden zusammengefuehrt', hinweise[0].note, 'Betriebsurlaub Rezepte vorher anfordern.');

  // Gleicher Hinweis mehrfach -> nur einmal.
  const gleicherHinweis = mergePeriodsByRange([
    {start: '2026-07-20', end: '2026-08-07', note: 'Betriebsurlaub'},
    {start: '2026-07-20', end: '2026-08-07', note: 'Betriebsurlaub'},
  ]);
  eq('merge: gleicher Hinweis nicht verdoppelt', gleicherHinweis[0].note, 'Betriebsurlaub');

  // Ohne Vertretung bleibt substitutes undefined statt [].
  const ohne = mergePeriodsByRange([{start: '2026-07-20', end: '2026-08-07'}]);
  eq('merge: ohne Vertretung bleibt substitutes undefiniert', ohne[0].substitutes, undefined);

  // Leere Liste.
  eq('merge: leere Liste bleibt leer', mergePeriodsByRange([]).length, 0);

  // Zusammenspiel mit getUpcomingVacations: aus drei mach eins.
  const upcoming = getUpcomingVacations(mergePeriodsByRange(dreifach), day(2026, 7, 25));
  eq('merge: /aktuelles zeigt danach genau EINEN laufenden Urlaub', upcoming.length, 1);
  eq('merge: mit allen drei Vertretungen', upcoming[0].substitutes?.length, 3);
}

// ---------------------------------------------------------------------------
// Zusammenfassung
// ---------------------------------------------------------------------------
console.log('');
console.log(`Ergebnis: ${passed} PASS, ${failed} FAIL (gesamt ${passed + failed})`);

if (failed > 0) {
  process.exit(1);
}
