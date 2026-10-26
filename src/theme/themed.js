import { StyleSheet } from "react-native";

import { getMode } from "./colors";

/**
 * Like StyleSheet.create, but the styles are rebuilt for the current
 * light/dark mode. The factory runs lazily, once per mode, so it always
 * reads the live `palette` values.
 *
 *   const styles = themed(() => ({ card: { backgroundColor: palette.surface } }));
 *   <View style={styles.card} />
 */
export function themed(factory) {
  const cache = {};
  const current = () => {
    const mode = getMode();
    if (!cache[mode]) cache[mode] = StyleSheet.create(factory());
    return cache[mode];
  };

  return new Proxy(
    {},
    {
      get: (_, key) => current()[key],
      has: (_, key) => key in current(),
      ownKeys: () => Reflect.ownKeys(current()),
      getOwnPropertyDescriptor: (_, key) => ({
        enumerable: true,
        configurable: true,
        value: current()[key],
      }),
    }
  );
}