import type {Metadata} from 'next';

import {HouseCallsPage} from '@/components/pages/housecalls-page';
import {buildMetadata} from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  routeKey: 'housecalls',
  title: 'Praxis Veronika Chernova | Hausbesuche',
  description:
    'Hausbesuche für stark mobilitätseingeschränkte Patientinnen und Patienten in einem Umkreis von 2 km um die Praxis.'
});

export default function Page() {
  return <HouseCallsPage />;
}
