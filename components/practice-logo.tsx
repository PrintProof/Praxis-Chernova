type PracticeLogoProps = {
  className?: string;
  /** Rein dekorativ — der Praxisname steht als Text daneben. Standard: true. */
  decorative?: boolean;
  /** Nur relevant bei `decorative={false}`: der zugaengliche Name der Bildmarke. */
  label?: string;
};

/**
 * Bildmarke der Praxis: ein Stethoskop, dessen Buegel ein Herz umschliesst.
 *
 * Das ist das bestehende Logo der Praxis und bleibt unveraendert — es wurde
 * beim Redesign 2026-08 ausdruecklich beibehalten. Nicht neu zeichnen, nicht
 * vereinfachen, nicht umfaerben.
 *
 * Farben:
 * - Stethoskop: `currentColor`, gesetzt ueber `--logo-ink` (Dunkelblau #183753).
 *   Bewusst NICHT `--brand`: die Marke ist unabhaengig von der Bordeaux-
 *   Palette der Website und darf nicht mitwandern, wenn die Palette sich aendert.
 * - Herz: `--logo-heart` (Altrosa #a74d5f).
 *
 * Dieselben Farben und Pfade stehen als Favicon in `app/icon.svg` — Aenderungen
 * hier muessen dort nachgezogen werden.
 *
 * Das viewBox ist 80x64, also 5:4 und NICHT quadratisch. Wer die Groesse setzt,
 * muss das Seitenverhaeltnis wahren (siehe `.site-brand__mark` in layout.css),
 * sonst wird das Logo gestaucht.
 */
export function PracticeLogo({
  className,
  decorative = true,
  label = 'Praxis Veronika Chernova'
}: PracticeLogoProps) {
  const accessibilityProps = decorative
    ? ({'aria-hidden': true, focusable: false} as const)
    : ({role: 'img', 'aria-label': label} as const);

  return (
    <svg
      viewBox="0 0 80 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...accessibilityProps}
    >
      {/* Herz zwischen den Ohrbuegeln. */}
      <path
        d="M40 11.6C37.5 7.6 31.8 6.8 28.4 10.1C24.9 13.4 25.2 19 28.8 22.1L40 31.4L51.2 22.1C54.8 19 55.1 13.4 51.6 10.1C48.2 6.8 42.5 7.6 40 11.6Z"
        fill="var(--logo-heart)"
      />
      {/* Linker und rechter Ohrbuegel. */}
      <path
        d="M24 15.5L20.1 18.8C18.5 20.1 17.6 22 17.6 24.1V27.1"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M56 15.5L59.9 18.8C61.5 20.1 62.4 22 62.4 24.1V27.1"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Schlauch zur Bruststueck-Seite. */}
      <path
        d="M17.6 27.1C17.6 41.5 27.3 50.4 40.7 50.4H47.9C54.8 50.4 60.4 56 60.4 62.9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M62.4 27.1C62.4 38.2 53.4 47.2 42.3 47.2H39.6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bruststueck. */}
      <circle cx="62.4" cy="59.5" r="4.8" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="62.4" cy="59.5" r="1.6" fill="var(--logo-heart)" />
    </svg>
  );
}
