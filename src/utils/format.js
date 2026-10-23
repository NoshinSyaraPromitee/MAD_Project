// Bangladeshi taka sign, kept as an escape so the source stays ASCII.
export const TAKA = "\u09F3";

export const taka = (value) => `${TAKA}${Number(value || 0).toFixed(2)}`;

export const BULLET = "\u2022";
export const DOT = "\u00B7";
export const TIMES = "\u00D7";