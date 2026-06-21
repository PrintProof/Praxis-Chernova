import type {Metadata} from 'next';

import {getPath, type RouteKey} from '@/lib/routing';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://praxis-chernova.invalid';

export function getSiteUrl(pathname = '/') {
  return new URL(pathname, siteUrl).toString();
}

export function buildMetadata({
  routeKey,
  title,
  description
}: {
  routeKey: RouteKey;
  title: string;
  description: string;
}): Metadata {
  const canonicalPath = getPath(routeKey);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: getSiteUrl(canonicalPath)
    },
    openGraph: {
      title,
      description,
      locale: 'de_DE',
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
