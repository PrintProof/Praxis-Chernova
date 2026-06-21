import type {Metadata} from 'next';

import {ServicesPage} from '@/components/pages/services-page';
import {buildMetadata} from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  routeKey: 'services',
  title: 'Praxis Veronika Chernova | Leistungen',
  description: 'Hausärztlich-internistische Versorgung.'
});

export default function Page() {
  return <ServicesPage />;
}
