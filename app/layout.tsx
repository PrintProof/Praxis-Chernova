import type {ReactNode} from 'react';

import '@/app/globals.css';
import {defaultLocale, isLocale} from '@/lib/i18n';

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale?: string}>;
}) {
  const {locale} = await params;
  const resolvedLocale = locale && isLocale(locale) ? locale : defaultLocale;

  return (
    <html lang={resolvedLocale}>
      <body>{children}</body>
    </html>
  );
}
