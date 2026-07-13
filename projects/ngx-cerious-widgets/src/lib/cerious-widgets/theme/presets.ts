import { CwPreset } from './theme.types';

/**
 * The curated Cerious theme presets. Light / Frost / Dark mirror the static
 * stylesheet baseline; the rest are new, each expressed as a base mode + a few
 * brand seeds (and the occasional structural override) so they stay consistent
 * and re-skin cleanly. Consumers apply one by name and can override its seeds.
 */
export const CW_PRESETS: CwPreset[] = [
  {
    name: 'light',
    label: 'Cerious Light',
    base: 'light',
    seeds: { primary: '#2563eb', secondary: '#8366f1' }
  },
  {
    name: 'frost',
    label: 'Frost',
    base: 'frost',
    seeds: { primary: '#6c63ff', secondary: '#a855f7' }
  },
  {
    name: 'dark',
    label: 'Cerious Dark',
    base: 'dark',
    dark: true,
    seeds: { primary: '#14b8a6', secondary: '#3b8df8' }
  },

  // ---- New presets ----
  {
    name: 'cerious',
    label: 'Cerious DevTech',
    base: 'dark',
    dark: true,
    // The Cerious DevTech brand: deep-navy glass, mint primary + soft-blue
    // secondary, and generous rounded corners (matches ceriousdevtech.com).
    seeds: { primary: '#78f3d2', secondary: '#8cb7ff', radius: '16px' },
    tokens: {
      'radius-sm': '8px', 'radius-md': '16px', 'radius-lg': '22px', 'radius-xl': '28px',
      'surface-0': '#02050a', 'surface-1': '#080b12', 'surface-2': '#101722',
      surface: '#080b12', 'surface-sunken': '#02050a', 'surface-raised': '#101722',
      'surface-header': '#080b12', 'surface-pager': '#080b12', 'surface-hover': '#111a26',
      'page-bg': '#02050a',
      'grid-row-bg': '#070a11', 'grid-group-bg': '#0d141d',
      border: '#1a2431', 'border-strong': '#28333f', divider: '#151e29', 'row-border': '#131b26',
      text: '#f6f8fb', 'text-primary': '#f6f8fb', 'text-secondary': '#a7b1c2', 'text-muted': '#a7b1c2',
      'neutral-bg': '#101722', 'neutral-fg': '#a7b1c2',
      'shadow-sm': '0 2px 10px rgba(0, 0, 0, 0.4)',
      'shadow-md': '0 12px 40px rgba(0, 0, 0, 0.45)',
      'shadow-lg': '0 24px 80px rgba(0, 0, 0, 0.55)'
    }
  },
  {
    name: 'midnight',
    label: 'Midnight',
    base: 'dark',
    dark: true,
    // Near-OLED black surfaces + a cool teal brand.
    seeds: { primary: '#2dd4bf', secondary: '#38bdf8' },
    tokens: {
      'surface-0': '#000000', 'surface-1': '#0a0f16', 'surface-2': '#121924',
      surface: '#0a0f16', 'surface-sunken': '#000000', 'surface-raised': '#121924',
      'surface-header': '#0a0f16', 'surface-pager': '#0a0f16', 'surface-hover': '#141c28',
      'page-bg': '#000000',
      'grid-row-bg': '#0a0f16', 'grid-group-bg': '#111823',
      border: '#1b232f', 'border-strong': '#28323f', divider: '#1b232f', 'row-border': '#161d28'
    }
  },
  {
    name: 'sandstone',
    label: 'Sandstone',
    base: 'light',
    // Warm, paper-like light theme with a deep-terracotta brand (dark enough to
    // stay AA on the theme's warm tints).
    seeds: { primary: '#9a3412', secondary: '#854d0e' },
    tokens: {
      'surface-0': '#fffdf8', 'surface-1': '#faf6ee', 'surface-2': '#f3ecdd',
      surface: '#fffdf8', 'surface-sunken': '#faf6ee', 'surface-raised': '#f3ecdd',
      'surface-header': '#f3ecdd', 'surface-pager': '#faf6ee', 'surface-hover': '#f3ecdd',
      'page-bg': '#faf6ee',
      'grid-row-bg': '#fffdf8', 'grid-group-bg': '#f7f1e6',
      border: '#e7dcc7', 'border-strong': '#d6c6a8', divider: '#efe7d6', 'row-border': '#f0e9db',
      text: '#3f2d16', 'text-primary': '#3f2d16', 'text-secondary': '#6b573c', 'text-muted': '#6b573c',
      'neutral-bg': '#f3ecdd', 'neutral-fg': '#6b573c'
    }
  },
  {
    name: 'emerald',
    label: 'Emerald',
    base: 'light',
    // Fresh green brand (AA as text on light) with a teal secondary accent.
    seeds: { primary: '#047857', secondary: '#0d9488' }
  },
  {
    name: 'grape',
    label: 'Grape',
    base: 'light',
    // Rich violet brand (AA as text on light) with a magenta secondary accent.
    seeds: { primary: '#6d28d9', secondary: '#c026d3' }
  },
  {
    name: 'contrast',
    label: 'High Contrast',
    base: 'light',
    // Maximum-legibility light theme: pure black text/brand, hard borders.
    seeds: { primary: '#1d4ed8', secondary: '#6d28d9' },
    tokens: {
      'surface-0': '#ffffff', 'surface-1': '#ffffff', 'surface-2': '#f2f2f2',
      surface: '#ffffff', 'surface-sunken': '#ffffff', 'surface-raised': '#f2f2f2',
      'surface-header': '#f2f2f2', 'surface-pager': '#ffffff', 'surface-hover': '#e8e8e8',
      'page-bg': '#ffffff',
      'grid-row-bg': '#ffffff', 'grid-group-bg': '#eeeeee',
      border: '#000000', 'border-strong': '#000000', divider: '#767676', 'row-border': '#767676',
      text: '#000000', 'text-primary': '#000000', 'text-secondary': '#1a1a1a', 'text-muted': '#333333',
      'neutral-bg': '#e8e8e8', 'neutral-fg': '#000000'
    }
  },

  // ---- Presets that change more than colour (shape + elevation) ----
  {
    name: 'flat',
    label: 'Flat',
    base: 'light',
    // No elevation, near-square corners, crisp borders — a utilitarian look.
    seeds: { primary: '#2563eb', secondary: '#7c3aed', radius: '3px' },
    tokens: {
      'radius-sm': '2px', 'radius-md': '3px', 'radius-lg': '4px', 'radius-xl': '6px',
      'shadow-sm': 'none',
      'shadow-md': '0 0 0 1px rgba(15, 23, 42, 0.10)',
      'shadow-lg': '0 0 0 1px rgba(15, 23, 42, 0.14)',
      'border-strong': '#94a3b8'
    }
  },
  {
    name: 'soft',
    label: 'Soft',
    base: 'light',
    // Pillowy, large radius + diffuse soft shadows for a friendly, rounded feel.
    seeds: { primary: '#0369a1', secondary: '#8b5cf6', radius: '16px' },
    tokens: {
      'radius-sm': '10px', 'radius-md': '14px', 'radius-lg': '22px', 'radius-xl': '28px',
      'surface-1': '#f6f8fb', 'page-bg': '#eef2f8',
      'shadow-sm': '0 2px 8px rgba(15, 23, 42, 0.05)',
      'shadow-md': '0 10px 30px rgba(15, 23, 42, 0.09)',
      'shadow-lg': '0 24px 60px rgba(15, 23, 42, 0.14)'
    }
  }
];

/** Look up a preset by name (falls back to `light`). */
export function findPreset(name?: string): CwPreset {
  return CW_PRESETS.find(p => p.name === name) ?? CW_PRESETS[0];
}
