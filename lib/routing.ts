export type RouteKey =
  | 'home'
  | 'appointments'
  | 'prescriptions'
  | 'extras'
  | 'closures'
  | 'contact'
  | 'legal'
  | 'privacy';

export const routeByKey: Record<RouteKey, string> = {
  home: '/',
  appointments: '/termine',
  prescriptions: '/rezepte',
  // Seit September 2026: Angebote der Praxis, die nicht zur Regelversorgung
  // gehoeren. Bewusst NICHT "/leistungen" — die Seite hat die Praxis im August
  // 2026 abgeschafft, und "Extra-Leistungen" ist ihr eigenes Wort dafuer.
  extras: '/extra-leistungen',
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
