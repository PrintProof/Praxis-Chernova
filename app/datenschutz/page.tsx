import type {Metadata} from 'next';

import {LegalPage} from '@/components/pages/legal-page';
import {buildMetadata} from '@/lib/seo';

/**
 * Bewusst OHNE `robots: {index: false}`: die Datenschutzerklaerung ist eine
 * gesetzliche Pflichtangabe und muss auffindbar bleiben — auch ueber
 * Suchmaschinen. `buildMetadata` setzt selbst keine robots-Direktive, die
 * Seite ist damit indexierbar und steht ueber `app/sitemap.ts` in der Sitemap.
 */
export const metadata: Metadata = buildMetadata({
  routeKey: 'privacy',
  title: 'Praxis Veronika Chernova | Datenschutzerklärung',
  description:
    'Wie diese Website mit Daten umgeht: keine Cookies, kein Tracking, keine externen Schriften. Dazu Angaben zu Hosting, Ihren Rechten und der zuständigen Aufsichtsbehörde.'
});

export default function Page() {
  return <LegalPage routeKey="privacy" translationPrefix="privacyPage" />;
}
