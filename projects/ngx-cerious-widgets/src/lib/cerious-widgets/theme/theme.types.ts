/**
 * Types for the runtime theming engine. Tokens are the `--cw-*` custom
 * properties the components read; a preset is a base mode + brand seeds; a
 * config is what a consumer passes to `provideCeriousTheme` / `CwThemeService`.
 */

/** The full set of semantic tokens the engine can write. */
export type CwToken =
  // Brand
  | 'primary' | 'primary-hover' | 'primary-active' | 'primary-fill'
  | 'accent' | 'accent-alt' | 'accent-fill' | 'accent-strong'
  // Surfaces
  | 'surface-0' | 'surface-1' | 'surface-2'
  | 'surface' | 'surface-sunken' | 'surface-raised' | 'surface-header' | 'surface-pager' | 'surface-hover'
  | 'page-bg'
  // Grid rows
  | 'grid-row-bg' | 'grid-group-bg' | 'grid-group-fg'
  // Lines
  | 'border' | 'border-strong' | 'divider' | 'row-border'
  // Text
  | 'text' | 'text-primary' | 'text-secondary' | 'text-muted' | 'text-on-accent'
  // Neutral fill + chip
  | 'neutral-bg' | 'neutral-fg' | 'chip-bg' | 'chip-fg'
  | 'accordion-active-fg'
  // Focus / shape / type
  | 'focus-ring' | 'radius' | 'radius-sm' | 'radius-md' | 'radius-lg' | 'radius-xl' | 'font'
  // Elevation
  | 'shadow-sm' | 'shadow-md' | 'shadow-lg'
  // Severity
  | 'success' | 'success-bg' | 'success-fg' | 'success-fill'
  | 'info' | 'info-bg' | 'info-fg'
  | 'warn' | 'warn-bg' | 'warn-fg' | 'warn-fill'
  | 'danger' | 'danger-bg' | 'danger-fg' | 'danger-fill';

/** A partial map of tokens → CSS values. */
export type CwTokenMap = Partial<Record<CwToken, string>>;

/** The structural (non-brand) base a preset builds on. */
export type CwBaseMode = 'light' | 'dark' | 'frost';

/** The few brand knobs a consumer sets to re-skin. */
export interface CwThemeSeeds {
  /** Primary brand colour (hex). Drives primary/hover/active/fill + focus ring. */
  primary?: string;
  /** Secondary/accent colour (hex). Defaults to `primary` when omitted. */
  secondary?: string;
  /** Corner radius for the default `--cw-radius` (any CSS length, e.g. `10px`). */
  radius?: string;
  /** Base font-family stack. */
  font?: string;
}

/** A named, ready-to-apply theme: a base mode + seeds + optional token overrides. */
export interface CwPreset {
  /** Stable id used for `data-cw-theme` and lookups. */
  name: string;
  /** Human-readable label for pickers. */
  label: string;
  /** Whether this preset reads as a dark colour scheme. */
  dark?: boolean;
  /** Structural token base to build on. */
  base: CwBaseMode;
  /** Brand seeds for this preset. */
  seeds: CwThemeSeeds;
  /** Explicit token overrides applied on top of the derived set. */
  tokens?: CwTokenMap;
}

/** What `provideCeriousTheme` / `CwThemeService.apply` accept. */
export interface CwThemeConfig extends CwThemeSeeds {
  /** Name of a built-in (or registered) preset to start from. Defaults to `light`. */
  preset?: string;
  /** Element to scope the theme to (for regional theming). Defaults to `<html>`. */
  scope?: HTMLElement;
  /** Persist the last applied preset name to localStorage. */
  persist?: boolean;
  /** Arbitrary token overrides, applied last (highest precedence). */
  tokens?: CwTokenMap;
}
