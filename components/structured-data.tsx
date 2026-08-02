import {practice} from '@/content/practice';
import {getSiteUrl} from '@/lib/seo';

const CLINIC_ID = `${getSiteUrl('/')}#praxis`;

/**
 * JSON-LD der Praxis.
 *
 * Alle Werte stammen ausschliesslich aus `content/practice.ts` (verifizierte
 * Fakten). Es wird nichts ergaenzt, was dort nicht belegt ist — insbesondere
 * keine Geokoordinaten, keine Bewertungen, keine Leistungsversprechen.
 *
 * Die Praxis ist auf jeder Seite dieselbe Entitaet: `@id` und `url` zeigen
 * deshalb konstant auf die Startseite, waehrend `mainEntityOfPage` die
 * jeweils aufgerufene Seite benennt (auch die Route `news` / /schliesszeiten).
 */
export function StructuredData({pathname}: {pathname: string}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': CLINIC_ID,
    name: practice.name,
    url: getSiteUrl('/'),
    mainEntityOfPage: getSiteUrl(pathname),
    telephone: practice.phone,
    faxNumber: practice.fax,
    hasMap: practice.mapUrl,
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
    employee: {
      '@type': 'Physician',
      name: practice.physicianName,
      jobTitle: practice.specialty,
      medicalSpecialty: ['InternalMedicine', 'PrimaryCare']
    },
    openingHoursSpecification: practice.openingHours.flatMap((entry) =>
      entry.value
        .split(',')
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block) => {
          const [opens, closes] = block.split('-').map((part) => part.trim());
          return {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: `https://schema.org/${capitalize(entry.dayKey)}`,
            opens,
            closes
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
