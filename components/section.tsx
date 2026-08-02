import type {ReactNode} from 'react';

/**
 * Flaechenrolle des Abschnitts. Bestimmt den Hintergrund und damit den
 * Rhythmus der Seite. Faustregel: hoechstens zwei aufeinanderfolgende
 * Abschnitte duerfen dieselbe Flaeche haben — sonst ein `muted`-Band
 * dazwischenschieben. `dark` ist dem Footer vorbehalten und nur in
 * begruendeten Ausnahmen zu verwenden.
 */
export type SectionTone = 'page' | 'muted' | 'surface' | 'dark';

/** Breite des inneren Containers. */
export type SectionWidth = 'default' | 'narrow' | 'wide';

/** Vertikale Luft. `lg` fuer Seitenabschluss/Hero-nahe Bloecke, `sm` fuer Anhaenge. */
export type SectionSpacing = 'default' | 'lg' | 'sm';

type SectionProps = {
  /** id des Abschnitts (Sprungziel). */
  id?: string;
  /** Zusaetzliche Klassen auf dem Abschnitts-Element. */
  className?: string;
  /** Kleine Zeile ueber der Ueberschrift. Bis ca. 30 Zeichen. */
  eyebrow?: string;
  /**
   * Sichtbare Ueberschrift des Abschnitts. Optional — Abschnitte ohne
   * Ueberschrift (z.B. reine Hinweisbaender) lassen sie weg.
   */
  title?: string;
  /** Ueberschriftenebene. Standard 2. Genau ein <h1> pro Seite liegt im Hero. */
  titleLevel?: 2 | 3;
  /** Ueberschrift nur fuer Screenreader ausgeben (bleibt in der Hierarchie). */
  titleHidden?: boolean;
  /** Erklaersatz unter der Ueberschrift. */
  description?: string;
  /** Reicher Inhalt unter der Ueberschrift (statt/zusaetzlich zu `description`). */
  headerExtra?: ReactNode;
  /** Flaechenrolle. Standard 'page' (direkt auf dem Creme-Hintergrund). */
  tone?: SectionTone;
  /** Containerbreite. Standard 'default'. */
  width?: SectionWidth;
  /** Vertikale Luft. Standard 'default'. */
  spacing?: SectionSpacing;
  /** Kopf zentrieren. Sparsam einsetzen. */
  center?: boolean;
  /** Haarlinie oberhalb des Abschnitts. Nur wenn Luft allein mehrdeutig waere. */
  divided?: boolean;
  /** Oberen bzw. unteren Innenabstand entfernen (fuer direkt anschliessende Baender). */
  flushTop?: boolean;
  flushBottom?: boolean;
  /** Haarlinie unter dem Abschnittskopf. */
  ruledHeader?: boolean;
  /** Wrapper-Element. Standard 'section'. */
  as?: 'section' | 'aside' | 'div';
  /** aria-label des Abschnitts (z.B. t('emergency.regionLabel')). */
  ariaLabel?: string;
  /** Klassen auf dem inneren Container. */
  containerClassName?: string;
  children?: ReactNode;
};

const toneClass: Record<SectionTone, string> = {
  page: 'section--page',
  muted: 'section--muted',
  surface: 'section--surface',
  dark: 'section--dark'
};

const widthClass: Record<SectionWidth, string> = {
  default: '',
  narrow: 'container--narrow',
  wide: 'container--wide'
};

const spacingClass: Record<SectionSpacing, string> = {
  default: '',
  lg: 'section--lg',
  sm: 'section--sm'
};

function cx(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ');
}

/**
 * Standardabschnitt der Seite: volle Breite als Flaeche, innen ein Container.
 *
 * Der Abschnittskopf (eyebrow / Ueberschrift / Beschreibung) wird nur
 * gerendert, wenn es ihn wirklich gibt — leere Slots sind ausdruecklich
 * unerwuenscht.
 */
export function Section({
  id,
  className,
  eyebrow,
  title,
  titleLevel = 2,
  titleHidden = false,
  description,
  headerExtra,
  tone = 'page',
  width = 'default',
  spacing = 'default',
  center = false,
  divided = false,
  flushTop = false,
  flushBottom = false,
  ruledHeader = false,
  as: Element = 'section',
  ariaLabel,
  containerClassName,
  children
}: SectionProps) {
  const Heading = (titleLevel === 3 ? 'h3' : 'h2') as 'h2' | 'h3';
  const hasHeader = Boolean(eyebrow || title || description || headerExtra);

  return (
    <Element
      id={id}
      aria-label={ariaLabel}
      className={cx(
        'section',
        toneClass[tone],
        spacingClass[spacing],
        center && 'section--center',
        divided && 'section--divided',
        flushTop && 'section--flush-top',
        flushBottom && 'section--flush-bottom',
        className
      )}
    >
      <div className={cx('container', widthClass[width], containerClassName)}>
        {hasHeader ? (
          <div className={cx('section__header', ruledHeader && 'section__header--ruled')}>
            {eyebrow ? <p className="section__eyebrow">{eyebrow}</p> : null}
            {title ? (
              <Heading className={cx('section__title', titleHidden && 'visually-hidden')}>
                {title}
              </Heading>
            ) : null}
            {description ? <p className="section__description">{description}</p> : null}
            {headerExtra}
          </div>
        ) : null}
        {children}
      </div>
    </Element>
  );
}
