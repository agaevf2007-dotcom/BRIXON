"use client";

import { getByPath } from "@/lib/i18n";
import { dictionaries, type Dictionary } from "@/locales";
import type { Locale } from "@/types/i18n";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "brixon-locale";

type LocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
  fading: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");
  const [fading, setFading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "ru" || stored === "en") setLocaleState(stored);
    } catch {
      /* keep default */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale, ready]);

  const setLocale = useCallback((next: Locale) => {
    setFading(true);
    window.setTimeout(() => {
      setLocaleState(next);
      setFading(false);
    }, 140);
  }, []);

  const dict = dictionaries[locale];

  const t = useCallback(
    (path: string) => getByPath(dict, path),
    [dict],
  );

  const value = useMemo(
    () => ({ locale, dict, setLocale, t, fading }),
    [locale, dict, setLocale, t, fading],
  );

  return (
    <LocaleContext.Provider value={value}>
      <div
        className="transition-opacity duration-300 ease-out"
        style={{ opacity: fading ? 0.35 : 1 }}
      >
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}
