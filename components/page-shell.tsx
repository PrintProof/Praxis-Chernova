import type {ReactNode} from 'react';

import {SiteFooter} from '@/components/site-footer';
import {SiteHeader} from '@/components/site-header';
import {StructuredData} from '@/components/structured-data';
import type {RouteKey} from '@/lib/routing';
import {getPath} from '@/lib/routing';

type PageShellProps = {
  routeKey: RouteKey;
  /**
   * Zeitkritisches Hinweisband (Urlaub) direkt unter der Kopfzeile und VOR
   * dem Seiten-Hero. Alternativ kann das Band auch als erstes Kind von
   * `children` stehen — optisch identisch, dann aber innerhalb von <main>.
   */
  notice?: ReactNode;
  /**
   * Overlay ueber der gesamten Seite (derzeit nur der Urlaubshinweis,
   * components/vacation-dialog.tsx). Steht bewusst VOR der Kopfzeile: sein
   * Schliessen-Bedienelement soll das erste per Tabulator erreichbare Element
   * sein, solange das Overlay die Seite verdeckt.
   */
  overlay?: ReactNode;
  children: ReactNode;
};

export function PageShell({routeKey, notice, overlay, children}: PageShellProps) {
  return (
    <>
      <StructuredData pathname={getPath(routeKey)} />
      {overlay}
      <SiteHeader currentRoute={routeKey} />
      {notice}
      {/* tabIndex sorgt dafuer, dass der Skip-Link den Fokus wirklich versetzt. */}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
