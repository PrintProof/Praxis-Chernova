import type {ReactNode} from 'react';

import {SiteFooter} from '@/components/site-footer';
import {SiteHeader} from '@/components/site-header';
import {StructuredData} from '@/components/structured-data';
import type {Locale} from '@/lib/i18n';
import type {RouteKey} from '@/lib/routing';
import {getLocalizedPath} from '@/lib/routing';

type PageShellProps = {
  locale: Locale;
  routeKey: RouteKey;
  children: ReactNode;
};

export function PageShell({locale, routeKey, children}: PageShellProps) {
  return (
    <>
      <StructuredData locale={locale} pathname={getLocalizedPath(locale, routeKey)} />
      <SiteHeader locale={locale} currentRoute={routeKey} />
      <main id="main-content">{children}</main>
      <SiteFooter locale={locale} />
    </>
  );
}
