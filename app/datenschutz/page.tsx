import type {Metadata} from 'next';

import {LegalPage} from '@/components/pages/legal-page';
import {buildMetadata} from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  locale: 'de',
  routeKey: 'privacy',
  title: 'Praxis Veronika Chernova | Datenschutz',
  description: 'Datenschutzhinweise der Praxis Veronika Chernova.'
});

export default function Page() {
  return <LegalPage locale="de" routeKey="privacy" translationPrefix="privacyPage" />;
}
