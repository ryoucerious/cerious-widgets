import { buildTokens } from './build-tokens';
import { contrast } from './color';
import { findPreset } from './presets';

describe('theme/build-tokens', () => {
  const light = findPreset('light');
  const dark = findPreset('dark');

  it('derives brand tokens from the preset seeds', () => {
    const t = buildTokens(light);
    expect(t['primary']).toBe('#2563eb');
    // accent IS the primary (the interactive brand colour); secondary → accent-alt
    expect(t['accent']).toBe('#2563eb');
    expect(t['accent-alt']).toBe('#8366f1');
    // fill must be AA for white text
    expect(contrast(t['primary-fill'], '#ffffff')).toBeGreaterThanOrEqual(4.5);
    expect(t['text-on-accent']).toBe('#ffffff');
  });

  it('takes structural tokens from the base mode', () => {
    expect(buildTokens(light)['surface']).toBe('#ffffff');
    expect(buildTokens(dark)['surface']).toBe('#141e2a');
    expect(buildTokens(dark)['text']).toBe('#f1f5f9');
  });

  it('re-skins the brand when primary is overridden, keeping neutrals', () => {
    const t = buildTokens(light, { primary: '#e11d48' });
    expect(t['primary']).toBe('#e11d48');
    expect(contrast(t['primary-fill'], '#ffffff')).toBeGreaterThanOrEqual(4.5);
    expect(t['surface']).toBe('#ffffff'); // neutral untouched
  });

  it('light/frost set grid-group-fg to the accent; dark keeps its base (white)', () => {
    expect(buildTokens(light)['grid-group-fg']).toBe(buildTokens(light)['accent']);
    expect(buildTokens(dark)['grid-group-fg']).toBe('#f1f5f9');
  });

  it('applies explicit seed radius and token overrides last', () => {
    const t = buildTokens(light, { radius: '2px', tokens: { primary: '#123456', surface: '#fafafa' } });
    expect(t['radius']).toBe('2px');
    expect(t['primary']).toBe('#123456'); // token override beats derived
    expect(t['surface']).toBe('#fafafa');
  });

  it('a preset with token overrides (e.g. sandstone) applies them', () => {
    const t = buildTokens(findPreset('sandstone'));
    expect(t['surface']).toBe('#fffdf8');
    expect(t['primary']).toBe('#9a3412');
  });
});
