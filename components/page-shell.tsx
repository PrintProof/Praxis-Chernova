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
  children: ReactNode;
};

export function PageShell({routeKey, notice, children}: PageShellProps) {
  return (
    <>
      <StructuredData pathname={getPath(routeKey)} />
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
