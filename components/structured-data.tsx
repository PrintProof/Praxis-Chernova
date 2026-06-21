import {practice} from '@/content/practice';
import {getSiteUrl} from '@/lib/seo';

export function StructuredData({pathname}: {pathname: string}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: practice.name,
    url: getSiteUrl(pathname),
    telephone: practice.phone,
    faxNumber: practice.fax,
    medicalSpecialty: ['InternalMedicine', 'PrimaryCare'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: practice.address.street,
      postalCode: practice.address.postalCode,
      addressLocality: practice.address.city,
      addressCountry: 'DE'
    },
    areaServed: practice.address.city,
    availableLanguage: 'de',
    openingHoursSpecification: practice.openingHours.flatMap((entry) =>
      entry.value.split(', ').map((block) => {
        const [opens, closes] = block.split('-');
        return {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: `https://schema.org/${capitalize(entry.dayKey)}`,
          opens: opens ?? '08:00',
          closes: closes ?? '13:00'
        };
      })
    )
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
