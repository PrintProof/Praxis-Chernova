/**
 * illustrations.tsx — handgezeichnete Linien-Grafiken der Praxis-Website.
 *
 * Alles ist Inline-SVG: keine externen Bilder, keine Icon-Bibliothek, keine
 * Netzwerk-Requests (DSGVO). Alle Komponenten sind reine Server-Komponenten
 * ohne State und ohne Pflicht-Props.
 *
 * ZWEI FAMILIEN
 * -------------
 * 1. Strich-Icons (viewBox 24, `stroke="currentColor"`, stroke-width 1.6)
 *    Sie erben die Textfarbe und sind standardmaessig 1em gross, stehen also
 *    ohne Zutun korrekt neben Text. Groesse/Farbe per CSS steuerbar
 *    (`width: var(--icon)`, `color: var(--accent-strong)`) — CSS gewinnt gegen
 *    Praesentationsattribute.
 *
 * 2. Szenen-Illustrationen (viewBox 320x240)
 *    Aufbau in vier Ebenen: organische Flaeche in --brand-soft, Papierfuellungen
 *    in --surface, feine Nebenlinien in --accent-strong, tragende Konturen in
 *    --brand. Die SVG haben bewusst keine width/height — sie fuellen ihren
 *    Container und behalten ihr Seitenverhaeltnis. Im CSS begrenzen:
 *    `.illustration { width: 100%; max-width: var(--illustration-max); }`
 *
 * BARRIEREFREIHEIT
 * ----------------
 * Ohne `title` sind alle Grafiken rein dekorativ: `aria-hidden="true"` und
 * `focusable="false"` (letzteres wegen aelterer Edge/IE-Engines, die SVG sonst
 * in die Tab-Reihenfolge nehmen). Ein Icon ersetzt nie ein Label — Text
 * danebenschreiben. Nur wenn eine Grafik ausnahmsweise allein eine Information
 * traegt, `title` setzen; dann wird sie als `role="img"` mit Namen ausgezeichnet.
 *
 * FARBREGEL
 * ---------
 * --accent-strong erfuellt 3:1 auf allen hellen Flaechen und traegt daher die
 * bedeutungsvollen Konturen; --accent ist rein dekorativ und wird hier bewusst
 * nicht fuer Linien verwendet, die allein eine Information transportieren.
 */
import type {ReactNode} from 'react';

export type IconProps = {
  className?: string;
  /**
   * Nur setzen, wenn das Icon ausnahmsweise ohne begleitenden Text steht und
   * selbst die Information traegt. Sonst weglassen: dann ist es dekorativ.
   */
  title?: string;
};

/* =============================================================================
   Strich-Icons — viewBox 24, 1.6 Strichstaerke, runde Enden
   ========================================================================== */

function Icon({className, title, children}: IconProps & {children: ReactNode}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      focusable="false"
      {...(title ? {role: 'img'} : {'aria-hidden': true})}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

/** Telefonhoerer — Rufnummern, Anrufe. */
export function Phone(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5.3 3.6 L7.5 3.6 A1.7 1.7 0 0 1 9.2 5.3 L9.2 7.5 C9.2 11.9 12.1 14.8 16.5 14.8 L18.7 14.8 A1.7 1.7 0 0 1 20.4 16.5 L20.4 18.7 A1.7 1.7 0 0 1 18.7 20.4 L16.5 20.4 C12 20.4 3.6 12 3.6 7.5 L3.6 5.3 A1.7 1.7 0 0 1 5.3 3.6 Z" />
    </Icon>
  );
}

/** Formular mit Eselsohr — Rezept, Ueberweisung, Bescheinigung. */
export function Prescription(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14.4 3.2 L7 3.2 A1.8 1.8 0 0 0 5.2 5 L5.2 19 A1.8 1.8 0 0 0 7 20.8 L17 20.8 A1.8 1.8 0 0 0 18.8 19 L18.8 7.6 Z" />
      <path d="M14.4 3.4 L14.4 6.2 A1.4 1.4 0 0 0 15.8 7.6 L18.6 7.6" />
      <path d="M8.4 11.6 L15.6 11.6" />
      <path d="M8.4 14.6 L15.6 14.6" />
      <path d="M8.4 17.6 L12.8 17.6" />
    </Icon>
  );
}

