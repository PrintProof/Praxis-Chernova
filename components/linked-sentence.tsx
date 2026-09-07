import {getTranslator} from '@/lib/i18n';

export type SentenceLink = {
  /** Platzhaltername im Satz — `'phone'` steht fuer `{phone}`. */
  token: string;
  href: string;
  /** Sichtbarer Linktext, z.B. die Rufnummer in ihrer Schreibweise. */
  label: string;
  className?: string;
  /** Externes Ziel: neuer Tab plus Hinweis darauf fuer Screenreader. */
  external?: boolean;
};

type LinkedSentenceProps = {
  /** Satz aus `content/practice.ts` mit Platzhaltern wie `{phone}`. */
  text: string;
  links: SentenceLink[];
  className?: string;
};

/**
 * Ein Satz aus dem Merkblatt der Praxis, in dem einzelne Woerter Links sind —
 * dort, wo das Merkblatt sie nennt.
 *
 * Rufnummer und Linkziel stehen NICHT im Satz, sondern kommen als Props. So
 * existiert jede Rufnummer und jede URL im Repository weiterhin genau einmal
 * (in content/practice.ts) und kann nicht auseinanderlaufen, wenn sich etwas
 * aendert.
 *
 * Fehlt ein Platzhalter im Text, entfaellt einfach der Link — kaputtes Markup
 * gibt es dadurch nie.
 *
 * Hiess bis September 2026 `PhoneSentence` und konnte nur `{phone}`. Die
 * Praxis wollte auf /rezepte zusaetzlich die Praxis-App verlinkt haben, und
 * zwei Sonderfaelle in einer Komponente sind billiger als zwei Komponenten.
 */
export function LinkedSentence({text, links, className}: LinkedSentenceProps) {
  const t = getTranslator();

  if (links.length === 0) {
    return <p className={className}>{text}</p>;
  }

  const byToken = new Map(links.map((link) => [`{${link.token}}`, link]));
  // Die Gruppe im Muster ist wichtig: split() behaelt sie und liefert damit
  // abwechselnd Text und Platzhalter.
  const pattern = new RegExp(`(${links.map((link) => `\\{${link.token}\\}`).join('|')})`, 'g');

  return (
    <p className={className}>
      {text.split(pattern).map((part, index) => {
        const link = byToken.get(part);

        if (!link) {
          return part;
        }

        return (
          <a
            key={index}
            className={link.className}
            href={link.href}
            {...(link.external ? {target: '_blank', rel: 'noreferrer'} : {})}
          >
            {link.label}
            {link.external ? (
              <span className="visually-hidden"> ({t('accessibility.newTabHint')})</span>
            ) : null}
          </a>
        );
      })}
    </p>
  );
}
