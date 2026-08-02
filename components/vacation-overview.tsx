import {AlertCircle, Info, VacationIllustration} from '@/components/illustrations';
import {Section} from '@/components/section';
import type {SubstitutePractice, VacationPeriod} from '@/content/practice';
import {getTranslator} from '@/lib/i18n';
import {
  formatReturnDate,
  formatVacationRange,
  getUpcomingVacationsNow,
  getVacationYearsNow,
  isOngoing,
  telHref
} from '@/lib/vacations';

/**
 * Die vollständige Urlaubsübersicht — der kanonische Ort für alle Schließzeiten
 * und Vertretungen. Start- und Kontaktseite zeigen davon nur das einzeilige
 * Hinweisband (components/next-vacation-banner.tsx).
 *
 * Aufbau in zwei Stufen, wie vom Kunden vorgegeben:
 *   1. DETAIL — der nächste (oder gerade laufende) Zeitraum gross: Zeichnung,
 *      Zeitraum, Rückkehrdatum, kleiner Hinweiskasten, und rechts daneben eine
 *      Spalte mit je einer Karte pro Vertretungspraxis (Adresse, Telefon).
 *   2. JAHRESÜBERSICHT — eine ruhige Tabelle ALLER anstehenden Zeiträume
 *      (Zeitraum / Praxisurlaub / Vertretung / Hinweis), darüber der sandfarbene
 *      Kasten "Planen Sie rechtzeitig!".
 *
 * Der Abschnitt "Schließzeiten" hat IMMER einen festen Platz, solange überhaupt
 * ein Zeitraum gepflegt ist — die Praxis muss auf einen Blick sehen können,
 * welche Termine hinterlegt sind. Nur sein Inhalt wechselt:
 *   - ab ZWEI Zeiträumen die vollständige Tabelle (inklusive des laufenden;
 *     dort ist die Wiederholung gewollt, weil die Tabelle die Jahresplanung ist
 *     und der Block darüber die akute Information);
 *   - bei genau EINEM Zeitraum stattdessen ein Satz, dass weitere Schließzeiten
 *     nicht geplant sind. Eine einzeilige Tabelle würde exakt den Detailblock
 *     darüber wiederholen — Zeitraum, Status, Vertretung und Hinweis zweimal
 *     auf einer Seite —, und genau diese Doppelung hat die Praxis an der alten
 *     Website kritisiert.
 * Der Merksatz "Planen Sie rechtzeitig!" steht in beiden Fällen genau einmal.
 *
 * Datenquelle ist `content/vacation.json`, gepflegt vom Praxisteam über
 * Pages CMS. Eine leere oder fehlerhafte Datei ergibt eine leere Liste — dann
 * entfällt die Tabelle und der Abschnitt zeigt einen freundlichen Leerzustand.
 */

/** "Hauptstr. 93, 33647 Bielefeld" — leere Felder fallen ersatzlos weg. */
function formatAddress(substitute: SubstitutePractice): string {
  const town = [substitute.postalCode, substitute.city].filter(Boolean).join(' ');

  return [substitute.street, town].filter(Boolean).join(', ');
}

/** Stabiler React-Key: Name plus Position, falls zwei Praxen gleich heissen. */
function substituteKey(substitute: SubstitutePractice, index: number): string {
  return `${substitute.name}-${String(index)}`;
}

type SubstituteListProps = {
  substitutes: SubstitutePractice[];
};

/**
 * Eine Karte je Vertretungspraxis — Name, Anschrift, Rufnummer, Zusatzhinweis.
 * Der Linktext IST die Rufnummer, deshalb bewusst kein aria-label, das sie
 * ersetzen würde (WCAG 2.5.3).
 */
function SubstituteList({substitutes}: SubstituteListProps) {
  return (
    <ul className="substitute-list" role="list">
      {substitutes.map((substitute, index) => {
        const town = [substitute.postalCode, substitute.city].filter(Boolean).join(' ');

        return (
          <li className="substitute" key={substituteKey(substitute, index)}>
            <p className="substitute__name">{substitute.name}</p>
            {substitute.street ? <p className="substitute__line">{substitute.street}</p> : null}
            {town ? <p className="substitute__line">{town}</p> : null}
            {substitute.phone ? (
              <p>
                <a className="substitute__phone" href={telHref(substitute.phone)}>
                  {substitute.phone.trim()}
                </a>
              </p>
            ) : null}
            {substitute.note ? <p className="substitute__note">{substitute.note}</p> : null}
          </li>
        );
      })}
    </ul>
  );
}

