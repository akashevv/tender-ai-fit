import { createContext } from 'react';
import { dictionaries } from './translations';
import type { TranslationKey } from './translations';
import type { Lang, LocalizedText } from '../domain/types';
import { formatDate } from '../lib/dates';

export type Params = Record<string, string | number | undefined>;

export function hasKey(key: string): key is TranslationKey {
  return Object.prototype.hasOwnProperty.call(dictionaries.en, key);
}

/** Translate a key and fill {placeholders}. Params named "date" are formatted as DD.MM.YYYY. */
export function translate(lang: Lang, key: TranslationKey | string, params: Params = {}): string {
  const template = hasKey(key) ? dictionaries[lang][key] : key;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = params[name];
    if (value === undefined) return `{${name}}`;
    return name === 'date' ? formatDate(String(value)) : String(value);
  });
}

export function localize(text: LocalizedText, lang: Lang): string {
  return typeof text === 'string' ? text : text[lang];
}

export type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey | string, params?: Params) => string;
  loc: (text: LocalizedText) => string;
};

export const I18nContext = createContext<I18nValue>({
  lang: 'en',
  setLang: () => {},
  t: (key, params) => translate('en', key, params),
  loc: (text) => localize(text, 'en'),
});
