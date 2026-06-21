import type {ReactNode} from 'react';

import {SiteFooter} from '@/components/site-footer';
import {SiteHeader} from '@/components/site-header';
import {StructuredData} from '@/components/structured-data';
import type {RouteKey} from '@/lib/routing';
import {getPath} from '@/lib/routing';

type PageShellProps = {
  routeKey: RouteKey;
  children: ReactNode;
};

export function PageShell({routeKey, children}: PageShellProps) {
  return (
    <>
      <StructuredData pathname={getPath(routeKey)} />
      <SiteHeader currentRoute={routeKey} />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}
