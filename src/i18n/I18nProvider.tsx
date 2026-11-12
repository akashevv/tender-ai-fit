import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { I18nContext, localize, translate } from './core';
import type { Lang } from '../domain/types';
import { STORAGE_KEYS, readString, writeString } from '../lib/storage';

function initialLang(): Lang {
  return readString(STORAGE_KEYS.lang) === 'kk' ? 'kk' : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    // Correct language attribute for screen readers, hyphenation and fonts.
    document.documentElement.lang = lang === 'kk' ? 'kk' : 'en';
    document.title = `${translate(lang, 'app.name')} — ${translate(lang, 'app.tagline')}`;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    writeString(STORAGE_KEYS.lang, next);
  }, []);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key: string, params?: Record<string, string | number | undefined>) => translate(lang, key, params),
      loc: (text: Parameters<typeof localize>[0]) => localize(text, lang),
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
