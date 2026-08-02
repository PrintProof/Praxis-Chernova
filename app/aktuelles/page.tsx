import type {Metadata} from 'next';

import {NewsPage} from '@/components/pages/news-page';
import {buildMetadata} from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  routeKey: 'news',
  title: 'Praxis Veronika Chernova | Aktuelles',
  description: 'Urlaubszeiten, Vertretungspraxen und aktuelle Hinweise der Praxis Veronika Chernova.'
});

export default function Page() {
  return <NewsPage />;
}
