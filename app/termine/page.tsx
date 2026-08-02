import type {Metadata} from 'next';

import {AppointmentsPage} from '@/components/pages/appointments-page';
import {buildMetadata} from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  routeKey: 'appointments',
  title: 'Praxis Veronika Chernova | Termine',
  description:
    'Termine für den aktuellen Tag: online ab 00:00 Uhr oder telefonisch von 7:30 bis 8:30 Uhr. Videosprechstunde und Hausbesuche.'
});

export default function Page() {
  return <AppointmentsPage />;
}
