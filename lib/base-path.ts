/**
 * Der Basispfad der Website — die EINE Quelle dafuer.
 *
 * Seit September 2026 laeuft die Seite unter der eigenen Domain
 * praxis-chernova.de und liegt dort im Wurzelverzeichnis. Der Basispfad ist
 * deshalb ueberall leer — lokal wie in Produktion.
 *
 * Bis dahin war sie nur ueber GitHub Pages im Unterverzeichnis
 * /Praxis-Chernova erreichbar, und der Pfad wurde allein im Actions-Build
 * gesetzt. Die Konstante bleibt, weil `next.config.ts` sie importiert und
 * `assetPath()` sie voranstellt: Sollte die Seite je wieder in einem
 * Unterverzeichnis liegen, ist das hier die einzige Stelle. Deshalb bewusst
 * OHNE `@/`-Alias importierbar (relativer Pfad) und ohne jede weitere
 * Abhaengigkeit: die Datei wird auch beim Laden der Next-Konfiguration
 * ausgewertet, lange bevor es eine React-Umgebung gibt.
 */
export const basePath = '';

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
