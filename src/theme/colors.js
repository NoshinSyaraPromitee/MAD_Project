// PlantPal design palette.
// Light = landing gradient (gold -> sage -> deep teal) with cream cards.
// Dark  = deep forest gradient with dark green cards and mint accents.
//
// `palette` and `gradient` are live objects: applyTheme() swaps their
// values, and ThemeProvider remounts the app so every screen re-reads them.

export const lightPalette = {
  // brand (same in both modes)
  gold: "#D4C26E",
  sage: "#7F9B5B",
  teal: "#1B5A4B",
  tealLight: "#2C7A63",
  cream: "#FFF6DC", // text/icons sitting on teal or on the gradient

  // surfaces
  surface: "#FFF6DC", // cards, sheets, inputs, chips
  surfaceAlt: "#FFFFFF", // blocks inside a sheet, bot chat bubble
  edge: "rgba(255,246,220,0.75)", // card border
  glass: "rgba(255,255,255,0.6)", // translucent fill on tiles
  tabBar: "#1B5A4B",
  overlay: "rgba(0,0,0,0.45)",

  // text
  ink: "#123F35", // page titles on the gradient
  textDark: "#1A3A31",
  textMuted: "#5F7A6E",
  accent: "#1B5A4B", // icons, links and numbers on surfaces
  taglineTop: "#5A4300",
  emptyInk: "#0B2A22",
  emptyIcon: "rgba(11,42,34,0.6)",

  // fills
  greenCardFill: "#D9E4B0",
  sageTile: "#E3EDBE",
  goldTile: "#F6E7A1",
  goldIcon: "#8A6A00",
  brownIcon: "#7A5A2E",
  buttonOrange: "#C98A55",
  price: "#E08600",
  warnBg: "#FFF3C4",
  warnBorder: "#F6E7A1",
  warnText: "#8A6D00",
  lockedBg: "#ECE6CC",
  lockedFg: "#A9A28A",
  switchOff: "#D8D2B4",
  switchOn: "#8FBFAE",
  dangerBg: "rgba(229,57,53,0.1)",
  failBg: "#FFEBEE",

  // fixed accents
  danger: "#E53935",
  star: "#FFD54F",
  waterBlue: "#42A5F5",
  sunAmber: "#FFB300",
  brown: "#8D6E63",
  white: "#FFFFFF",

  decorK: 1, // strength of the floating background decor
};

export const darkPalette = {
  ...lightPalette,

  surface: "#20352A",
  surfaceAlt: "#2A4234",
  edge: "rgba(255,255,255,0.08)",
  glass: "rgba(255,255,255,0.08)",
  tabBar: "#0F1A11",
  overlay: "rgba(0,0,0,0.6)",

  ink: "#E3EFC0",
  textDark: "#EEF2E6",
  textMuted: "#A7B8AD",
  accent: "#A8DC8C",
  taglineTop: "#E3EFC0",
  emptyInk: "#E3EFC0",
  emptyIcon: "rgba(227,239,192,0.7)",

  greenCardFill: "#36543B",
  sageTile: "#2B4532",
  goldTile: "#4A4325",
  goldIcon: "#F2D27A",
  brownIcon: "#E0B97F",
  buttonOrange: "#CE9C63",
  price: "#F2A93B",
  warnBg: "#4A3F1E",
  warnBorder: "#6B5A22",
  warnText: "#F2D27A",
  lockedBg: "#2E3A31",
  lockedFg: "#7D8A80",
  switchOff: "#4A5A4E",
  switchOn: "#4F8A6F",
  dangerBg: "rgba(229,57,53,0.18)",
  failBg: "#4A2326",

  decorK: 0.55,
};

const lightGradient = {
  colors: ["#D4C26E", "#7F9B5B", "#1B5A4B"],
  locations: [0, 0.45, 1],
};

const darkGradient = {
  colors: ["#24361F", "#162519", "#0C150F"],
  locations: [0, 0.45, 1],
};

export const palette = { ...lightPalette };
export const gradient = { ...lightGradient };

let currentMode = "light";

export const getMode = () => currentMode;
export const isDarkMode = () => currentMode === "dark";

export function applyTheme(mode) {
  currentMode = mode === "dark" ? "dark" : "light";
  const dark = currentMode === "dark";
  Object.assign(palette, dark ? darkPalette : lightPalette);
  Object.assign(gradient, dark ? darkGradient : lightGradient);
}

export const healthColors = {
  thriving: "#43A047",
  okay: "#7CB342",
  needsCare: "#FB8C00",
  critical: "#E53935",
};

// Semi-transparent cream (decor / text on the gradient), e.g. creamA(0.75)
export const creamA = (a) => `rgba(255,246,220,${a})`;

// Accent tint for icon circles, dividers and stepper buttons on surfaces.
export const tealA = (a) =>
  currentMode === "dark" ? `rgba(168,220,140,${a})` : `rgba(27,90,75,${a})`;

// Old keys kept so nothing that still imports `colors` breaks.
export const colors = palette;

export default palette;