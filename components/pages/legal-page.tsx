/**
 * legal-page.tsx — Impressum und Datenschutzerklaerung.
 *
 * Beide Dokumente teilen sich diese Komponente; `routeKey` waehlt den Textblock
 * aus `content/legal.ts`, `translationPrefix` die Ueberschrift aus messages.
 *
 * GRUNDSATZ: Der juristische Text ist unantastbar. Diese Datei formatiert ihn,
 * sie formuliert nichts um, kuerzt nichts und ergaenzt nichts. Auch die
 * Platzhalter "[BITTE ERGAENZEN: ...]" / "[BITTE PRUEFEN: ...]" bleiben
 * woertlich stehen — sie werden lediglich dezent hervorgehoben, damit der
 * Praxis auffaellt, dass dort noch etwas offen ist.
 *
 * DREI ENTSCHEIDUNGEN ZUR LESBARKEIT
 * 1. Inhaltsverzeichnis mit Ankerlinks. Beide Dokumente haben zehn Abschnitte;
 *    ohne Sprungmarken scrollt man an der gesuchten Stelle vorbei. Die Anker
 *    werden aus den Ueberschriften erzeugt (Umlaute werden transliteriert,
 *    damit die URL stabil und ohne Prozentkodierung bleibt) und sind damit
 *    zitierfaehig: /impressum/#zustaendige-aerztekammer.
 * 2. Eine einzige schmale Lesespalte (~68 Zeichen). Kopf und Text stehen auf
 *    derselben Kante — das ist der ruhigste Aufbau, den ein reines
 *    Textdokument haben kann.
 *    WICHTIG: Die Spalte wird ueber `max-width` auf den Inhaltselementen
 *    begrenzt (page-legal.css), NICHT ueber `container--narrow`. Ein schmaler
 *    zentrierter Container haette den ganzen Text um gut 200px nach rechts
 *    geschoben — die Ueberschrift haette dann weder mit dem Logo darueber noch
 *    mit der Anschrift in der Fusszeile darunter gefluchtet, und die
 *    Rechtsseiten wirkten wie von einer anderen Website.
 * 3. Kurze Datenzeilen (Anschrift, Rufnummern, Gesetzesnamen) werden zu einem
 *    engen Block zusammengefasst, Fliesstext bleibt Absatz. Vorher stand jede
 *    Zeile einer Anschrift als eigener Absatz mit vollem Absatzabstand — das
 *    liest sich wie eine Liste ohne Zusammenhang. Die Zuordnung passiert rein
 *    strukturell, der Wortlaut bleibt Zeichen fuer Zeichen identisch.
 *
 * Bewusst NICHT vorhanden: Illustration, Icons, Karten-Raster. Ein Impressum
 * ist ein Dokument, kein Marketing-Abschnitt — Dekoration waere hier Ballast.
 */
import {Fragment, type ReactNode} from 'react';

import {PageShell} from '@/components/page-shell';
import {datenschutz, impressum, type LegalSection} from '@/content/legal';
import {getTranslator} from '@/lib/i18n';
import type {RouteKey} from '@/lib/routing';

/** Sichtbarer Titel des Inhaltsverzeichnisses; benennt zugleich das <nav>. */
const TOC_TITLE_ID = 'legal-inhalt';

/**
 * Redaktionell offene Punkte im Rechtstext. Der Platzhalter bleibt woertlich
 * erhalten und wird nur ausgezeichnet — die Information steckt im Text selbst,
 * nicht in der Farbe.
 */
const OPEN_ITEM_PATTERN = /(\[BITTE [^\]]*\])/;

/**
 * Grenze zwischen Datenzeile und Fliesstextabsatz. Eine Zeile gilt als
 * Datenzeile, wenn sie kurz ist UND nicht wie ein Satz endet. "Telefon:
 * 0521 444077" ist eine Datenzeile, "... Regelungen:" leitet einen Block ein
 * und bleibt Absatz.
 */
const COMPACT_MAX_LENGTH = 90;
const SENTENCE_END = /[.:;!?]$/;

const TRANSLITERATION: Record<string, string> = {
  'ä': 'ae',
  'ö': 'oe',
  'ü': 'ue',
  'ß': 'ss'
};

/**
 * Stabiler Anker aus einer Ueberschrift. Umlaute werden ausgeschrieben (nicht
 * entfernt), damit aus "Zustaendige Aerztekammer" nicht "zustndige rztekammer"
 * wird; verbleibende Diakritika fallen ueber die NFD-Zerlegung weg.
 */
