type PhoneSentenceProps = {
  /** Satz mit dem Platzhalter `{phone}` an der Stelle der Rufnummer. */
  text: string;
  /** Ziel des `tel:`-Links, z.B. `practice.phoneHref`. */
  href: string;
  /** Sichtbare Schreibweise der Nummer, z.B. `practice.phone`. */
  display: string;
  className?: string;
  linkClassName?: string;
};

/**
 * Ein Satz aus `content/practice.ts`, in dem die Rufnummer als `tel:`-Link
 * steht — dort, wo das Merkblatt der Praxis sie nennt.
 *
 * Die Nummer selbst steht NICHT im Text, sondern kommt als Prop. So existiert
 * jede Rufnummer im Repository weiterhin genau einmal (in practice.ts) und
 * kann nicht auseinanderlaufen, wenn sich eine ändert.
 *
 * Fehlt der Platzhalter, wird der Satz unverändert ausgegeben und der Link
 * entfällt — kaputtes Markup gibt es dadurch nie.
 */
export function PhoneSentence({
  text,
  href,
  display,
  className,
  linkClassName
}: PhoneSentenceProps) {
  const [before, after] = text.split('{phone}');

  if (after === undefined) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p className={className}>
      {before}
      <a className={linkClassName} href={href}>
        {display}
      </a>
      {after}
    </p>
  );
}
