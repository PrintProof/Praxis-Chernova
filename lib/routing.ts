export type RouteKey =
  | 'home'
  | 'appointments'
  | 'prescriptions'
  | 'housecalls'
  | 'closures'
  | 'contact'
  | 'legal'
  | 'privacy';

export const routeByKey: Record<RouteKey, string> = {
  home: '/',
  appointments: '/termine',
  prescriptions: '/rezepte',
  housecalls: '/hausbesuche',
  closures: '/schliesszeiten',
  contact: '/kontakt',
  legal: '/impressum',
  privacy: '/datenschutz'
};

export function getPath(routeKey: RouteKey) {
  return routeByKey[routeKey];
}
