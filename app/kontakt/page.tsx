import type {Metadata} from 'next';

import {ContactPage} from '@/components/pages/contact-page';
import {buildMetadata} from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  routeKey: 'contact',
  title: 'Praxis Veronika Chernova | Kontakt & Anfahrt',
  description:
    'Telefon, Rezepttelefon, Fax, Sprechzeiten, Anfahrt nach Bielefeld-Brackwede und die wichtigsten Abläufe der Praxis Veronika Chernova.'
});

export default function Page() {
  return <ContactPage />;
}
