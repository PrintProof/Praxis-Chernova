import type {Metadata} from 'next';

import {LegalPage} from '@/components/pages/legal-page';
import {buildMetadata} from '@/lib/seo';

/**
 * Bewusst OHNE `robots: {index: false}`: das Impressum ist eine gesetzliche
 * Pflichtangabe und muss auffindbar bleiben — auch ueber Suchmaschinen.
 * `buildMetadata` setzt selbst keine robots-Direktive, die Seite ist damit
 * indexierbar und steht ueber `app/sitemap.ts` in der Sitemap.
 */
export const metadata: Metadata = buildMetadata({
  routeKey: 'legal',
  title: 'Praxis Veronika Chernova | Impressum',
  description:
    'Anbieterangaben nach § 5 DDG: Praxisinhaberin, Anschrift, Kontaktwege, Berufsbezeichnung sowie zuständige Ärztekammer und Kassenärztliche Vereinigung.'
});

export default function Page() {
  return <LegalPage routeKey="legal" translationPrefix="legalPage" />;
}
