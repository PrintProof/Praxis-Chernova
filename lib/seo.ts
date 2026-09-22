import type {Metadata} from 'next';

import {getPath, type RouteKey} from '@/lib/routing';

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://praxis-chernova.invalid';

/**
 * Basis IMMER mit abschliessendem Schraegstrich.
 *
 * Unter praxis-chernova.de liegt die Seite im Wurzelverzeichnis, die Basis hat
 * also keinen Pfadanteil. Die relative Aufloesung unten bleibt trotzdem:
 * Laege die Seite je wieder in einem Unterverzeichnis (bis September 2026 war
 * das https://…/Praxis-Chernova), wuerde `new URL('/termine', base)` dieses
 * Verzeichnis verschlucken — ein absoluter Pfad wird gegen den ORIGIN
 * aufgeloest, und Canonical, OpenGraph, JSON-LD, sitemap.xml und robots.txt
 * zeigten auf Adressen, die es nicht gibt. Dafuer muss die Basis auf "/" enden.
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
