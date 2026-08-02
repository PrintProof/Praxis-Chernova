import Link from 'next/link';

import {Info} from '@/components/illustrations';
import {getTranslator} from '@/lib/i18n';
import {getPath} from '@/lib/routing';
import {formatVacationRange, getNextOrCurrentVacationNow, isOngoing} from '@/lib/vacations';

/**
 * Einzeiliges Hinweisband zum nächsten oder gerade laufenden Praxisurlaub.
 *
 * Steht auf Start- und Kontaktseite direkt unter der Kopfzeile. Bewusst nur
 * Label, Zeitraum und ein Link: die Vertretungsdaten stehen kanonisch auf
 * /schliesszeiten und werden hier nicht wiederholt. Gibt es keinen anstehenden
 * Zeitraum, rendert die Komponente nichts — dann bleibt die Seite ruhig.
 *
 * Statischer Block im Seitenfluss, kein Overlay, kein Modal, kein Skript.
 */
export function NextVacationBanner() {
  const t = getTranslator();
  const now = new Date();
  const period = getNextOrCurrentVacationNow(now);

  if (!period) {
    return null;
  }

  const running = isOngoing(period, now);

  return (
    <aside className="notice-bar" aria-label={t('vacation.compact.regionLabel')}>
      <div className="container notice-bar__inner">
        <span className="notice-bar__label">
          <Info className="icon icon--sm notice-bar__icon" />
          {running ? t('vacation.compact.currentLabel') : t('vacation.compact.upcomingLabel')}
        </span>
        <span className="notice-bar__range">{formatVacationRange(period)}</span>
        {/* Der sichtbare Linktext ist im aria-label enthalten (WCAG 2.5.3). */}
        <Link
          className="notice-bar__link"
          href={getPath('closures')}
          aria-label={t('vacation.compact.linkAria')}
        >
          {t('vacation.compact.link')}
        </Link>
      </div>
    </aside>
  );
}
