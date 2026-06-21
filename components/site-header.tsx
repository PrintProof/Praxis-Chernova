import Link from 'next/link';

import {PracticeLogo} from '@/components/practice-logo';
import {practice} from '@/content/practice';
import {getTranslator} from '@/lib/i18n';
import {getPath, type RouteKey} from '@/lib/routing';

const navItems: RouteKey[] = ['home', 'services', 'contact'];

export function SiteHeader({currentRoute}: {currentRoute: RouteKey}) {
  const t = getTranslator();

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        {t('accessibility.skipToContent')}
      </a>
      <div className="container site-header__inner">
        <Link className="site-brand" href={getPath('home')}>
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
                href={getPath(item)}
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
