import {createTranslator} from 'next-intl';

import de from '@/messages/de.json';

export const locales = ['de'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'de';

const messagesMap = {
  de
} as const;

export function getMessages(locale: Locale = defaultLocale) {
  return messagesMap[locale];
}

export function getTranslator(locale: Locale = defaultLocale) {
  return createTranslator({
    locale,
    messages: getMessages(locale)
  });
}
