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
  // Hiess bis September 2026 /schliesszeiten. Die Praxis nennt die Seite
  // "Urlaubszeiten" und wollte den Pfad mitziehen — die alte Adresse war nie
  // im Umlauf, also gibt es nichts, was dadurch tot laufen koennte.
  closures: '/urlaubszeiten',
  contact: '/kontakt',
  legal: '/impressum',
  privacy: '/datenschutz'
};

export function getPath(routeKey: RouteKey) {
  return routeByKey[routeKey];
}
