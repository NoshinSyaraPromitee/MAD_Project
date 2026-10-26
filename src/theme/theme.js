import { Platform } from "react-native";

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const radius = { sm: 12, md: 16, card: 20, button: 20, lg: 28, pill: 999 };

// Soft dark drop shadow on both platforms.
export const shadow = (elevation = 3, opacity = 0.25) =>
  Platform.select({
    android: { elevation, shadowColor: "#000" },
    default: {
      shadowColor: "#000",
      shadowOpacity: opacity,
      shadowRadius: elevation * 2,
      shadowOffset: { width: 0, height: Math.ceil(elevation / 1.5) },
    },
  });

export { colors, palette, gradient, healthColors, creamA, tealA } from "./colors";
export { inter, fredoka, type } from "./typography";