/** Kalenderblatt — Termine, Urlaubszeitraum. */
export function Calendar(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5.6 5.6 L18.4 5.6 A2 2 0 0 1 20.4 7.6 L20.4 18.4 A2 2 0 0 1 18.4 20.4 L5.6 20.4 A2 2 0 0 1 3.6 18.4 L3.6 7.6 A2 2 0 0 1 5.6 5.6 Z" />
      <path d="M8.4 3.2 L8.4 7.6" />
      <path d="M15.6 3.2 L15.6 7.6" />
      <path d="M3.6 10.2 L20.4 10.2" />
      <rect x="10.3" y="13.6" width="3.4" height="3.4" rx="0.9" />
    </Icon>
  );
}

/** Uhr — Sprechzeiten, Telefonzeiten. */
export function Clock(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.4 L12 12 L15.3 14.1" />
    </Icon>
  );
}

/** Kartennadel — Anfahrt, Adresse. */
export function MapPin(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 20.9 C10.4 18.4 7.9 15.2 6.8 13.5 A6.4 6.4 0 1 1 17.2 13.5 C16.1 15.2 13.6 18.4 12 20.9 Z" />
      <circle cx="12" cy="9.8" r="2.5" />
    </Icon>
  );
}

/** Info-Kreis — neutraler Hinweis. */
export function Info(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 11.2 L12 16.6" />
      <path d="M12 7.9 L12 8" />
    </Icon>
  );
}

/** Ausrufezeichen im Kreis — wichtiger Hinweis (116 117, Vertretung). */
export function AlertCircle(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.4 L12 13.2" />
      <path d="M12 16.3 L12 16.4" />
    </Icon>
  );
}

/** Pfeil nach rechts — Weiterfuehrende Links. */
export function ArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.8 12 L18.8 12" />
      <path d="M13.6 6.8 L18.8 12 L13.6 17.2" />
    </Icon>
  );
}

/** Briefumschlag — E-Mail. */
export function Mail(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5.4 5.2 L18.6 5.2 A2.2 2.2 0 0 1 20.8 7.4 L20.8 16.6 A2.2 2.2 0 0 1 18.6 18.8 L5.4 18.8 A2.2 2.2 0 0 1 3.2 16.6 L3.2 7.4 A2.2 2.2 0 0 1 5.4 5.2 Z" />
      <path d="M4.2 7.6 L11.2 12.7 Q12 13.3 12.8 12.7 L19.8 7.6" />
    </Icon>
  );
}

/** Faxgeraet — Faxnummer. */
export function Fax(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 8.6 L7 4.6 A1.2 1.2 0 0 1 8.2 3.4 L15.8 3.4 A1.2 1.2 0 0 1 17 4.6 L17 8.6" />
      <path d="M7 17.6 L5.2 17.6 A1.8 1.8 0 0 1 3.4 15.8 L3.4 10.4 A1.8 1.8 0 0 1 5.2 8.6 L18.8 8.6 A1.8 1.8 0 0 1 20.6 10.4 L20.6 15.8 A1.8 1.8 0 0 1 18.8 17.6 L17 17.6" />
      <path d="M7 14.4 L17 14.4 L17 19.4 A1.2 1.2 0 0 1 15.8 20.6 L8.2 20.6 A1.2 1.2 0 0 1 7 19.4 Z" />
      <path d="M5.6 11.4 L5.6 11.5" />
    </Icon>
  );
}

/** Haus — Hausbesuch. */
export function HouseCall(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.4 10.6 L12 3.6 L20.6 10.6" />
      <path d="M5.8 8.6 L5.8 19 A1.8 1.8 0 0 0 7.6 20.8 L16.4 20.8 A1.8 1.8 0 0 0 18.2 19 L18.2 8.6" />
      <path d="M10.2 20.8 L10.2 15.4 A1.8 1.8 0 0 1 13.8 15.4 L13.8 20.8" />
    </Icon>
  );
}

