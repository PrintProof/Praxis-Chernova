import type {Metadata} from 'next';

import {getPath, type RouteKey} from '@/lib/routing';

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://praxis-chernova.invalid';

/**
 * Basis IMMER mit abschliessendem Schraegstrich.
 *
 * Auf GitHub Pages liegt die Seite in einem Unterverzeichnis
 * (https://…/Praxis-Chernova). `new URL('/leistungen', base)` wuerde dieses
 * Verzeichnis verschlucken, weil ein absoluter Pfad gegen den ORIGIN aufgeloest
 * wird — Canonical, OpenGraph, JSON-LD, sitemap.xml und robots.txt zeigten dann
 * auf Adressen, die es nicht gibt. Deshalb wird der Pfad unten RELATIV zur
 * Basis aufgeloest, und dafuer muss die Basis auf "/" enden.
 */
const siteUrl = rawSiteUrl.endsWith('/') ? rawSiteUrl : `${rawSiteUrl}/`;

export function getSiteUrl(pathname = '/') {
  // Fuehrende Schraegstriche entfernen -> relative Aufloesung, Basispfad bleibt.
  return new URL(pathname.replace(/^\/+/, ''), siteUrl).toString();
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
