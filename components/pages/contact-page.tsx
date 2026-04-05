import {OpeningHours} from '@/components/opening-hours';
import {PageShell} from '@/components/page-shell';
import {Section} from '@/components/section';
import {practice} from '@/content/practice';
import type {Locale} from '@/lib/i18n';
import {getTranslator} from '@/lib/i18n';

export function ContactPage({locale}: {locale: Locale}) {
  const t = getTranslator(locale);

  return (
    <PageShell locale={locale} routeKey="contact">
      <section className="page-hero">
        <div className="container">
          <h1>{t('contact.title')}</h1>
        </div>
      </section>

      <Section title={t('contact.visitTitle')}>
        <div className="info-grid">
          <article className="info-card">
            <h3>{t('contact.addressTitle')}</h3>
            <p>{practice.address.street}</p>
            <p>
              {practice.address.postalCode} {practice.address.city}
            </p>
            <p>{practice.address.district}</p>
          </article>
          <article className="info-card">
            <h3>{t('contact.mainPhoneTitle')}</h3>
            <p>
              <a href={practice.phoneHref}>{practice.phone}</a>
            </p>
            <p>{t('contact.mainPhoneDescription')}</p>
          </article>
          <article className="info-card">
            <h3>{t('contact.prescriptionPhoneTitle')}</h3>
            <p>
              <a href={practice.prescriptionPhoneHref}>{practice.prescriptionPhoneDisplay}</a>
            </p>
            <p>{t('contact.prescriptionPhoneDescription')}</p>
          </article>
          <article className="info-card">
            <h3>{t('contact.faxLabel')}</h3>
            <p>{practice.fax}</p>
          </article>
        </div>
      </Section>

      <Section title={t('contact.openingHoursSectionTitle')}>
        <OpeningHours locale={locale} />
      </Section>

      <Section title={t('contact.organisationTitle')}>
        <div className="note-stack">
          <article className="note-card">
            <h3>{t('contact.prescriptionsTitle')}</h3>
            <p>{t('contact.prescriptionsLineOne')}</p>
            <p>{t('contact.prescriptionsLineTwo')}</p>
          </article>
          <article className="note-card">
            <h3>{t('contact.appointmentsTitle')}</h3>
            <p>{t('contact.appointmentsLine')}</p>
          </article>
          <article className="note-card">
            <h3>{t('contact.houseCallsTitle')}</h3>
            <p>{t('contact.houseCallsLine')}</p>
          </article>
        </div>
      </Section>

      <Section title={t('contact.directionsTitle')}>
        <div className="cta-panel cta-panel--actions-only">
          <div className="button-row">
            <a className="button button--primary" href={practice.bookingUrl} target="_blank" rel="noreferrer">
              {t('cta.bookAppointment')}
            </a>
            <a className="button button--secondary" href={practice.mapUrl} target="_blank" rel="noreferrer">
              {t('cta.openRoute')}
            </a>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