/** Stethoskop — aerztliche Leistung. */
export function Stethoscope(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.4 3.8 L6.4 8.6 A3.8 3.8 0 0 0 14 8.6 L14 3.8" />
      <path d="M5.4 3.8 L7.4 3.8" />
      <path d="M13 3.8 L15 3.8" />
      <path d="M10.2 12.4 C10.2 16 11.8 17.6 14.5 17.6" />
      <circle cx="17.4" cy="17.6" r="2.9" />
      <circle cx="17.4" cy="17.6" r="0.9" />
    </Icon>
  );
}

/** Kasten mit Pfeil — externer Link (z. B. Online-Terminbuchung). */
export function ExternalLink(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M17 13.6 L17 18.6 A2 2 0 0 1 15 20.6 L5.4 20.6 A2 2 0 0 1 3.4 18.6 L3.4 9 A2 2 0 0 1 5.4 7 L10.4 7" />
      <path d="M13.4 4.4 L19.6 4.4 L19.6 10.6" />
      <path d="M11.4 12.6 L19.6 4.4" />
    </Icon>
  );
}

/** Haken — erfuellt, enthalten. */
export function Check(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.8 12.4 L9.8 17.4 L19.2 6.8" />
    </Icon>
  );
}

/** Schild mit Haken — Vorsorge, Schutzimpfung. */
export function Shield(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3.4 L19.6 6.3 L19.6 11.8 C19.6 16.5 16.4 19.8 12 20.9 C7.6 19.8 4.4 16.5 4.4 11.8 L4.4 6.3 Z" />
      <path d="M9.2 12 L11.3 14.1 L15 10" />
    </Icon>
  );
}

/**
 * Bildschirm mit Kamerablase — die Videosprechstunde.
 *
 * Aufbau: ein liegendes Rechteck als Bildschirm mit gerundeten Ecken, darunter
 * Standfuss und Sockel, und IM Bildschirm eine angedeutete Person (Kopfkreis
 * plus Schulterbogen).
 *
 * Erster Entwurf hatte statt der Person eine Linse rechts oben und einen Bogen
 * unten links — das las sich als Foto-Symbol (Berg mit Sonne). Die Person im
 * Bildschirm macht die Bedeutung eindeutig: ein Gespraech, keine Aufnahme.
 */
export function Video(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.6 6.6 C3.6 5.7 4.3 5 5.2 5 L18.8 5 C19.7 5 20.4 5.7 20.4 6.6 L20.4 15.1 C20.4 16 19.7 16.7 18.8 16.7 L5.2 16.7 C4.3 16.7 3.6 16 3.6 15.1 Z" />
      <path d="M9 19.6 L15 19.6" />
      <path d="M12 16.7 L12 19.6" />
      <circle cx="12" cy="9.3" r="1.9" />
      <path d="M8.9 14.4 C9.3 12.5 10.5 11.7 12 11.7 C13.5 11.7 14.7 12.5 15.1 14.4" />
    </Icon>
  );
}

/**
 * Medizinische Mund-Nasen-Maske — der Hygienehinweis bei Erkaeltungssymptomen.
 *
 * Aufbau: der Maskenkoerper als leicht nach unten gewoelbtes Viereck mit
 * gerundeten Ecken, zwei Faltenlinien in der Mitte, links und rechts je ein
 * Ohrband als flacher Bogen. Bewusst kein Gesicht — das Symbol soll sachlich
 * bleiben und in derselben Strichstaerke wie die uebrigen Icons lesen.
 */
export function Mask(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.2 8.1 C9.9 6.9 14.1 6.9 17.8 8.1 L17.8 13.4 C17.8 15.9 15.2 17.9 12 17.9 C8.8 17.9 6.2 15.9 6.2 13.4 Z" />
      <path d="M6.4 11 L17.6 11" />
      <path d="M6.7 13.6 L17.3 13.6" />
      <path d="M6.2 8.8 L3.6 10.2 C2.8 10.6 2.7 11.6 3.4 12.2 L5.2 13.7" />
      <path d="M17.8 8.8 L20.4 10.2 C21.2 10.6 21.3 11.6 20.6 12.2 L18.8 13.7" />
    </Icon>
  );
}