function slugify(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => TRANSLITERATION[char] ?? char)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

type LegalBlock =
  | {kind: 'lines'; lines: string[]}
  | {kind: 'paragraph'; text: string};

type LegalEntry = {id: string; heading: string; blocks: LegalBlock[]};

function isCompactLine(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.length > 0 && trimmed.length <= COMPACT_MAX_LENGTH && !SENTENCE_END.test(trimmed);
}

/** Fasst aufeinanderfolgende Datenzeilen zu einem Block zusammen. */
function toBlocks(body: string[]): LegalBlock[] {
  const blocks: LegalBlock[] = [];

  for (const line of body) {
    if (!isCompactLine(line)) {
      blocks.push({kind: 'paragraph', text: line});
      continue;
    }

    const previous = blocks[blocks.length - 1];
    if (previous && previous.kind === 'lines') {
      previous.lines.push(line);
    } else {
      blocks.push({kind: 'lines', lines: [line]});
    }
  }

  return blocks;
}

/** Ueberschrift -> Anker, kollisionssicher (zwei gleiche Ueberschriften -> "-2"). */
function toEntries(sections: LegalSection[]): LegalEntry[] {
  const used = new Set<string>();

  return sections.map((section, index) => {
    const base = slugify(section.heading) || `abschnitt-${index + 1}`;
    let id = base;
    let suffix = 2;

    while (used.has(id)) {
      id = `${base}-${suffix}`;
      suffix += 1;
    }
    used.add(id);

    return {id, heading: section.heading, blocks: toBlocks(section.body)};
  });
}

/**
 * Gibt den Text unveraendert aus und hebt nur die Platzhalter hervor.
 * `split` mit Fanggruppe liefert abwechselnd Text und Treffer — die ungeraden
 * Indizes sind also genau die Platzhalter.
 */
function renderText(text: string): ReactNode {
  const parts = text.split(OPEN_ITEM_PATTERN);
  if (parts.length === 1) {
    return text;
  }

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <span className="legal-open" key={index}>
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    )
  );
}

export function LegalPage({
  routeKey,
  translationPrefix
}: {
  routeKey: Extract<RouteKey, 'legal' | 'privacy'>;
  translationPrefix: 'legalPage' | 'privacyPage';
}) {
  const t = getTranslator();
  const entries = toEntries(routeKey === 'legal' ? impressum : datenschutz);

  return (
    <PageShell routeKey={routeKey}>
      <section className="page-hero page-hero--muted legal-hero">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">{t(`${translationPrefix}.eyebrow`)}</p>
          <h1 className="page-hero__title">{t(`${translationPrefix}.title`)}</h1>
        </div>
      </section>

      <section className="section section--page legal-doc">
        <div className="container">
          {/* Sprungmarken. Im Druck ueberfluessig, deshalb `no-print`. */}
          <nav aria-labelledby={TOC_TITLE_ID} className="legal-toc no-print">
            <p className="legal-toc__title" id={TOC_TITLE_ID}>
              {t('legalCommon.tocTitle')}
            </p>
            <ol className="legal-toc__list" role="list">
              {entries.map((entry, index) => (
                <li className="legal-toc__item" key={entry.id}>
                  <a className="legal-toc__link" href={`#${entry.id}`}>
                    {/* Die Nummer ist reine Orientierung; der Linkname bleibt
                        die Ueberschrift und stimmt damit mit dem Sprungziel
                        ueberein. */}
                    <span aria-hidden="true" className="legal-toc__index">
                      {index + 1}
                    </span>
                    <span className="legal-toc__label">{entry.heading}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="legal-doc__body">
            {entries.map((entry) => (
              <section className="legal-section" id={entry.id} key={entry.id}>
                <h2 className="legal-section__heading">{entry.heading}</h2>
                <div className="legal-section__text">
                  {entry.blocks.map((block, index) =>
                    block.kind === 'lines' ? (
                      <p className="legal-lines" key={index}>
                        {block.lines.map((line, lineIndex) => (
                          <Fragment key={lineIndex}>
                            {lineIndex > 0 ? <br /> : null}
                            {renderText(line)}
                          </Fragment>
                        ))}
                      </p>
                    ) : (
                      <p key={index}>{renderText(block.text)}</p>
                    )
                  )}
                </div>
              </section>
            ))}
          </article>
        </div>
      </section>
    </PageShell>
  );
}
