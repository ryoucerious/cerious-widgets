/**
 * Dependency-free colour utilities for the runtime theming engine. Everything
 * works on `#rgb`/`#rrggbb` hex strings and plain rgb objects — no external
 * colour library. The contrast math matches WCAG 2.1 relative luminance, the
 * same formula the accessibility audit uses.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Parse `#rgb` or `#rrggbb` (with or without `#`) into an {r,g,b} object. */
export function hexToRgb(hex: string): Rgb {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

const clamp = (v: number): number => Math.max(0, Math.min(255, Math.round(v)));

/** Serialise an {r,g,b} object to `#rrggbb`. */
export function rgbToHex({ r, g, b }: Rgb): string {
  const to2 = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}

/** WCAG relative luminance of a colour (0 = black, 1 = white). */
export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const lin = [r, g, b].map(v => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

/** WCAG contrast ratio between two colours (1–21). */
export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Pick the more readable text colour for a background — whichever of `light`
 * (default white) / `dark` (default near-black slate) has the higher contrast.
 */
export function readableOn(bg: string, dark = '#0f172a', light = '#ffffff'): string {
  return contrast(bg, light) >= contrast(bg, dark) ? light : dark;
}

/** Linearly blend `a`→`b` by `t` (0..1) in sRGB space. */
export function mix(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbToHex({
    r: ca.r + (cb.r - ca.r) * t,
    g: ca.g + (cb.g - ca.g) * t,
    b: ca.b + (cb.b - ca.b) * t
  });
}

/** `rgba(...)` string for a hex colour at the given alpha (0..1). */
export function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Lighten toward white (`amount` 0..1). */
export function lighten(hex: string, amount: number): string {
  return mix(hex, '#ffffff', amount);
}

/** Darken toward black (`amount` 0..1). */
export function darken(hex: string, amount: number): string {
  return mix(hex, '#000000', amount);
}

/** Tonal-scale keys (Tailwind-style 50→950). */
export type ToneKey = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

// Mix fractions toward white (light steps) / black (dark steps), with 500 = base.
const TONE_STEPS: Record<ToneKey, { toward: 'white' | 'black' | 'base'; t: number }> = {
  50:  { toward: 'white', t: 0.95 },
  100: { toward: 'white', t: 0.9 },
  200: { toward: 'white', t: 0.75 },
  300: { toward: 'white', t: 0.55 },
  400: { toward: 'white', t: 0.3 },
  500: { toward: 'base',  t: 0 },
  600: { toward: 'black', t: 0.12 },
  700: { toward: 'black', t: 0.28 },
  800: { toward: 'black', t: 0.45 },
  900: { toward: 'black', t: 0.62 },
  950: { toward: 'black', t: 0.75 }
};

/**
 * Generate a 50→950 tonal ramp from a base colour (base sits at 500). A simple,
 * perceptually reasonable sRGB mix toward white/black — enough to derive hover /
 * active / tint shades without a heavyweight colour space.
 */
export function toneScale(base: string): Record<ToneKey, string> {
  const out = {} as Record<ToneKey, string>;
  for (const key of Object.keys(TONE_STEPS) as unknown as ToneKey[]) {
    const step = TONE_STEPS[key];
    out[key] =
      step.toward === 'base' ? base : mix(base, step.toward === 'white' ? '#ffffff' : '#000000', step.t);
  }
  return out;
}

/**
 * Darken a colour until white text on it meets the WCAG AA 4.5:1 threshold —
 * used to derive the `--cw-*-fill` tokens (filled surfaces with white labels).
 * If the base already passes, it is returned unchanged.
 */
export function aaFill(base: string, ratio = 4.5): string {
  let result = base;
  for (let t = 0; t <= 1.0001 && contrast(result, '#ffffff') < ratio; t += 0.04) {
    result = mix(base, '#000000', t);
  }
  return result;
}
