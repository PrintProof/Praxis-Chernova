import {getTranslator} from '@/lib/i18n';
import {formatVacationRange, getActiveVacationPeriods, telHref} from '@/lib/vacations';

type PracticeNoticeProps = {
  /** Umschließt den Hinweis mit einem zentrierten Container (z.B. für die Startseite). */
  withContainer?: boolean;
  /**
   * Eigene Überschrift anzeigen. Auf false setzen, wenn der Hinweis bereits in
   * einer Section mit Titel steckt (z.B. Kontaktseite), um eine doppelte Überschrift zu vermeiden.
   */
  showTitle?: boolean;
};

export function PracticeNotice({withContainer = false, showTitle = true}: PracticeNoticeProps = {}) {
  const t = getTranslator();
  const periods = getActiveVacationPeriods(new Date());

  if (periods.length === 0) {
    return null;
  }

  const notice = (
    <aside className="practice-notice" role="status" aria-label={t('notice.title')}>
      {showTitle ? <p className="practice-notice__title">{t('notice.title')}</p> : null}
      <p className="practice-notice__lead">{t('notice.closedLabel')}</p>
      <ul className="practice-notice__list">
        {periods.map((period, index) => (
          <li className="practice-notice__item" key={`${period.start}-${period.end}-${index}`}>
            <p className="practice-notice__range">{formatVacationRange(period)}</p>
            {period.note ? <p className="practice-notice__note">{period.note}</p> : null}
            {period.substitute ? (
              <div className="practice-notice__substitute">
                <p className="practice-notice__substitute-label">{t('notice.substituteLabel')}</p>
                <p className="practice-notice__substitute-name">{period.substitute.name}</p>
                {period.substitute.street ? <p>{period.substitute.street}</p> : null}
                {period.substitute.postalCode || period.substitute.city ? (
                  <p>
                    {[period.substitute.postalCode, period.substitute.city].filter(Boolean).join(' ')}
                  </p>
                ) : null}
                {period.substitute.phone ? (
                  <p>
                    <a href={telHref(period.substitute.phone)}>{period.substitute.phone}</a>
                  </p>
                ) : null}
                {period.substitute.note ? (
                  <p className="practice-notice__substitute-note">{period.substitute.note}</p>
                ) : null}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </aside>
  );

  if (withContainer) {
    return <div className="container practice-notice__container">{notice}</div>;
  }

  return notice;
}
