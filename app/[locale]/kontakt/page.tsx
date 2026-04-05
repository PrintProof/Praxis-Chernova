import type {Metadata} from 'next';

import {ContactPage} from '@/components/pages/contact-page';
import type {Locale} from '@/lib/i18n';
import {getTranslator, isLocale} from '@/lib/i18n';
import {buildMetadata} from '@/lib/seo';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : 'de';
  const t = getTranslator(resolvedLocale);

  return buildMetadata({
    locale: resolvedLocale,
    routeKey: 'contact',
    title: `Praxis Veronika Chernova | ${t('contact.title')}`,
    description: `${t('contact.mainPhoneTitle')}, ${t('contact.prescriptionPhoneTitle')}, ${t('contact.openingHoursSectionTitle')}`
  });
}

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;

  if (!isLocale(locale)) {
    return null;
  }

  return <ContactPage locale={locale} />;
}
