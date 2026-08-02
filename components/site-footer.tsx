import Link from 'next/link';

import {PracticeLogo} from '@/components/practice-logo';
import {practice} from '@/content/practice';
import {getTranslator} from '@/lib/i18n';
import {getPath, type RouteKey} from '@/lib/routing';

const primaryRoutes = [
  'home',
  'appointments',
  'prescriptions',
  'housecalls',
  'services',
  'closures',
  'contact'
] as const;
const legalRoutes = ['legal', 'privacy'] as const satisfies readonly RouteKey[];

/**
 * Fusszeile: drei schmale Bloecke.
 *
 * 1. Identitaet — Praxisname und Anschrift (Standortanker, eine Zeile).
 * 2. Navigation — die vier Hauptseiten.
 * 3. Rechtliches — Impressum und Datenschutz (Pflicht auf jeder Seite).
 *
 * Bewusst NICHT mehr hier: Telefon, Rezepttelefon und Fax (standen dreifach
 * auf der Seite; sie leben jetzt ausschliesslich auf /kontakt), die
 * Fachbezeichnung und der 116-117-Hinweis (der gehoert laut Vorgabe nur auf
 * /schliesszeiten und /kontakt — im Footer stuende er auf jeder Seite).
 *
 * Die Blockueberschriften sind <p>, kein <h2>: sonst wuerde die
 * Ueberschriftenhierarchie der Seite am Ende noch einmal aufgemacht.
 */
export function SiteFooter() {
  const t = getTranslator();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__block">
          <div className="site-footer__brand">
            <PracticeLogo className="site-footer__mark" decorative />
            <p className="site-footer__name">{practice.name}</p>
          </div>
          {/* Das Label steht IM <address>, nicht als aria-labelledby: <address>
              hat keine implizite ARIA-Rolle, ein Label von aussen wuerde von
              vielen Screenreadern ignoriert. */}
          <address className="site-footer__address">
            <span className="visually-hidden">{t('footer.addressLabel')}: </span>
            {practice.address.street}
            <br />
            {practice.address.postalCode} {practice.address.city}
          </address>
        </div>

        <div className="site-footer__block">
          <p className="site-footer__title">{t('footer.navTitle')}</p>
          <nav aria-label={t('nav.footer')}>
            <ul className="site-footer__links" role="list">
              {primaryRoutes.map((route) => (
                <li key={route}>
                  <Link className="site-footer__link" href={getPath(route)}>
                    {t(`nav.${route}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="site-footer__block">
          <p className="site-footer__title">{t('footer.legalTitle')}</p>
          <ul className="site-footer__links" role="list">
            {legalRoutes.map((route) => (
              <li key={route}>
                <Link className="site-footer__link" href={getPath(route)}>
                  {t(`nav.${route}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
