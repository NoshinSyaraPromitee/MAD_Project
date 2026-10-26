import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

import { applyTheme, getMode } from "../theme/colors";

const KEY = "themeMode";

// expo-secure-store has no web support, so the browser uses localStorage.
const storage = {
  async get() {
    try {
      if (Platform.OS === "web") return globalThis.localStorage?.getItem(KEY) ?? null;
      return await SecureStore.getItemAsync(KEY);
    } catch (e) {
      return null;
    }
  },
  async set(value) {
    try {
      if (Platform.OS === "web") globalThis.localStorage?.setItem(KEY, value);
      else await SecureStore.setItemAsync(KEY, value);
    } catch (e) {
      // keep the in-memory value
    }
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await storage.get();
      if (saved === "dark" || saved === "light") setMode(saved);
      setReady(true);
    })();
  }, []);

  // Swap the live palette before anything below renders.
  if (getMode() !== mode) applyTheme(mode);

  const setDark = useCallback((dark) => {
    const next = dark ? "dark" : "light";
    setMode(next);
    storage.set(next);
  }, []);

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === "dark",
      ready,
      setDark,
      toggleDark: () => setDark(mode !== "dark"),
    }),
    [mode, ready, setDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}