/** Drei Linien — Menue oeffnen (mobil). */
export function Menu(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.2 7.4 L19.8 7.4" />
      <path d="M4.2 12 L19.8 12" />
      <path d="M4.2 16.6 L19.8 16.6" />
    </Icon>
  );
}

/** Kreuz — Menue schliessen. */
export function Close(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.2 6.2 L17.8 17.8" />
      <path d="M17.8 6.2 L6.2 17.8" />
    </Icon>
  );
}

/** Winkel nach unten — auf-/zuklappbarer Bereich. */
export function ChevronDown(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.4 9.6 L12 15.2 L17.6 9.6" />
    </Icon>
  );
}

/* =============================================================================
   Szenen-Illustrationen — viewBox 320x240

   Ebenen (in Zeichenreihenfolge):
     1. <Blob>   organische Grundflaeche, --brand-soft, ohne Kontur
     2. <Paper>  Papierfuellungen der Objekte, --surface, ohne Kontur
     3. <Detail> feine Nebenlinien, --accent-strong, Strichstaerke 1.4
     4. <Main>   tragende Konturen, --brand, 1.75 (= --illustration-stroke)

   Geschlossene Objekte stehen absichtlich zweimal in der Liste: einmal als
   Papierfuellung, einmal als Kontur. So liegt die Flaeche unter allen Linien.
   ========================================================================== */

type IllustrationProps = IconProps;

