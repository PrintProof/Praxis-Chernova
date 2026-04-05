export type PracticeFact = {
  label: string;
  value: string;
};

export type OpeningHoursEntry = {
  dayKey: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  value: string;
};

export const bookingUrl = 'https://app.arzt-direkt.de/praxis-chernova/booking';

export const practice = {
  name: 'Praxis Veronika Chernova',
  physicianName: 'Veronika Chernova',
  specialty: 'Ärztin für Innere Medizin',
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
      value: '08:00-13:00'
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
