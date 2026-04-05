import type {MetadataRoute} from 'next';

import {locales} from '@/lib/i18n';
import {routeByKey, getLocalizedPath, type RouteKey} from '@/lib/routing';
import {getSiteUrl} from '@/lib/seo';

export const dynamic = 'force-static';

const routeKeys = Object.keys(routeByKey) as RouteKey[];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    routeKeys.map((routeKey) => ({
      url: getSiteUrl(getLocalizedPath(locale, routeKey)),
      lastModified: new Date()
    }))
  );
}
