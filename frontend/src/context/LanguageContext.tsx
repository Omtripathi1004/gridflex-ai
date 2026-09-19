'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, translations, LanguageMeta } from '../i18n/translations';
import { COMMON_GLOSSARY } from '../i18n/glossary';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  dir: 'ltr' | 'rtl';
  supportedLanguages: LanguageMeta[];
  currentLanguageMeta: LanguageMeta;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    // Check localStorage or browser language on mount
    const saved = localStorage.getItem('gridflex_language') as SupportedLanguage;
    if (saved && translations[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem('gridflex_language', lang);
    }
  };

  const currentLanguageMeta = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const dir = currentLanguageMeta.dir;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', language);
      document.documentElement.setAttribute('dir', dir);
    }
  }, [language, dir]);

  const t = (key: string, fallback?: string): string => {
    // 1. Direct translation key lookup
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }

    // 2. Glossary direct lookup for key or fallback
    const glossary = COMMON_GLOSSARY[language];
    if (glossary) {
      if (glossary[key]) return glossary[key];
      if (fallback && glossary[fallback]) return glossary[fallback];
    }

    // 3. Fallback to English dictionary
    const enDict = translations['en'];
    if (enDict && enDict[key]) {
      // If user selected non-English language, try glossary on the English translation value
      if (language !== 'en' && glossary && glossary[enDict[key]]) {
        return glossary[enDict[key]];
      }
      return enDict[key];
    }

    // 4. Return fallback or key
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        dir,
        supportedLanguages: SUPPORTED_LANGUAGES,
        currentLanguageMeta,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
