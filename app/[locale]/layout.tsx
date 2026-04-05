import type {ReactNode} from 'react';
import {notFound} from 'next/navigation';

import {defaultLocale, isLocale, locales} from '@/lib/i18n';

export function generateStaticParams() {
  return locales
    .filter((locale) => locale !== defaultLocale)
    .map((locale) => ({locale}));
}

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return children;
}
