import type {Metadata} from 'next';

import type {Locale} from '@/lib/i18n';
import {defaultLocale, locales} from '@/lib/i18n';
import {getLocalizedPath, type RouteKey} from '@/lib/routing';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://praxis-chernova.invalid';

export function getSiteUrl(pathname = '/') {
  return new URL(pathname, siteUrl).toString();
}

export function buildMetadata({
  locale,
  routeKey,
  title,
  description
}: {
  locale: Locale;
  routeKey: RouteKey;
  title: string;
  description: string;
}): Metadata {
  const canonicalPath = getLocalizedPath(locale, routeKey);
  const languages = Object.fromEntries(
    locales.map((availableLocale) => [
      availableLocale === defaultLocale ? 'de' : availableLocale,
      getSiteUrl(getLocalizedPath(availableLocale, routeKey))
    ])
  );

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: getSiteUrl(canonicalPath),
      languages: {
        ...languages,
        'x-default': getSiteUrl(getLocalizedPath(defaultLocale, routeKey))
      }
    },
    openGraph: {
      title,
      description,
      locale,
      type: 'website',
      url: getSiteUrl(canonicalPath),
      siteName: 'Praxis Veronika Chernova'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}
