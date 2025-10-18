import React, { createContext, useContext, useMemo } from 'react';
import { useAppSelector } from '@/store';
import { tr } from '@/locales/tr';
import { en } from '@/locales/en';

type TranslationKey = keyof typeof tr;
type NestedKey<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? `${K}.${keyof T[K] & string}`
    : K
  : never;

type AllKeys = NestedKey<typeof tr, TranslationKey> | string;

type TranslationFunction = (key: AllKeys, params?: Record<string, string | number>) => string;

interface LanguageContextValue {
  t: TranslationFunction;
  currentLanguage: 'tr' | 'en';
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { currentLanguage, isRTL } = useAppSelector((state) => state.language);

  const translations = useMemo(() => {
    return currentLanguage === 'tr' ? tr : en;
  }, [currentLanguage]);

  const t: TranslationFunction = (key, params = {}) => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return the key if translation not found
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }

    // Replace parameters in the translation string
    let result = value;
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
    });

    return result;
  };

  const value = useMemo(
    () => ({
      t,
      currentLanguage,
      isRTL,
    }),
    [t, currentLanguage, isRTL]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
