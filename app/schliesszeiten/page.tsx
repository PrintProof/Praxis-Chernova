import type {Metadata} from 'next';

import {ClosuresPage} from '@/components/pages/closures-page';
import {buildMetadata} from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  routeKey: 'closures',
  title: 'Praxis Veronika Chernova | Aktuelles',
  description: 'Urlaubszeiten, Vertretungspraxen und aktuelle Hinweise der Praxis Veronika Chernova.'
});

export default function Page() {
  return <ClosuresPage />;
}
