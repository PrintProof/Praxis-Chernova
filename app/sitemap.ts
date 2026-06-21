import type {MetadataRoute} from 'next';

import {routeByKey, getPath, type RouteKey} from '@/lib/routing';
import {getSiteUrl} from '@/lib/seo';

export const dynamic = 'force-static';

const routeKeys = Object.keys(routeByKey) as RouteKey[];

export default function sitemap(): MetadataRoute.Sitemap {
  return routeKeys.map((routeKey) => ({
    url: getSiteUrl(getPath(routeKey)),
    lastModified: new Date()
  }));
}
