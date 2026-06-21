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

export function getPath(routeKey: RouteKey) {
  return routeByKey[routeKey];
}
