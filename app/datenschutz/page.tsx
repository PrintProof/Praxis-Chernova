import type {Metadata} from 'next';

import {LegalPage} from '@/components/pages/legal-page';
import {buildMetadata} from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  routeKey: 'privacy',
  title: 'Praxis Veronika Chernova | Datenschutz',
  description: 'Datenschutzerklärung der Praxis Veronika Chernova.'
});

export default function Page() {
  return <LegalPage routeKey="privacy" translationPrefix="privacyPage" />;
}
