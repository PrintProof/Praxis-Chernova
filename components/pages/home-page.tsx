import Link from 'next/link';

import {OpeningHours} from '@/components/opening-hours';
import {PageShell} from '@/components/page-shell';
import {Section} from '@/components/section';
import {practice} from '@/content/practice';
import type {Locale} from '@/lib/i18n';
import {getTranslator} from '@/lib/i18n';
import {getLocalizedPath} from '@/lib/routing';

export function HomePage({locale}: {locale: Locale}) {
  const t = getTranslator(locale);

  return (
    <PageShell locale={locale} routeKey="home">
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy hero__copy--wide">
            <p className="hero__eyebrow">{t('hero.eyebrow')}</p>
            <h1>{practice.name}</h1>
            <p className="hero__specialty">{practice.specialty}</p>
            <p className="hero__body">{t('hero.body')}</p>
            <div className="hero__actions">
              <a className="button button--primary" href={practice.bookingUrl} target="_blank" rel="noreferrer">
                {t('cta.bookAppointment')}
              </a>
              <Link className="button button--secondary" href={getLocalizedPath(locale, 'contact')}>
                {t('cta.contactDirections')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Section
        id="quick-info"
        title={t('home.quick.title')}
      >
        <div className="overview-panel">
          <div className="overview-panel__primary">
            <OpeningHours locale={locale} />
          </div>
          <div className="overview-panel__secondary">
            <article className="info-card info-card--stack">
              <div className="info-card__row">
                <h3>{t('contact.mainPhoneTitle')}</h3>
                <p>
                  <a href={practice.phoneHref}>{practice.phone}</a>
                </p>
                <p>{t('home.quick.phoneHint')}</p>
              </div>
              <div className="info-card__row">
                <h3>{t('contact.prescriptionPhoneTitle')}</h3>
                <p>
                  <a href={practice.prescriptionPhoneHref}>{practice.prescriptionPhoneDisplay}</a>
                </p>
                <p>{t('home.quick.prescriptionHint')}</p>
              </div>
              <div className="info-card__row">
                <h3>{t('contact.addressTitle')}</h3>
                <p>{practice.address.street}</p>
                <p>
                  {practice.address.postalCode} {practice.address.city}
                </p>
                <p>{t('home.quick.addressHint')}</p>
              </div>
            </article>
          </div>
        </div>
      </Section>

      <Section
        title={t('home.organisation.title')}
      >
        <div className="note-card note-card--guide">
          <div className="guide-list">
            <div className="guide-list__row">
              <p className="guide-list__label">{t('home.organisation.items.prescriptions.label')}</p>
              <p className="guide-list__value">{practice.prescriptionNotes.orderLine}</p>
            </div>
            <div className="guide-list__row">
              <p className="guide-list__label">{t('home.organisation.items.pickup.label')}</p>
              <p className="guide-list__value">{practice.prescriptionNotes.pickupLine}</p>
            </div>
            <div className="guide-list__row">
              <p className="guide-list__label">{t('home.organisation.items.appointments.label')}</p>
              <p className="guide-list__value">{practice.prescriptionNotes.appointmentsLine}</p>
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
