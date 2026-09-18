import {Download} from '@/components/illustrations';
import {getTranslator} from '@/lib/i18n';
import {assetPath} from '@/lib/base-path';

/**
 * Link auf ein Merkblatt der Praxis (PDF) — die Aushaenge, die auch in der
 * Praxis haengen.
 *
 * Steht auf /extra-leistungen (Vitamin-Kur) und auf /termine (offene
 * Videosprechstunde), deshalb eine geteilte Komponente statt zweimal
 * derselben Kartenaufbau.
 *
 * Bewusst KEIN `<Link>`: das Ziel ist eine Datei aus `public/`, keine Route.
 * Next wuerde versuchen, sie als Seite vorzuladen. Den Basispfad fuer GitHub
 * Pages setzt deshalb `assetPath()` (lib/base-path.ts).
 *
 * Neuer Tab, weil der Browser das PDF an Ort und Stelle oeffnet: sonst waere
 * die Website weg und nur mit "Zurueck" wiederzubekommen. Der Hinweis darauf
 * steht sichtbar in der Zusatzzeile UND — mitsamt Dateiformat — im
 * zugaenglichen Namen, damit niemand ueberrascht wird.
 */
type HandoutLinkProps = {
  /** Dateiname in `public/downloads/`, z.B. "vitamin-kur.pdf". */
  file: string;
  /** Sichtbare Beschriftung, z.B. "Vitamin-Kur". */
  label: string;
};

export function HandoutLink({file, label}: HandoutLinkProps) {
  const t = getTranslator();

  return (
    <a
      className="handout"
      href={assetPath(`/downloads/${file}`)}
      target="_blank"
      rel="noreferrer"
    >
      <Download className="icon icon--lg handout__icon" />
      <span className="handout__text">
        <span className="handout__label">{label}</span>
        <span className="handout__meta">{t('handout.meta')}</span>
      </span>
      <span className="visually-hidden"> ({t('accessibility.newTabHint')})</span>
    </a>
  );
}
