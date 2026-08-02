import {readFileSync} from 'node:fs';
import {join} from 'node:path';

export type PracticeFact = {
  label: string;
  value: string;
};

export type OpeningHoursEntry = {
  dayKey: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  value: string;
};

export type SubstitutePractice = {
  name: string;
  street?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  note?: string;
};

export type VacationPeriod = {
  /** Erster Tag der Schließung im Format YYYY-MM-DD (inklusive). */
  start: string;
  /** Letzter Tag der Schließung im Format YYYY-MM-DD (inklusive). */
  end: string;
  /** Optionale Vertretungspraxen für diesen Zeitraum (eine oder mehrere). */
  substitutes?: SubstitutePractice[];
  /** Optionaler Zusatzhinweis (z.B. Notdienst, Erreichbarkeit). */
  note?: string;
};

/**
 * Urlaubs- und Schließungszeiten der Praxis.
 *
 * Die Daten werden vom Praxisteam über Pages CMS in `content/vacation.json`
 * gepflegt (das Bearbeitungsformular ist in `.pages.yml` definiert).
 * Abgelaufene Einträge werden automatisch ausgeblendet (siehe `lib/vacations.ts`).
 * Solange die Liste leer ist, wird KEIN Hinweis angezeigt.
 */
function normalizePeriod(period: VacationPeriod): VacationPeriod {
  // Abwärtskompatibel: ein altes einzelnes `substitute` wird zu `substitutes: [...]`.
  const legacy = (period as {substitute?: SubstitutePractice}).substitute;
  const substitutes = period.substitutes ?? (legacy ? [legacy] : undefined);
  return {...period, substitutes};
}

function loadVacationPeriods(): VacationPeriod[] {
  try {
    const raw = readFileSync(join(process.cwd(), 'content/vacation.json'), 'utf8').trim();
    if (!raw) {
      return [];
    }

    const data: unknown = JSON.parse(raw);
    const periods = Array.isArray(data) ? data : (data as {periods?: unknown} | null)?.periods;

    return Array.isArray(periods) ? (periods as VacationPeriod[]).map(normalizePeriod) : [];
  } catch {
    // Pages CMS schreibt beim Löschen des letzten Eintrags eine leere Datei.
    // Leere/ungültige Inhalte ergeben eine leere Liste, damit der Build nie bricht.
    return [];
  }
}

let cachedPeriods: VacationPeriod[] | null = null;

/**
 * Die gepflegten Urlaubszeiträume.
 *
 * In der ENTWICKLUNG wird die Datei bei jedem Aufruf neu gelesen. Sonst hält
 * der laufende Dev-Server den Stand vom Serverstart fest: `vacation.json` wird
 * per `readFileSync` gelesen und ist damit kein Modul, das Turbopack beim
 * Speichern neu auswerten würde. Das Praxisteam pflegt die Datei über Pages
 * CMS — ohne das hier zeigt `npm run dev` nach einer CMS-Änderung weiterhin
 * die alten Daten, was aussieht, als fehlten Urlaube oder Vertretungen.
 *
 * Im PRODUKTIONSBUILD wird einmal gelesen und gecacht: dort ändert sich die
 * Datei während des Builds nicht, und alle Seiten sollen denselben Stand sehen.
 */
export function getVacationPeriods(): VacationPeriod[] {
  if (process.env.NODE_ENV === 'development') {
    return loadVacationPeriods();
  }

  cachedPeriods ??= loadVacationPeriods();

  return cachedPeriods;
}

export const bookingUrl = 'https://app.arzt-direkt.de/praxis-chernova/booking';

export const practice = {
  name: 'Praxis Veronika Chernova',
  physicianName: 'Veronika Chernova',
  specialty: 'Fachärztin für Innere Medizin und Allgemeinmedizin',
  focus: 'Hausärztlich-internistische Versorgung',
  address: {
    street: 'Treppenstraße 15',
    postalCode: '33647',
    city: 'Bielefeld',
    district: 'Brackwede'
  },
  phone: '0521 444077',
  phoneHref: 'tel:+49521444077',
  fax: '0521 412705',
  prescriptionPhone: '0521 4174473',
  prescriptionPhoneDisplay: '0521 417 44 73',
  prescriptionPhoneHref: 'tel:+495214174473',
  bookingUrl,
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=Treppenstra%C3%9Fe+15%2C+33647+Bielefeld',
  verifiedFacts: [
    {
      label: 'Adresse',
      value: 'Treppenstraße 15, 33647 Bielefeld'
    },
    {
      label: 'Telefon',
      value: '0521 444077'
    },
    {
      label: 'Fax',
      value: '0521 412705'
    },
    {
      label: 'Rezepttelefon',
      value: '0521 417 44 73'
    }
  ] as PracticeFact[],
  openingHours: [
    {
      dayKey: 'monday',
      value: '08:00-13:00, 16:00-18:00'
    },
    {
      dayKey: 'tuesday',
      value: '08:00-14:00'
    },
    {
      dayKey: 'wednesday',
      value: '08:00-13:00'
    },
    {
      dayKey: 'thursday',
      value: '08:00-13:00, 16:00-19:00'
    },
    {
      dayKey: 'friday',
      value: '08:00-13:00'
    }
  ] as OpeningHoursEntry[],
  services: [
    'Hausärztlich-internistische Betreuung',
    'Innere Medizin',
    'DMP Asthma',
    'DMP COPD',
    'DMP Diabetes mellitus Typ 2',
    'DMP KHK'
  ],
  prescriptionNotes: {
    orderLine: 'Rezepte und Überweisungen können über das Rezepttelefon oder die Arzt-Direkt Praxis App angefordert werden.',
    pickupLine: 'Abholung bzw. eRezept ab dem nächsten Arbeitstag ab 10:00 Uhr.',
    appointmentsLine: 'Termine und andere Anliegen bitte ausschließlich telefonisch über die Hauptnummer.'
  },
  houseCallsNote: 'Hausbesuche werden nur in einem Umkreis von 2 km um die Praxis durchgeführt.'
} as const;
