import {createTranslator} from 'next-intl';

import de from '@/messages/de.json';
import en from '@/messages/en.json';
import ru from '@/messages/ru.json';
import tr from '@/messages/tr.json';

export const locales = ['de', 'en', 'tr', 'ru'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'de';
export const localeCookieName = 'preferred-locale';

const messagesMap = {
  de,
  en,
  tr,
  ru
} as const;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function hasLocalePrefix(pathname: string) {
  return locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
}

export function getMessages(locale: Locale) {
  return messagesMap[locale];
}

export function getTranslator(locale: Locale) {
  return createTranslator({
    locale,
    messages: getMessages(locale)
  });
}
