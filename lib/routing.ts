export type RouteKey =
  | 'home'
  | 'appointments'
  | 'prescriptions'
  | 'services'
  | 'news'
  | 'contact'
  | 'legal'
  | 'privacy';

export const routeByKey: Record<RouteKey, string> = {
  home: '/',
  appointments: '/termine',
  prescriptions: '/rezepte',
  services: '/leistungen',
  news: '/aktuelles',
  contact: '/kontakt',
  legal: '/impressum',
  privacy: '/datenschutz'
};

export function getPath(routeKey: RouteKey) {
  return routeByKey[routeKey];
}