function Illustration({className, title, children}: IllustrationProps & {children: ReactNode}) {
  return (
    <svg
      viewBox="0 0 320 240"
      className={className}
      focusable="false"
      {...(title ? {role: 'img'} : {'aria-hidden': true})}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

function Blob({d}: {d: string}) {
  return <path d={d} fill="var(--brand-soft)" />;
}

function Paper({paths}: {paths: readonly string[]}) {
  return (
    <g fill="var(--surface)" stroke="none">
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
}

function Detail({paths}: {paths: readonly string[]}) {
  return (
    <g
      fill="none"
      stroke="var(--accent-strong)"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
}

function Main({paths}: {paths: readonly string[]}) {
  return (
    <g
      fill="none"
      stroke="var(--brand)"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
}

/* --- Urlaub: Sonnenschirm, Liege, Sonne --- */

const VACATION_BLOB =
  'M302 112 C305 141.67 280.67 186.33 252 206 C223.33 225.67 166.33 234.67 130 230 C93.67 225.33 52.67 204 34 178 C15.33 152 5 101 18 74 C31 47 76 23.67 112 16 C148 8.33 202.33 12 234 28 C265.67 44 299 82.33 302 112 Z';

const VACATION_PAPER = [
  'M46 96 C48 70 76 52 110 52 C144 52 172 70 174 96 Q158 112 142 96 Q126 112 110 96 Q94 112 78 96 Q62 112 46 96 Z',
  'M167 164.5 L231.7 164.5 L259.4 127.3 A4.5 4.5 0 0 1 266.6 132.7 L236.3 173.5 L167 173.5 A4.5 4.5 0 0 1 167 164.5 Z',
] as const;

const VACATION_DETAIL = [
  'M250 66 m-24 0 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0',
  'M244.4 97.5 L242.4 109.3',
  'M225.5 86.6 L216.3 94.3',
  'M218 66 L206 66',
  'M225.5 45.4 L216.3 37.7',
  'M244.4 34.5 L242.4 22.7',
  'M26 194 C86 186 146 200 206 192 C246 187 274 190 296 188',
  'M56 193 C55 186 54 181 52 174',
  'M60 193 C60 186 61 181 62 173',
  'M64 193 C66 187 69 183 73 178',
  'M136 192 C135 187 134 184 133 179',
  'M140 192 C140 187 141 183 142 178',
  'M144 192 C146 188 148 185 151 181',
] as const;

const VACATION_MAIN = [
  'M46 96 C48 70 76 52 110 52 C144 52 172 70 174 96',
  'M46 96 Q62 112 78 96 Q94 112 110 96 Q126 112 142 96 Q158 112 174 96',
  'M78 96 C82 78 94 62 110 52',
  'M142 96 C138 78 126 62 110 52',
  'M110 52 L110 196',
  'M167 164.5 L231.7 164.5 L259.4 127.3 A4.5 4.5 0 0 1 266.6 132.7 L236.3 173.5 L167 173.5 A4.5 4.5 0 0 1 167 164.5 Z',
  'M178 173.5 L172 196',
  'M226 173.5 L231 196',
  'M250.2 154.7 L256 196',
] as const;

/**
 * Leitmotiv der Seite "Aktuelles": Sonnenschirm, Sonnenliege, Sonne.
 * Begleitet Urlaubs- und Vertretungshinweise.
 */
export function VacationIllustration(props: IllustrationProps) {
  return (
    <Illustration {...props}>
      <Blob d={VACATION_BLOB} />
      <Paper paths={VACATION_PAPER} />
      <Detail paths={VACATION_DETAIL} />
      <Main paths={VACATION_MAIN} />
    </Illustration>
  );
}

/* --- Startseite: Bogenfenster, Pflanze und Tasse auf der Fensterbank --- */

const PRACTICE_BLOB =
  'M298 96 C303.33 122.67 295 164 274 186 C253 208 206.67 223 172 228 C137.33 233 91.33 231 66 216 C40.67 201 24.67 165.67 20 138 C15.33 110.33 17 70.67 38 50 C59 29.33 112 18 146 14 C180 10 216.67 12.33 242 26 C267.33 39.67 292.67 69.33 298 96 Z';

const PRACTICE_PAPER = [
  'M72 176 L72 108 A64 64 0 0 1 200 108 L200 176 Z',
  'M148 148 L152 174 A4.5 4.5 0 0 0 156.5 178 L175.5 178 A4.5 4.5 0 0 0 180 174 L184 148 Z',
  'M78 152 L82 173 A6 6 0 0 0 88 178 L96 178 A6 6 0 0 0 102 173 L106 152 Z',
  'M166 150 Q175 116.8 144 102 Q135 135.2 166 150 Z',
  'M166 150 Q189 115.6 168 80 Q145 114.4 166 150 Z',
  'M166 150 Q196 146.2 196 116 Q166 119.8 166 150 Z',
] as const;

const PRACTICE_DETAIL = [
  'M81 108 L191 108',
  'M96 100 L120 76',
  'M108 104 L132 80',
  'M166 150 Q158.6 124.3 144 102',
  'M166 150 Q170 115 168 80',
  'M166 150 Q184 130 196 116',
  'M77 157 L107 157',
  'M105 157 C114 157 114 168 104 168',
  'M86 145 C90 139 84 133 88 127',
  'M96 145 C100 139 94 133 98 127',
  'M46 208 C94 203 152 212 206 207 C238 204 260 207 278 205',
] as const;

const PRACTICE_MAIN = [
  'M72 176 L72 108 A64 64 0 0 1 200 108 L200 176',
  'M81 176 L81 108 A55 55 0 0 1 191 108 L191 176',
  'M136 176 L136 53',
  'M58 178 L216 178',
  'M64 186 L210 186',
  'M58 178 L64 186',
  'M216 178 L210 186',
  'M148 148 L152 174 A4.5 4.5 0 0 0 156.5 178 L175.5 178 A4.5 4.5 0 0 0 180 174 L184 148 Z',
  'M149 155 L183 155',
  'M166 150 Q175 116.8 144 102 Q135 135.2 166 150 Z',
  'M166 150 Q189 115.6 168 80 Q145 114.4 166 150 Z',
  'M166 150 Q196 146.2 196 116 Q166 119.8 166 150 Z',
  'M78 152 L82 173 A6 6 0 0 0 88 178 L96 178 A6 6 0 0 0 102 173 L106 152 Z',
] as const;

/**
 * Leitmotiv der Startseite: ein Bogenfenster mit Pflanze und Tasse auf der
 * Fensterbank. Bewusst kein Stethoskop, kein Geraet, kein EKG — die Aussage
 * ist Ruhe und Verlaesslichkeit, nicht Medizintechnik.
 */
export function PracticeIllustration(props: IllustrationProps) {
  return (
    <Illustration {...props}>
      <Blob d={PRACTICE_BLOB} />
      <Paper paths={PRACTICE_PAPER} />
      <Detail paths={PRACTICE_DETAIL} />
      <Main paths={PRACTICE_MAIN} />
    </Illustration>
  );
}

/* --- Leistungen: zwei Stuehle, kleiner Tisch, Haengeleuchte --- */

const CARE_BLOB =
  'M300 134 C299.67 163 267.33 198.33 238 214 C208.67 229.67 158 235.67 124 228 C90 220.33 50.67 194.33 34 168 C17.33 141.67 8 95.67 24 70 C40 44.33 94 19 130 14 C166 9 211.67 20 240 40 C268.33 60 300.33 105 300 134 Z';

const CARE_PAPER = [
  'M74 124 L106 124 A5 5 0 0 1 111 129 L111 132.5 L69 132.5 L69 129 A5 5 0 0 1 74 124 Z',
  'M246 124 L214 124 A5 5 0 0 0 209 129 L209 132.5 L251 132.5 L251 129 A5 5 0 0 0 246 124 Z',
  'M64 132.5 L113 132.5 A3.5 3.5 0 0 1 113 139.5 L64 139.5 A3.5 3.5 0 0 1 64 132.5 Z',
  'M207 132.5 L256 132.5 A3.5 3.5 0 0 1 256 139.5 L207 139.5 A3.5 3.5 0 0 1 207 132.5 Z',
  'M63 136 C59 116 55 96 52 76 A3.5 3.5 0 0 1 59 76 C62 96 66 116 70 136 Z',
  'M257 136 C261 116 265 96 268 76 A3.5 3.5 0 0 0 261 76 C258 96 254 116 250 136 Z',
  'M130 140 A30 7.5 0 0 1 190 140 A30 7.5 0 0 1 130 140 Z',
  'M144 188 A16 4.5 0 0 1 176 188 A16 4.5 0 0 1 144 188 Z',
  'M136 84 C136 68 146 56 160 56 C174 56 184 68 184 84 Z',
] as const;

const CARE_DETAIL = [
  'M71 168 L109 168',
  'M211 168 L249 168',
  'M160 8 L160 56',
  'M147 92 L143 101',
  'M160 93 L160 103',
  'M173 92 L177 101',
  'M30 192 C92 187 152 196 212 190 C252 186 276 189 294 188',
] as const;

const CARE_MAIN = [
  'M63 136 C59 116 55 96 52 76 A3.5 3.5 0 0 1 59 76 C62 96 66 116 70 136 Z',
  'M74 124 L106 124 A5 5 0 0 1 111 129 L111 132.5 L69 132.5 L69 129 A5 5 0 0 1 74 124 Z',
  'M64 132.5 L113 132.5 A3.5 3.5 0 0 1 113 139.5 L64 139.5 A3.5 3.5 0 0 1 64 132.5 Z',
  'M108 139.5 L113 194',
  'M72 139.5 L67 194',
  'M257 136 C261 116 265 96 268 76 A3.5 3.5 0 0 0 261 76 C258 96 254 116 250 136 Z',
  'M246 124 L214 124 A5 5 0 0 0 209 129 L209 132.5 L251 132.5 L251 129 A5 5 0 0 0 246 124 Z',
  'M207 132.5 L256 132.5 A3.5 3.5 0 0 1 256 139.5 L207 139.5 A3.5 3.5 0 0 1 207 132.5 Z',
  'M212 139.5 L207 194',
  'M248 139.5 L253 194',
  'M130 140 A30 7.5 0 0 1 190 140 A30 7.5 0 0 1 130 140 Z',
  'M154 146 C152 160 152 176 154 185',
  'M166 146 C168 160 168 176 166 185',
  'M144 188 A16 4.5 0 0 1 176 188 A16 4.5 0 0 1 144 188 Z',
  'M136 84 C136 68 146 56 160 56 C174 56 184 68 184 84 Z',
] as const;
