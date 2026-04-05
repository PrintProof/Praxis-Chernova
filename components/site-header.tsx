import Link from 'next/link';

import {PracticeLogo} from '@/components/practice-logo';
import {practice} from '@/content/practice';
import type {Locale} from '@/lib/i18n';
import {getTranslator, locales} from '@/lib/i18n';
import {getLocalizedPath, type RouteKey} from '@/lib/routing';

const navItems: RouteKey[] = ['home', 'services', 'contact'];
const localeLabels: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  tr: 'Türkçe',
  ru: 'Русский'
};

export function SiteHeader({locale, currentRoute}: {locale: Locale; currentRoute: RouteKey}) {
  const t = getTranslator(locale);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        {t('accessibility.skipToContent')}
      </a>
      <div className="site-header__utility">
        <div className="container site-header__utility-inner">
          <div className="site-header__language-bar">
            <p className="site-header__language-label">{t('header.languageLabel')}</p>
            <div className="locale-switcher" aria-label={t('nav.language')}>
              {locales.map((availableLocale) => (
                <Link
                  key={availableLocale}
                  className={
                    availableLocale === locale
                      ? 'locale-switcher__link is-active'
                      : 'locale-switcher__link'
                  }
                  href={getLocalizedPath(availableLocale, currentRoute)}
                  hrefLang={availableLocale}
                  lang={availableLocale}
                >
                  {localeLabels[availableLocale]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="container site-header__inner">
        <Link className="site-brand" href={getLocalizedPath(locale, 'home')}>
          <PracticeLogo className="site-brand__mark" decorative />
          <span className="site-brand__text">
            <span className="site-brand__name">{practice.name}</span>
            <span className="site-brand__specialty">{t('common.specialtyShort')}</span>
          </span>
        </Link>
        <div className="site-header__meta">
          <nav aria-label={t('nav.primary')} className="site-nav">
            {navItems.map((item) => (
              <Link
                key={item}
                className={item === currentRoute ? 'site-nav__link is-active' : 'site-nav__link'}
                href={getLocalizedPath(locale, item)}
              >
                {t(`nav.${item}`)}
              </Link>
            ))}
          </nav>
          <a className="button button--primary" href={practice.bookingUrl} target="_blank" rel="noreferrer">
            {t('cta.bookAppointment')}
          </a>
        </div>
      </div>
    </header>
  );
}
