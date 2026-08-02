export type RouteKey =
  | 'home'
  | 'services'
  | 'news'
  | 'contact'
  | 'legal'
  | 'privacy';

export const routeByKey: Record<RouteKey, string> = {
  home: '/',
  services: '/leistungen',
  news: '/aktuelles',
  contact: '/kontakt',
  legal: '/impressum',
  privacy: '/datenschutz'
};

export function getPath(routeKey: RouteKey) {
  return routeByKey[routeKey];
}
