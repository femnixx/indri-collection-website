"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { settingsRepository, FALLBACK_SETTINGS } from '@/repositories/settingsRepository';
import type { ShopSettingsData } from '@/repositories/settingsRepository';

interface SettingsContextType {
  settings: ShopSettingsData;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: FALLBACK_SETTINGS,
});

export function useSettings() {
  return useContext(SettingsContext);
}

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ShopSettingsData>(FALLBACK_SETTINGS);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // CRITICAL: Only fetch once, never show loading state
    // Always render with fallback data immediately, update silently in background
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    settingsRepository.fetchPublicSettings().then((data) => {
      setSettings(data);
    }).catch(() => {
      // Silently fail - fallback data is already rendered
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  );
}