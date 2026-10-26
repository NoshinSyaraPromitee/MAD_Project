import {
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from "@expo-google-fonts/fredoka";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

import { palette } from "./colors";

// Passed to useFonts() in App.js
export const fontAssets = {
  Fredoka_600SemiBold,
  Fredoka_700Bold,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
};

const interByWeight = {
  "400": "Inter_400Regular",
  "500": "Inter_500Medium",
  "600": "Inter_600SemiBold",
  "700": "Inter_700Bold",
  "800": "Inter_800ExtraBold",
};

// Body text: inter(15, "700", color)
export const inter = (size, weight = "500", color = palette.textDark, extra = {}) => ({
  fontFamily: interByWeight[weight] || interByWeight["500"],
  fontSize: size,
  color,
  ...extra,
});

// Headings: fredoka(30, "700", color)
export const fredoka = (size, weight = "700", color = palette.ink, extra = {}) => ({
  fontFamily: weight === "600" ? "Fredoka_600SemiBold" : "Fredoka_700Bold",
  fontSize: size,
  color,
  ...extra,
});

// Getters so the colours follow light/dark mode.
export const type = {
  get hero() {
    return fredoka(56, "600", palette.cream, { letterSpacing: 0.2 });
  },
  get screenTitle() {
    return fredoka(30, "700", palette.ink, { letterSpacing: 0.2 });
  },
  get title() {
    return fredoka(22, "600", palette.textDark);
  },
  get section() {
    return inter(17, "700", palette.cream);
  },
  get body() {
    return inter(14, "500", palette.textDark, { lineHeight: 21 });
  },
  get caption() {
    return inter(12, "500", palette.textMuted);
  },
};