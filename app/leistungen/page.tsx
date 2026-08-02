import type {Metadata} from 'next';

import {ServicesPage} from '@/components/pages/services-page';
import {buildMetadata} from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  routeKey: 'services',
  title: 'Praxis Veronika Chernova | Leistungen',
  // Bewusst ohne Aufzählung: die Seite selbst nennt nur die eine Aussage
  // (siehe components/pages/services-page.tsx). Eine Beschreibung, die mehr
  // verspricht als die Seite einlöst, ist in der Suche irreführend.
  description:
    'Das gesamte Spektrum der hausärztlichen Leistungen in der Praxis Veronika Chernova in Bielefeld-Brackwede.'
});

export default function Page() {
  return <ServicesPage />;
}
