import { aaFill, darken, lighten, readableOn, withAlpha } from './color';
import { BASE_MODES } from './base-modes';
import { CwPreset, CwThemeSeeds, CwToken, CwTokenMap } from './theme.types';

/** Fallback primary if a preset/override omits one. */
const DEFAULT_PRIMARY = '#2563eb';

/**
 * Expand a preset (+ optional seed/token overrides) into the full `--cw-*` token
 * set. Structural tokens come from the base mode; brand tokens are *derived*
 * from the seeds so changing `primary`/`secondary` re-skins the brand without
 * disturbing the tuned neutrals, surfaces and contrast of the base mode.
 *
 * Precedence (low → high): base mode → derived brand → preset.tokens →
 * override.tokens → explicit seed radius/font.
 *
 * @returns a map keyed by token name *without* the `--cw-` prefix.
 */
export function buildTokens(preset: CwPreset, override?: { tokens?: CwTokenMap } & CwThemeSeeds): Record<string, string> {
  const base = BASE_MODES[preset.base];
  const dark = preset.dark ?? preset.base === 'dark';

  const seeds: CwThemeSeeds = { ...preset.seeds, ...stripUndefined(override) };
  const primary = seeds.primary ?? DEFAULT_PRIMARY;
  // `accent` is the single interactive brand colour components read (buttons,
  // inputs, selects, links, tabs) — it IS the primary. `secondary` is only a
  // complementary decorative accent (--cw-accent-alt), so a green theme's
  // controls read green, not the secondary hue.
  const accent = primary;
  const secondary = seeds.secondary;

  const primaryFill = aaFill(primary);

  const derived: CwTokenMap = {
    primary,
    'primary-hover': dark ? lighten(primary, 0.12) : darken(primary, 0.1),
    'primary-active': darken(primary, dark ? 0.16 : 0.22),
    'primary-fill': primaryFill,
    accent,
    'accent-alt': secondary ?? (dark ? lighten(primary, 0.15) : darken(primary, 0.1)),
    'accent-fill': primaryFill,
    // Accent text on a soft accent tint (selected menu/listbox rows). The tint
    // is slightly darker than white, so target a bit above AA-on-white (5.2) to
    // stay ≥4.5 on the tint. Dark themes brighten instead.
    'accent-strong': dark ? lighten(primary, 0.25) : aaFill(primary, 5.2),
    'text-on-accent': readableOn(primaryFill),
    'focus-ring': `0 0 0 3px ${withAlpha(primary, dark ? 0.35 : 0.25)}`,
    'chip-bg': withAlpha(primary, 0.14),
    'chip-fg': dark ? lighten(primary, 0.1) : aaFill(primary),
    // Group-header label follows the brand on light/frost; dark keeps white (from base).
    ...(dark ? {} : { 'grid-group-fg': primary }),
    // Accordion active header: frost tints it brand, others keep body text.
    'accordion-active-fg': preset.base === 'frost' ? primary : base['text']!
  };

  const merged: Record<string, string> = {
    ...(base as Record<string, string>),
    ...(derived as Record<string, string>),
    ...((preset.tokens as Record<string, string>) ?? {}),
    ...((override?.tokens as Record<string, string>) ?? {})
  };

  if (seeds.radius) { merged['radius'] = seeds.radius; }
  if (seeds.font) { merged['font'] = seeds.font; }

  return merged;
}

/** List of tokens the engine writes (for cleanup / iteration). */
export const ALL_TOKENS: CwToken[] = [
  'primary', 'primary-hover', 'primary-active', 'primary-fill',
  'accent', 'accent-alt', 'accent-fill', 'accent-strong',
  'surface-0', 'surface-1', 'surface-2', 'surface', 'surface-sunken', 'surface-raised',
  'surface-header', 'surface-pager', 'surface-hover', 'page-bg',
  'grid-row-bg', 'grid-group-bg', 'grid-group-fg',
  'border', 'border-strong', 'divider', 'row-border',
  'text', 'text-primary', 'text-secondary', 'text-muted', 'text-on-accent',
  'neutral-bg', 'neutral-fg', 'chip-bg', 'chip-fg', 'accordion-active-fg',
  'focus-ring', 'radius', 'radius-sm', 'radius-md', 'radius-lg', 'radius-xl', 'font',
  'shadow-sm', 'shadow-md', 'shadow-lg',
  'success', 'success-bg', 'success-fg', 'success-fill',
  'info', 'info-bg', 'info-fg',
  'warn', 'warn-bg', 'warn-fg', 'warn-fill',
  'danger', 'danger-bg', 'danger-fg', 'danger-fill'
];

function stripUndefined<T extends object>(obj?: T): Partial<T> {
  if (!obj) { return {}; }
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && k !== 'tokens' && k !== 'preset' && k !== 'scope' && k !== 'persist') {
      (out as Record<string, unknown>)[k] = v;
    }
  }
  return out;
}