type StatusTagProps = {
  running: boolean;
};

/** Statusmarke. Die Bedeutung steht als Text im Markup, nicht nur in der Farbe. */
function StatusTag({running}: StatusTagProps) {
  const t = getTranslator();

  return (
    <span className={running ? 'tag tag--current' : 'tag tag--upcoming'}>
      <span className="visually-hidden">{t('vacation.list.statusLabel')}: </span>
      {running ? t('vacation.list.statusCurrent') : t('vacation.list.statusUpcoming')}
    </span>
  );
}

type FeaturedVacationProps = {
  period: VacationPeriod;
  running: boolean;
};

/** Der nächste oder laufende Zeitraum in voller Ausführlichkeit. */
function FeaturedVacation({period, running}: FeaturedVacationProps) {
  const t = getTranslator();
  const substitutes = period.substitutes ?? [];
  const back = formatReturnDate(period);

  return (
    <div className="news-feature">
      <div className="news-feature__main">
        {/* Rein dekorativ (aria-hidden im SVG selbst): Sonnenschirm und Liege. */}
        <div className="news-feature__figure">
          <VacationIllustration className="illustration" />
        </div>

        <div className="news-feature__body">
          <p className="news-feature__status">
            <StatusTag running={running} />
          </p>
          <p className="news-feature__range">{formatVacationRange(period)}</p>
          <p className="news-feature__return">
            {t('news.vacation.returnLine', {weekday: back.weekday, date: back.date})}
          </p>
          {period.note ? <p className="news-feature__note">{period.note}</p> : null}
          {substitutes.length > 0 ? (
            <p className="news-feature__hint">
              <Info className="icon icon--sm news-feature__hint-icon" />
              <span>
                {substitutes.length > 1
                  ? t('news.vacation.urgentHintPlural')
                  : t('news.vacation.urgentHintSingle')}
              </span>
            </p>
          ) : (
            <p className="news-feature__none">{t('vacation.substitute.none')}</p>
          )}
        </div>
      </div>

      {substitutes.length > 0 ? (
        <div className="news-feature__aside">
          <h3 className="news-feature__aside-title">
            {substitutes.length > 1
              ? t('vacation.substitute.takeOverPlural')
              : t('vacation.substitute.takeOverSingle')}
          </h3>
          <SubstituteList substitutes={substitutes} />
        </div>
      ) : null}
    </div>
  );
}

type SubstituteLinesProps = {
  substitutes: SubstitutePractice[];
};

/**
 * Kompakte Vertretungsangabe für eine Tabellenzelle: Name, Anschrift in einer
 * Zeile, Rufnummer als `tel:`-Link. Bewusst flacher als `SubstituteList` —
 * in der Übersicht zählt die Zeile, nicht die Karte.
 */
