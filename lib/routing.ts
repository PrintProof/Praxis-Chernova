import type {Locale} from '@/lib/i18n';

export type RouteKey =
  | 'home'
  | 'services'
  | 'contact'
  | 'legal'
  | 'privacy';

export const routeByKey: Record<RouteKey, string> = {
  home: '/',
  services: '/leistungen',
  contact: '/kontakt',
  legal: '/impressum',
  privacy: '/datenschutz'
};

export function getLocalizedPath(locale: Locale, routeKey: RouteKey) {
  const pathname = routeByKey[routeKey];
  if (locale === 'de') {
    return pathname;
  }

  return pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
}
