import type {Metadata} from 'next';

import {ExtrasPage} from '@/components/pages/extras-page';
import {buildMetadata} from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  routeKey: 'extras',
  title: 'Praxis Veronika Chernova | Extra-Leistungen',
  description:
    'Angebote unserer Praxis über die Regelversorgung hinaus: die Vitamin-Kur als Kurzinfusion. Das Merkblatt der Praxis steht als PDF bereit.'
});

export default function Page() {
  return <ExtrasPage />;
}
