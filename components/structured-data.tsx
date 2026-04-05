import {practice} from '@/content/practice';
import type {Locale} from '@/lib/i18n';
import {getSiteUrl} from '@/lib/seo';

export function StructuredData({locale, pathname}: {locale: Locale; pathname: string}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: practice.name,
    url: getSiteUrl(pathname),
    telephone: practice.phone,
    faxNumber: practice.fax,
    medicalSpecialty: 'InternalMedicine',
    address: {
      '@type': 'PostalAddress',
      streetAddress: practice.address.street,
      postalCode: practice.address.postalCode,
      addressLocality: practice.address.city,
      addressCountry: 'DE'
    },
    areaServed: practice.address.city,
    availableLanguage: locale,
    openingHoursSpecification: practice.openingHours.map((entry) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${capitalize(entry.dayKey)}`,
      opens: entry.value.split(', ')[0]?.split('-')[0] ?? '08:00',
      closes: entry.value.split(', ')[0]?.split('-')[1] ?? '13:00'
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
    />
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
