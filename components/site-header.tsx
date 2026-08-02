import Link from 'next/link';

import {Calendar, Phone} from '@/components/illustrations';
import {PracticeLogo} from '@/components/practice-logo';
import {practice} from '@/content/practice';
import {getTranslator} from '@/lib/i18n';
import {getPath, type RouteKey} from '@/lib/routing';

/**
 * Hauptnavigation. Leistungen steht bewusst NICHT hier: die Seite traegt eine
 * einzige Aussage, und gemessen passen sechs Punkte nicht in die einreihige
 * Kopfzeile — Marke 300 + Navigation 462 + Rufnummer 44 + Button 218 + Abstaende
 * ergeben 1072px, der Container fasst 1008px. Erreichbar bleibt sie ueber die
 * Fusszeile und den Verweis im Abschnitt "Sprechzeiten" der Startseite.
 */
const navItems = ['home', 'appointments', 'prescriptions', 'news', 'contact'] as const;

/**
 * Kopfzeile: Marke links, Navigation, rechts die Aktionen.
 *
 * HAUPTAKTION IST DER ONLINE-TERMIN (Kundenentscheidung). Der Button fuehrt
 * auf `practice.bookingUrl` (arzt-direkt), externer Link, neuer Tab,
 * rel="noreferrer".
 *
 * Der Sachverhalt "gilt nur fuer Bestandspatientinnen und Bestandspatienten"
 * steht IM Button als zweite Zeile (`cta.bookOnlineAudience`), nicht mehr als
 * eigene Zeile daneben. Gruende:
 *   1. Eindeutiger Bezug. Neben dem Button begann die Zeile unter der
 *      RUFNUMMER und liess sich als deren Einschraenkung lesen.
 *   2. Sie gilt auf JEDER Breite. Die separate Zeile war unter 40em
 *      ausgeblendet — ausgerechnet auf dem Telefon fehlte sie.
 *   3. Der zugaengliche Name entspricht dem sichtbaren Text (WCAG 2.5.3),
 *      ohne visually-hidden Zusatz fuer die Einschraenkung.
 * Die ausfuehrliche Regel (neue Patientinnen und Patienten bitte anrufen)
 * steht im Hero der Startseite, auf /leistungen und kanonisch auf /kontakt.
 *
 * Die Rufnummer steht daneben als dezenter Icon-Link, bewusst NICHT als
 * zweiter grosser Button. Was sichtbar ist, ist gestaffelt — jede Schwelle ist
 * gemessen, nicht geschaetzt (Rechnungen stehen an den Regeln in layout.css):
 *   < 24em  Menue nur als Symbol, kein Anruf-Link (bei 320px bleiben 288px)
 *   >= 24em Menue mit Beschriftung
 *   >= 26em zusaetzlich der Anruf-Icon-Link
 *   >= 32em Anruf-Link mit ausgeschriebener Rufnummer
 *   >= 68em eine Reihe: Marke | Navigation | Anruf-Symbol + Button.
 *           Die ausgeschriebene Nummer faellt hier wieder weg: einreihig
 *           braeuchte die Reihe sonst 1068px, der Container fasst 1008px.
 * Der Zusatz im Button ist auf JEDER Breite sichtbar — er ist die Aussage,
 * um die es geht, und faellt deshalb als Letztes weg (naemlich nie).
 *
 * Das mobile Menue ist reines CSS: <details> schaltet ueber den
 * Geschwisterselektor `.site-menu[open] ~ .site-nav` die Navigation sichtbar.
 * Kein 'use client', kein JavaScript im Browser.
 */
export function SiteHeader({currentRoute}: {currentRoute: RouteKey}) {
  const t = getTranslator();

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        {t('accessibility.skipToContent')}
      </a>

      <div className="container site-header__inner">
        <Link className="site-brand" href={getPath('home')} aria-label={t('common.homeAria')}>
          <PracticeLogo className="site-brand__mark" decorative />
          <span className="site-brand__name">{practice.name}</span>
        </Link>

        <details className="site-menu">
          <summary className="site-menu__toggle" aria-label={t('nav.menuAria')}>
            <svg
              className="site-menu__icon site-menu__icon--closed"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <svg
              className="site-menu__icon site-menu__icon--open"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            <span className="site-menu__label">{t('nav.menu')}</span>
          </summary>
        </details>

        <nav className="site-nav" aria-label={t('nav.primary')}>
          <ul className="site-nav__list" role="list">
            {navItems.map((item) => {
              const isCurrent = item === currentRoute;

              return (
                <li className="site-nav__item" key={item}>
                  <Link
                    className="site-nav__link"
                    href={getPath(item)}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {t(`nav.${item}`)}
                    {isCurrent ? (
                      <span className="visually-hidden"> ({t('accessibility.currentPage')})</span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="site-header__actions">
          {/* Sekundaer: die Rufnummer. Der zugaengliche Name kommt aus dem
              aria-label und enthaelt die sichtbare Nummer (WCAG 2.5.3). */}
          <a
            className="site-header__call"
            href={practice.phoneHref}
            aria-label={t('cta.callAria', {phone: practice.phone})}
          >
            <Phone className="site-header__call-icon" />
            <span className="site-header__call-number">{practice.phone}</span>
          </a>

          {/* Primaeraktion der gesamten Website.
              Die Einschraenkung steht IM Button (zweite Zeile) statt daneben:
              so ist ihr Bezug eindeutig, sie gilt auf jeder Breite und der
              zugaengliche Name entspricht dem sichtbaren Text (WCAG 2.5.3). */}
          <a
            className="button button--primary button--booking site-header__cta"
            href={practice.bookingUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Calendar className="button__icon" />
            <span className="button__text">
              <span className="button__label">{t('cta.bookOnlineShort')}</span>
              <span className="button__note">{t('cta.bookOnlineAudience')}</span>
            </span>
            <span className="visually-hidden"> ({t('accessibility.newTabHint')})</span>
          </a>
        </div>

      </div>
    </header>
  );
}
