import {getTranslator} from '@/lib/i18n';
import {
  formatCompactRange,
  formatVacationRange,
  getImminentVacationNow,
  getUpcomingVacationsNow,
  telHref,
  vacationListYear
} from '@/lib/vacations';

type PracticeNoticeProps = {
  /** Umschließt die Anzeige mit einem zentrierten Container (z.B. für die Startseite). */
  withContainer?: boolean;
};

export function PracticeNotice({withContainer = false}: PracticeNoticeProps = {}) {
  const t = getTranslator();
  const now = new Date();
  const upcoming = getUpcomingVacationsNow(now);

  if (upcoming.length === 0) {
    return null;
  }

  const year = vacationListYear(upcoming, now);
  const imminent = getImminentVacationNow(now);

  const content = (
    <div className="vacation-info">
      <p className="vacation-overview">
        <span className="vacation-overview__label">
          {t('notice.overviewLabel')} {year}:
        </span>{' '}
        {upcoming.map((period) => formatCompactRange(period)).join(', ')}
      </p>

      {imminent ? (
        <aside className="practice-notice" role="status" aria-label={t('notice.title')}>
          <p className="practice-notice__lead">{t('notice.closedLabel')}</p>
          <ul className="practice-notice__list">
            <li className="practice-notice__item">
              <p className="practice-notice__range">{formatVacationRange(imminent)}</p>
              {imminent.note ? <p className="practice-notice__note">{imminent.note}</p> : null}
              {imminent.substitutes && imminent.substitutes.length > 0 ? (
                <div className="practice-notice__substitutes">
                  <p className="practice-notice__substitute-label">
                    {imminent.substitutes.length > 1
                      ? t('notice.substitutesLabel')
                      : t('notice.substituteLabel')}
                  </p>
                  {imminent.substitutes.map((sub, index) => (
                    <div className="practice-notice__substitute" key={index}>
                      <p className="practice-notice__substitute-name">{sub.name}</p>
                      {sub.street ? <p>{sub.street}</p> : null}
                      {sub.postalCode || sub.city ? (
                        <p>{[sub.postalCode, sub.city].filter(Boolean).join(' ')}</p>
                      ) : null}
                      {sub.phone ? (
                        <p>
                          <a href={telHref(sub.phone)}>{sub.phone}</a>
                        </p>
                      ) : null}
                      {sub.note ? (
                        <p className="practice-notice__substitute-note">{sub.note}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </li>
          </ul>
        </aside>
      ) : null}
    </div>
  );

  if (withContainer) {
    return <div className="container practice-notice__container">{content}</div>;
  }

  return content;
}
