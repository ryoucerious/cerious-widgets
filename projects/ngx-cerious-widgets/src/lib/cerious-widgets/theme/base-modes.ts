import { CwBaseMode, CwTokenMap } from './theme.types';

/**
 * Structural (non-brand) token values for each base mode, mirroring the static
 * definitions in `grid/styles/_tokens.scss`. The theming engine takes these as
 * the foundation and layers the *derived* brand tokens (primary/accent/fills/
 * focus/chip/…) on top from the preset's seeds. Aliases are resolved to concrete
 * values so they can be written as inline custom properties.
 */

const SHARED_SHAPE_TYPE: CwTokenMap = {
  'radius-sm': '4px',
  'radius-md': '8px',
  'radius-lg': '12px',
  'radius-xl': '16px',
  radius: '8px',
  font: `'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
};

// AA-dark severity fills are theme-independent (white text ≥4.5:1 everywhere).
const SHARED_FILLS: CwTokenMap = {
  'success-fill': '#15803d',
  'warn-fill': '#b45309',
  'danger-fill': '#c81e1e'
};

const LIGHT: CwTokenMap = {
  ...SHARED_SHAPE_TYPE,
  ...SHARED_FILLS,
  'surface-0': '#ffffff', 'surface-1': '#f8fafc', 'surface-2': '#eef2f7',
  surface: '#ffffff', 'surface-sunken': '#f8fafc', 'surface-raised': '#eef2f7',
  'surface-header': '#eef2f7', 'surface-pager': '#f8fafc', 'surface-hover': '#eef2f7',
  'page-bg': '#f8fafc',
  'grid-row-bg': '#fefefe', 'grid-group-bg': '#f9fafc',
  border: '#e2e8f0', 'border-strong': '#cbd5e1', divider: '#eef0f4', 'row-border': '#f1f3f7',
  text: '#0f172a', 'text-primary': '#0f172a', 'text-secondary': '#576475', 'text-muted': '#576475',
  'neutral-bg': '#eef2f7', 'neutral-fg': '#475569',
  'shadow-sm': '0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.05)',
  'shadow-md': '0 4px 12px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.05)',
  'shadow-lg': '0 12px 32px rgba(15, 23, 42, 0.14), 0 4px 8px rgba(15, 23, 42, 0.06)',
  success: '#16a34a', 'success-bg': '#f0fdf4', 'success-fg': '#15803d',
  info: '#2563eb', 'info-bg': '#eff6ff', 'info-fg': '#1d4ed8',
  warn: '#d97706', 'warn-bg': '#fffbeb', 'warn-fg': '#b45309',
  danger: '#dc2626', 'danger-bg': '#fef2f2', 'danger-fg': '#b91c1c'
};

const DARK: CwTokenMap = {
  ...SHARED_SHAPE_TYPE,
  ...SHARED_FILLS,
  'surface-0': '#0d1825', 'surface-1': '#141e2a', 'surface-2': '#1d2836',
  surface: '#141e2a', 'surface-sunken': '#0d1825', 'surface-raised': '#1d2836',
  'surface-header': '#141e2a', 'surface-pager': '#141e2a', 'surface-hover': '#1a2534',
  'page-bg': '#0d1825',
  'grid-row-bg': '#121c28', 'grid-group-bg': '#16202b', 'grid-group-fg': '#f1f5f9',
  border: '#202a36', 'border-strong': '#293442', divider: '#242e3a', 'row-border': '#202a36',
  text: '#f1f5f9', 'text-primary': '#f1f5f9', 'text-secondary': '#94a3b8', 'text-muted': '#94a3b8',
  'neutral-bg': '#1b2634', 'neutral-fg': '#cbd5e1',
  'shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.4)',
  'shadow-md': '0 4px 14px rgba(0, 0, 0, 0.45)',
  'shadow-lg': '0 16px 40px rgba(0, 0, 0, 0.55)',
  success: '#22c55e', 'success-bg': '#14321f', 'success-fg': '#4ade80',
  info: '#3b8df8', 'info-bg': '#14243d', 'info-fg': '#7ab5fb',
  warn: '#f59e0b', 'warn-bg': '#3a2c10', 'warn-fg': '#fbbf24',
  danger: '#f87171', 'danger-bg': '#3a1a1a', 'danger-fg': '#f87171'
};

const FROST: CwTokenMap = {
  ...SHARED_SHAPE_TYPE,
  ...SHARED_FILLS,
  'surface-0': 'rgba(255, 255, 255, 0.38)', 'surface-1': 'rgba(255, 255, 255, 0.22)', 'surface-2': 'rgba(255, 255, 255, 0.46)',
  surface: 'rgba(255, 255, 255, 0.38)', 'surface-sunken': 'transparent', 'surface-raised': 'rgba(255, 255, 255, 0.46)',
  'surface-header': 'rgba(255, 255, 255, 0.14)', 'surface-pager': 'transparent', 'surface-hover': 'rgba(108, 99, 255, 0.10)',
  'page-bg': 'linear-gradient(135deg, #dbe3fc 0%, #eee0f9 45%, #d7f0f9 100%)',
  'grid-row-bg': 'rgba(255, 255, 255, 0.38)', 'grid-group-bg': 'rgba(148, 163, 184, 0.08)',
  border: 'rgba(255, 255, 255, 0.55)', 'border-strong': 'rgba(148, 163, 184, 0.45)',
  divider: 'rgba(255, 255, 255, 0.75)', 'row-border': 'rgba(255, 255, 255, 0.5)',
  text: '#0f172a', 'text-primary': '#0f172a', 'text-secondary': '#475569', 'text-muted': '#475569',
  'neutral-bg': 'rgba(108, 99, 255, 0.14)', 'neutral-fg': '#4f46e5',
  'shadow-sm': '0 2px 8px rgba(79, 70, 229, 0.08)',
  'shadow-md': '0 8px 24px rgba(79, 70, 229, 0.12)',
  'shadow-lg': '0 16px 40px rgba(79, 70, 229, 0.18)',
  success: '#16a34a', 'success-bg': 'rgba(22, 163, 74, 0.14)', 'success-fg': '#15803d',
  info: '#2563eb', 'info-bg': 'rgba(37, 99, 235, 0.12)', 'info-fg': '#1d4ed8',
  warn: '#d97706', 'warn-bg': 'rgba(217, 119, 6, 0.14)', 'warn-fg': '#b45309',
  danger: '#dc2626', 'danger-bg': 'rgba(220, 38, 38, 0.14)', 'danger-fg': '#b91c1c'
};

export const BASE_MODES: Record<CwBaseMode, CwTokenMap> = {
  light: LIGHT,
  dark: DARK,
  frost: FROST
};
