/**
 * Der Basispfad der Website — die EINE Quelle dafuer.
 *
 * Lokal laeuft die Seite unter "/", auf GitHub Pages liegt sie im
 * Unterverzeichnis /Praxis-Chernova. `next.config.ts` importiert `basePath`
 * von hier, damit Konfiguration und Anwendungscode nicht auseinanderlaufen
 * koennen. Deshalb bewusst OHNE `@/`-Alias importierbar (relativer Pfad) und
 * ohne jede weitere Abhaengigkeit: die Datei wird auch beim Laden der
 * Next-Konfiguration ausgewertet, lange bevor es eine React-Umgebung gibt.
 */
export const repoName = 'Praxis-Chernova';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export const basePath = isGitHubPages ? `/${repoName}` : '';

/**
 * Adresse einer Datei aus `public/`, mit Basispfad davor.
 *
 * Next setzt den Basispfad nur bei `<Link>` und bei den eigenen Assets
 * automatisch. Ein gewoehnliches `<a href="/downloads/…">` auf eine Datei aus
 * `public/` bekommt ihn NICHT — der Link liefe auf GitHub Pages ins Leere.
 * Deshalb laufen alle Verweise auf solche Dateien durch diese Funktion.
 *
 * `<Link>` waere hier falsch: die Ziele sind keine Routen, Next wuerde sie
 * vorzuladen versuchen.
 */
export function assetPath(path: string): string {
  return `${basePath}/${path.replace(/^\/+/, '')}`;
}
