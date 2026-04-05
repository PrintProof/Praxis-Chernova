import Link from 'next/link';

import {PracticeLogo} from '@/components/practice-logo';
import {practice} from '@/content/practice';
import type {Locale} from '@/lib/i18n';
import {getTranslator} from '@/lib/i18n';
import {getLocalizedPath} from '@/lib/routing';

export function SiteFooter({locale}: {locale: Locale}) {
  const t = getTranslator(locale);

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid site-footer__grid--simple">
        <div className="site-footer__block">
          <div className="site-footer__brand">
            <PracticeLogo className="site-footer__mark" decorative />
            <div>
              <p className="site-footer__eyebrow">{practice.name}</p>
              <p className="site-footer__specialty">{practice.specialty}</p>
            </div>
          </div>
          <p>
            {practice.address.street}
            <br />
            {practice.address.postalCode} {practice.address.city}
          </p>
        </div>
        <div className="site-footer__block">
          <h2>{t('footer.contactTitle')}</h2>
          <dl className="site-footer__contact-list">
            <div className="site-footer__contact-row">
              <dt>{t('contact.mainPhoneTitle')}</dt>
              <dd>
                <a href={practice.phoneHref}>{practice.phone}</a>
              </dd>
            </div>
            <div className="site-footer__contact-row">
              <dt>{t('contact.prescriptionPhoneTitle')}</dt>
              <dd>
                <a href={practice.prescriptionPhoneHref}>{practice.prescriptionPhoneDisplay}</a>
              </dd>
            </div>
            <div className="site-footer__contact-row">
              <dt>{t('contact.faxLabel')}</dt>
              <dd>{practice.fax}</dd>
            </div>
          </dl>
        </div>
        <div className="site-footer__block">
          <h2>{t('footer.legalTitle')}</h2>
          <p className="site-footer__legal-links">
            <Link href={getLocalizedPath(locale, 'legal')}>{t('nav.legal')}</Link>
            <Link href={getLocalizedPath(locale, 'privacy')}>{t('nav.privacy')}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
