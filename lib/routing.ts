export type RouteKey =
  | 'home'
  | 'appointments'
  | 'prescriptions'
  | 'services'
  | 'housecalls'
  | 'closures'
  | 'contact'
  | 'legal'
  | 'privacy';

export const routeByKey: Record<RouteKey, string> = {
  home: '/',
  appointments: '/termine',
  prescriptions: '/rezepte',
  services: '/leistungen',
  housecalls: '/hausbesuche',
  closures: '/schliesszeiten',
  contact: '/kontakt',
  legal: '/impressum',
  privacy: '/datenschutz'
};

export function getPath(routeKey: RouteKey) {
  return routeByKey[routeKey];
}
