// path: src/locales/dictionaries.ts

import 'server-only';

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  ko: () => import('./ko.json').then((module) => module.default),
  ja: () => import('./ja.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'en' | 'ko' | 'ja') => {
  if (!dictionaries[locale]) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  return dictionaries[locale]();
};
