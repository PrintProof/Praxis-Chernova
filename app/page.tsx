import type {Metadata} from 'next';

import {HomePage} from '@/components/pages/home-page';
import {buildMetadata} from '@/lib/seo';

// Titel und Beschreibung spiegeln die neue Rolle der Startseite: Wegweiser
// (wer, wie erreichbar, wo geht es weiter) statt Datenblatt. Die Sprechzeiten
// stehen bewusst nicht mehr hier, deshalb verweist die Beschreibung auf die
// Kontaktseite. Alle Angaben sind durch content/practice.ts gedeckt.
export const metadata: Metadata = buildMetadata({
  routeKey: 'home',
  title: 'Praxis Veronika Chernova | Hausärztliche Praxis in Bielefeld-Brackwede',
  description:
    'Fachärztin für Innere Medizin und Allgemeinmedizin in Bielefeld-Brackwede. Termine telefonisch; Sprechzeiten, Anfahrt und Kontaktdaten auf der Kontaktseite.'
});

export default function Page() {
  return <HomePage />;
}
