import type {Metadata} from 'next';

import {PrescriptionsPage} from '@/components/pages/prescriptions-page';
import {buildMetadata} from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  routeKey: 'prescriptions',
  title: 'Praxis Veronika Chernova | Rezepte und Überweisungen',
  description:
    'Rezepte und Überweisungen über die Praxis-App oder das Rezepttelefon anfordern — rund um die Uhr erreichbar.'
});

export default function Page() {
  return <PrescriptionsPage />;
}
