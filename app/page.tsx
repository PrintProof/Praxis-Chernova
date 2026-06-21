import type {Metadata} from 'next';

import {HomePage} from '@/components/pages/home-page';
import {buildMetadata} from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  routeKey: 'home',
  title: 'Praxis Veronika Chernova | Start',
  description: 'Kontakt, Sprechzeiten und Terminbuchung auf einen Blick.'
});

export default function Page() {
  return <HomePage />;
}
