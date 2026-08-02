import {Section} from '@/components/section';
import {getTranslator} from '@/lib/i18n';

/**
 * Ärztlicher Bereitschaftsdienst (116 117) und Rettungsdienst (112).
 *
 * Diese eine Komponente wird auf /schliesszeiten UND /kontakt eingebunden — die
 * einzige bewusst in Kauf genommene Wiederholung, weil sie sicherheitsrelevant
 * ist. Weil es genau EINE Komponente mit genau EINEM Satz Textschlüsseln gibt,
 * kann der Text nicht auseinanderlaufen.
 *
 * ZWEI AUSFÜHRUNGEN, damit die beiden Seiten nicht zeichengleich enden:
 *   `full`    — /schliesszeiten. Zwei Sandkästen mit Erklärung und Anrufbutton.
 *               Dort ist die Praxis geschlossen; der Hinweis ist akut und
 *               bekommt das volle Gewicht.
 *   `compact` — /kontakt. Eine Zeile mit beiden Nummern als `tel:`-Links,
 *               direkt unter den Kontaktwegen der Praxis. Die Nummern — der
 *               sicherheitsrelevante Teil — stehen unverkürzt da, nur die
 *               Erläuterung bleibt der Vollansicht vorbehalten.
 * Beide Ausführungen lesen dieselben Schlüssel; eine Nummer kann also nicht in
 * einer Ausführung veralten.
 *
 * Wichtig und rechtlich geboten: Der Block ist ein ALLGEMEINER Hinweis für
 * Zeiten außerhalb der Sprechstunde und steht deshalb räumlich getrennt vom
 * Urlaubshinweis. Der Bereitschaftsdienst darf nach den Regeln der KV nicht
 * als Urlaubsvertretung der Praxis benannt werden.
 *
 * Die Nummern 116 117 und 112 stehen in messages/de.json und nicht in
 * content/practice.ts: es sind öffentliche bundesweite Nummern, keine
 * Praxisdaten.
 */
export type EmergencyServiceVariant = 'full' | 'compact';

export function EmergencyService({variant = 'full'}: {variant?: EmergencyServiceVariant}) {
  const t = getTranslator();

  if (variant === 'compact') {
    return (
      <Section
        ariaLabel={t('emergency.regionLabel')}
        title={t('emergency.title')}
        tone="muted"
        spacing="sm"
      >
        {/* Beschriftung und Nummer bleiben ein Paar: die Zuordnung steht als
            Text da und nicht nur in der Reihenfolge. Die aria-labels nennen
            zusätzlich den Dienst — beim Durchsteppen der Links wäre ein
            blosses "116 117" sonst nicht einzuordnen. Der sichtbare Text
            (die Nummer) ist in beiden Namen enthalten (WCAG 2.5.3). */}
        <ul className="emergency-line" role="list">
          <li className="emergency-line__item">
            <span className="emergency-line__label">{t('emergency.service.title')}</span>
            <a
              className="emergency-line__number"
              href="tel:116117"
              aria-label={`${t('emergency.service.title')}: ${t('emergency.service.callLabel')}`}
            >
              {t('emergency.service.number')}
            </a>
          </li>
          <li className="emergency-line__item">
            <span className="emergency-line__label">{t('emergency.rescue.title')}</span>
            <a
              className="emergency-line__number"
              href="tel:112"
              aria-label={`${t('emergency.rescue.title')}: ${t('emergency.rescue.callLabel')}`}
            >
              {t('emergency.rescue.number')}
            </a>
          </li>
        </ul>
      </Section>
    );
  }

  return (
    <Section ariaLabel={t('emergency.regionLabel')} title={t('emergency.title')} tone="muted">
      <div className="callout-grid callout-grid--2">
        <div className="callout">
          <h3 className="callout__title">
            {/* Die Dringlichkeitsstufe steht als Text im Markup, nicht nur in der Farbe. */}
            <span className="visually-hidden">{t('emergency.noticeLabel')}: </span>
            {t('emergency.service.title')}
          </h3>
          <p className="callout__number">{t('emergency.service.number')}</p>
          <p className="callout__body">{t('emergency.service.body')}</p>
          <div className="button-row">
            <a className="button button--secondary" href="tel:116117">
              {t('emergency.service.callLabel')}
            </a>
          </div>
        </div>

        <div className="callout callout--urgent">
          <h3 className="callout__title">
            <span className="visually-hidden">{t('emergency.urgentLabel')}: </span>
            {t('emergency.rescue.title')}
          </h3>
          <p className="callout__number">{t('emergency.rescue.number')}</p>
          <p className="callout__body">{t('emergency.rescue.body')}</p>
          <div className="button-row">
            <a className="button button--secondary" href="tel:112">
              {t('emergency.rescue.callLabel')}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
