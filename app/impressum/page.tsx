import type {Metadata} from 'next';

import {LegalPage} from '@/components/pages/legal-page';
import {buildMetadata} from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  locale: 'de',
  routeKey: 'legal',
  title: 'Praxis Veronika Chernova | Impressum',
  description: 'Impressum der Praxis Veronika Chernova.'
});

export default function Page() {
  return <LegalPage locale="de" routeKey="legal" translationPrefix="legalPage" />;
}
