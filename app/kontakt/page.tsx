import type {Metadata} from 'next';

import {ContactPage} from '@/components/pages/contact-page';
import {buildMetadata} from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  locale: 'de',
  routeKey: 'contact',
  title: 'Praxis Veronika Chernova | Kontakt & Anfahrt',
  description: 'Telefon, Rezepttelefon, Adresse und Sprechzeiten.'
});

export default function Page() {
  return <ContactPage locale="de" />;
}
