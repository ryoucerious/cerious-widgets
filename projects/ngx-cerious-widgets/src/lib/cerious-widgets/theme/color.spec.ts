import { aaFill, contrast, hexToRgb, luminance, mix, readableOn, rgbToHex, toneScale, withAlpha } from './color';

describe('theme/color', () => {
  it('parses and serialises hex (3- and 6-digit) round-trip', () => {
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('2563eb')).toEqual({ r: 37, g: 99, b: 235 });
    expect(rgbToHex({ r: 37, g: 99, b: 235 })).toBe('#2563eb');
  });

  it('computes WCAG luminance and contrast', () => {
    expect(luminance('#ffffff')).toBeCloseTo(1, 3);
    expect(luminance('#000000')).toBeCloseTo(0, 3);
    expect(contrast('#ffffff', '#000000')).toBeCloseTo(21, 1);
  });

  it('readableOn picks the higher-contrast text colour', () => {
    expect(readableOn('#ffffff')).toBe('#0f172a'); // dark text on light bg
    expect(readableOn('#0f172a')).toBe('#ffffff'); // white text on dark bg
  });

  it('mix blends toward a target and withAlpha emits rgba', () => {
    expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(withAlpha('#2563eb', 0.14)).toBe('rgba(37, 99, 235, 0.14)');
  });

  it('aaFill darkens until white text meets AA 4.5:1', () => {
    for (const base of ['#f59e0b', '#22c55e', '#3b8df8', '#6c63ff']) {
      const fill = aaFill(base);
      expect(contrast(fill, '#ffffff')).toBeGreaterThanOrEqual(4.5);
    }
    // Already-dark colours are returned effectively unchanged (still passing).
    expect(contrast(aaFill('#1e40af'), '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });

  it('toneScale keeps base at 500 and ramps light→dark', () => {
    const s = toneScale('#2563eb');
    expect(s[500]).toBe('#2563eb');
    expect(luminance(s[50])).toBeGreaterThan(luminance(s[500]));
    expect(luminance(s[900])).toBeLessThan(luminance(s[500]));
    expect(luminance(s[50])).toBeGreaterThan(luminance(s[950]));
  });
});
