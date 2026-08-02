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
  /**
   * Rezepte und Überweisungen — wortgetreu aus dem Merkblatt der Praxis
   * (Fassung vom 02.08.2026).
   *
   * Zwei Anforderungswege (App und Rezepttelefon), ein Zeitpunkt der
   * Verfügbarkeit und EINE Voraussetzung, die man kennen muss, bevor man ein
   * eRezept anfordert — sonst kann es nicht ausgestellt werden.
   */
  prescriptionNotes: {
    /**
     * `{phone}` ist der Platzhalter für die Rezepttelefonnummer. Sie steht
     * NICHT im Text, sondern wird beim Rendern aus `prescriptionPhoneDisplay`
     * eingesetzt und als `tel:`-Link ausgegeben — so gibt es die Nummer im
     * Repository weiterhin genau einmal.
     */
    orderLine:
      'Rezepte und Überweisungen können bequem über die Arzt-Direkt Praxis-App (für bereits in unserer Praxis bekannte Patientinnen und Patienten) oder über unser Rezepttelefon {phone} angefordert werden.',
    /**
     * Der Gegenpol zum engen Terminfenster (7:30-8:30): das Rezepttelefon
     * nimmt jederzeit entgegen. Deshalb in der Anzeige eigens hervorgehoben.
     */
    phoneAvailability:
      'Unser Rezepttelefon steht Ihnen rund um die Uhr – auch nachts sowie an Wochenenden und Feiertagen – zur Verfügung.',
    processingLine: 'Ihre Anfrage wird am nächsten Arbeitstag bearbeitet.',
    pickupLine:
      'eRezepte sowie angeforderte Überweisungen stehen ab 10:00 Uhr zur Verfügung bzw. können ab diesem Zeitpunkt in der Praxis abgeholt werden.',
    /** Voraussetzung fürs eRezept. Ohne sie läuft die Anforderung ins Leere. */
    cardRequirement:
      'Voraussetzung für die Ausstellung eines eRezepts ist, dass Ihre elektronische Gesundheitskarte im laufenden Quartal bereits in unserer Praxis eingelesen wurde.'
  },

  /**
   * Terminvergabe — wortgetreu aus dem Merkblatt der Praxis
   * ("Terminvereinbarung", Fassung vom 02.08.2026).
   *
   * Kern: Termine gelten für den AKTUELLEN TAG. Es gibt genau zwei Wege der
   * Vereinbarung — online ab 00:00 Uhr und telefonisch zwischen 7:30 und
   * 8:30 Uhr. Die Videosprechstunde ist KEIN dritter Weg, sondern eine
   * Behandlungsform, die über dieselben zwei Wege vereinbart wird.
   *
   * Damit ist die frühere Aussage "Termine und andere Anliegen bitte
   * ausschließlich telefonisch" überholt — sie widersprach ohnehin dem
   * Online-Buchungsbutton und ist deshalb entfallen.
   */
  appointments: {
    /** Online-Buchung: ab wann die Termine des Tages freigeschaltet werden. */
    onlineFrom: '00:00 Uhr',
    onlineLine:
      'Online-Termine für den jeweiligen Behandlungstag werden täglich ab 00:00 Uhr freigeschaltet und können anschließend bequem online gebucht werden.',
    onlineAudience: 'Für bereits in unserer Praxis bekannte Patientinnen und Patienten.',
    /** Telefonische Terminvergabe: das taegliche Zeitfenster. */
    phoneWindow: '7:30 – 8:30 Uhr',
    phoneLine:
      'Alternativ können Termine für den aktuellen Tag telefonisch über unsere Hauptnummer in der Zeit von 7:30 Uhr bis 8:30 Uhr vereinbart werden.',
    /**
     * Videosprechstunde — KEIN dritter Buchungsweg, sondern eine
     * Behandlungsform. Vereinbart wird sie ueber dieselben zwei Wege, deshalb
     * steht sie in der Anzeige unter den beiden Karten und nicht daneben.
     */
    videoLine:
      'Für geeignete Anliegen bieten wir Ihnen auch eine Videosprechstunde an. Sie ermöglicht Ihnen eine ärztliche Beratung bequem von zu Hause oder unterwegs und kann Ihnen in vielen Fällen den Weg in die Praxis ersparen.',
    /**
     * Wer die Praxis-App nicht nutzt, ruft an. Das Kriterium ist ausdruecklich
     * die APP-NUTZUNG, nicht "neu in der Praxis" — die frühere Formulierung
     * "Neue Patientinnen und Patienten melden sich bitte telefonisch" hat die
     * Praxis genau deshalb korrigieren lassen: auch langjaehrige Patientinnen
     * und Patienten ohne App gehoeren telefonisch angemeldet.
     * `{phone}` wird beim Rendern durch die Hauptnummer ersetzt (PhoneSentence).
     */
    appOptOut:
      'Patientinnen und Patienten, die unsere Praxis-App noch nicht nutzen, melden sich bitte telefonisch unter {phone} bei uns.',
    /** Ergaenzt appOptOut dort, wo das Zeitfenster nicht ohnehin sichtbar ist. */
    phoneWindowLine:
      'Die telefonische Terminvereinbarung ist täglich von 7:30 Uhr bis 8:30 Uhr möglich.',
    /** Die verbindliche Regel: keine Behandlung ohne Termin. */
    byAppointmentOnly:
      'Um Wartezeiten zu vermeiden und einen reibungslosen Praxisablauf zu gewährleisten, erfolgt die Behandlung ausschließlich nach vorheriger Terminvereinbarung. Bitte kommen Sie daher nur mit einem vereinbarten Termin in unsere Praxis.'
  },

  /**
   * Hausbesuche werden AUSSCHLIESSLICH telefonisch vereinbart — nicht ueber
   * die App und nicht online. Deshalb steht hier ein eigener Satz statt des
   * allgemeinen `appointments.appOptOut`, der auf die App-Nutzung abstellt.
   * `{phone}` wird beim Rendern durch die Hauptnummer ersetzt (PhoneSentence).
   */
  houseCallsArrangement:
    'Hausbesuche werden ausschließlich telefonisch vereinbart. Bitte rufen Sie uns dafür unter {phone} an.',

  /** Hygienehinweis aus demselben Merkblatt. */
  maskNote:
    'Zum Schutz unserer Patientinnen und Patienten sowie unseres Praxisteams bitten wir Sie, unsere Praxis bei Erkältungssymptomen (z. B. Husten, Schnupfen oder Halsschmerzen) nur mit einer medizinischen Mund-Nasen-Maske zu betreten.',

  /**
   * Hausbesuche — wortgetreu aus dem Merkblatt der Praxis.
   * Nennt jetzt auch die Voraussetzung (starke Mobilitaetseinschraenkung), die
   * in der frueheren Fassung fehlte: dort stand nur die 2-km-Grenze.
   */
  houseCallsNote:
    'Bei stark mobilitätseingeschränkten Patientinnen und Patienten führen wir Hausbesuche in einem Umkreis von 2 km rund um unsere Praxis durch.'
} as const;
