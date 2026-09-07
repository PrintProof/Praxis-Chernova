export type RouteKey =
  | 'home'
  | 'appointments'
  | 'prescriptions'
  | 'closures'
  | 'contact'
  | 'legal'
  | 'privacy';

export const routeByKey: Record<RouteKey, string> = {
  home: '/',
  appointments: '/termine',
  prescriptions: '/rezepte',
  // Der Pfad heisst weiterhin /schliesszeiten, die Seite ueberall
  // "Urlaubszeiten" (Wunsch der Praxis, September 2026). Die Umbenennung des
  // Pfades waere ein toter Link fuer alles, was die Praxis schon verteilt hat.
  closures: '/schliesszeiten',
  contact: '/kontakt',
  legal: '/impressum',
  privacy: '/datenschutz'
};

export function getPath(routeKey: RouteKey) {
  return routeByKey[routeKey];
}