function SubstituteLines({substitutes}: SubstituteLinesProps) {
  const t = getTranslator();

  if (substitutes.length === 0) {
    return <p className="news-table__value">{t('vacation.substitute.none')}</p>;
  }

  return (
    <ul className="news-subs" role="list">
      {substitutes.map((substitute, index) => {
        const address = formatAddress(substitute);

        return (
          <li className="news-subs__item" key={substituteKey(substitute, index)}>
            <span className="news-subs__name">{substitute.name}</span>
            {address ? <span className="news-subs__line">{address}</span> : null}
            {substitute.phone ? (
              <a className="news-subs__phone" href={telHref(substitute.phone)}>
                {substitute.phone.trim()}
              </a>
            ) : null}
            {substitute.note ? <span className="news-subs__note">{substitute.note}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}

type VacationTableProps = {
  periods: VacationPeriod[];
  now: Date;
};

/**
 * Jahresübersicht als echte Tabelle.
 *
 * Ab 60em eine gewöhnliche vierspaltige Tabelle, darunter bricht jede Zeile in
 * eine Karte um (siehe page-news.css) — eine horizontal scrollende Tabelle wäre
 * auf dem Telefon unbrauchbar. Weil dafür die `display`-Werte der
 * Tabellenelemente überschrieben werden, verlieren sie in Browsern ihre
 * Tabellensemantik; die `role`-Angaben stellen sie ausdrücklich wieder her.
 * Aus demselben Grund steht die Spaltenbeschriftung zusätzlich als echter Text
 * in jeder Zelle (`.news-table__label`): auf schmalen Viewports ist der
 * Tabellenkopf ausgeblendet, dort trägt das Label die Zuordnung.
 */
function VacationTable({periods, now}: VacationTableProps) {
  const t = getTranslator();

  const columns = [
    t('vacation.list.periodColumn'),
    t('vacation.list.kindColumn'),
    t('vacation.list.substituteColumn'),
    t('vacation.list.noteColumn')
  ];

  return (
    <table className="news-table" role="table">
      <caption className="visually-hidden">{t('vacation.list.caption')}</caption>
      <thead role="rowgroup">
        <tr role="row">
          {columns.map((column) => (
            <th key={column} role="columnheader" scope="col">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup">
        {periods.map((period) => (
          <tr className="news-table__row" key={`${period.start}-${period.end}`} role="row">
            <td role="cell">
              <span className="news-table__label">{columns[0]}</span>
              <span className="news-table__range">{formatVacationRange(period)}</span>
            </td>
            <td role="cell">
              <span className="news-table__label">{columns[1]}</span>
              <StatusTag running={isOngoing(period, now)} />
            </td>
            <td role="cell">
              <span className="news-table__label">{columns[2]}</span>
              <SubstituteLines substitutes={period.substitutes ?? []} />
            </td>
            <td role="cell">
              <span className="news-table__label">{columns[3]}</span>
              <span className="news-table__value">
                {period.note ?? t('vacation.list.emptyCell')}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Sandfarbener Merksatz über der Jahresübersicht. */
function PlanAhead() {
  const t = getTranslator();

  return (
    <div className="callout news-plan">
      <p className="news-plan__title">
        <AlertCircle className="icon icon--sm callout__icon" />
        <span>{t('news.vacation.planAheadTitle')}</span>
      </p>
      <p className="callout__body">{t('news.vacation.planAhead')}</p>
    </div>
  );
}

export function VacationOverview() {
  const t = getTranslator();
  const now = new Date();
  const upcoming = getUpcomingVacationsNow(now);
  const years = getVacationYearsNow(now);

  const featured = upcoming[0];
  const featuredRunning = featured ? isOngoing(featured, now) : false;

  // Erst ab zwei Zeiträumen trägt die Tabelle eine Information, die nicht
  // schon im Detailblock steht (siehe Kopfkommentar).
  const showTable = upcoming.length > 1;

  // Eine Jahreszahl in der Überschrift ist nur ehrlich, solange auch wirklich
  // alle Zeiträume in diesem einen Jahr beginnen.
  const overviewTitle =
    years.length === 1
      ? t('news.vacation.overviewTitleYear', {year: String(years[0])})
      : t('news.vacation.overviewTitle');

  return (
    <>
      <Section title={t('news.vacation.title')}>
        {featured ? (
          <FeaturedVacation period={featured} running={featuredRunning} />
        ) : (
          <div className="news-empty">
            <div className="news-empty__figure">
              <VacationIllustration className="illustration" />
            </div>
            <div className="empty-state">
              <p>{t('vacation.list.empty')}</p>
              <p className="text-small">{t('vacation.list.emptyHint')}</p>
            </div>
          </div>
        )}
      </Section>

      {/* Fester Platz, sobald überhaupt ein Zeitraum gepflegt ist — nur der
          Inhalt wechselt (siehe Kopfkommentar). */}
      {featured ? (
        <Section
          title={overviewTitle}
          description={showTable ? t('news.vacation.description') : undefined}
          headerExtra={<PlanAhead />}
          tone="surface"
        >
          {showTable ? (
            <VacationTable periods={upcoming} now={now} />
          ) : (
            <p className="news-overview__single">{t('news.vacation.onlyCurrent')}</p>
          )}
        </Section>
      ) : null}
    </>
  );
}
