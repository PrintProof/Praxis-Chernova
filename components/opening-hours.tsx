import {practice} from '@/content/practice';
import type {Locale} from '@/lib/i18n';
import {getTranslator} from '@/lib/i18n';

export function OpeningHours({locale}: {locale: Locale}) {
  const t = getTranslator(locale);

  return (
    <div className="hours-card">
      <div className="hours-card__header">
        <h3>{t('contact.openingHoursTitle')}</h3>
        <p>{t('contact.openingHoursDescription')}</p>
      </div>
      <dl className="hours-list">
        {practice.openingHours.map((entry) => (
          <div key={entry.dayKey} className="hours-list__row">
            <dt>{t(`days.${entry.dayKey}`)}</dt>
            <dd>{entry.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
