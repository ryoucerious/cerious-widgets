# Changelog

All notable changes to this project will be documented in this file.

## [1.0.10] - 2025-06-11
### Added
- Support for Angular **standalone components**, the grid can now be used without importing a shared module.
- Integrated **Angular Signals** for improved reactive performance in change detection and data binding.

### Changed
- Updated internal structure to reduce module dependencies and improve compatibility with future Angular versions.

### Notes
- This version maintains backward compatibility with non-standalone usage.
- Consumers can now use the grid directly in `standalone: true` components with `importProvidersFrom()` or custom providers.

## [1.0.11] - 2025-06-15
### Added
- Support for custom classes such as Tailwind CSS.

### Changed
- Fixed an issue that was causing the gridRow to loose its reference.

### Notes
- You can now use custom classes by applying them directly to the GridComponent template.

## [1.0.16] - 2026-06-01
### Added
- **CeriousScroll is now the core virtual scroller** for the grid body. The in-house viewport implementation has been replaced with [`@ceriousdevtech/cerious-scroll`](https://www.npmjs.com/package/@ceriousdevtech/cerious-scroll) (via `@ceriousdevtech/ngx-cerious-scroll`), bringing O(1)-memory virtualization, an attached native scrollbar, and unified momentum/touch handling.
- New `enableVirtualScroll` grid option (defaults to `true`). Set to `false` to render all rows in a standard scrollable container, useful for small datasets, printing, or full-page exports.
- Mobile horizontal scrolling support: the touch controller now performs axis detection on touchstart and forwards horizontal-dominant gestures to the grid's native horizontal scroller while preserving vertical momentum.

### Changed
- `GridRowColumnComponent` refactored to use cached computed signals and a single consolidated `ngSwitch` block, reducing per-cell change-detection cost during fast vertical scrolling.
- Currency cell formatting now uses a memoized `Intl.NumberFormat` instance per locale/currency pair instead of constructing a new formatter per cell render.

## [1.0.17] - 2026-06-04
### Added
- New Compodoc theme override (`tools/compodoc-cerious-theme.css`) and `docs:api` / `docs:api:theme` npm scripts that generate and reskin the API documentation to match the Cerious DevTech dark theme.
- New demo SPA theme override (`docs/cerious-theme.css`) applied to the prebuilt docs site, including a sticky frosted navbar with content blur, dark glass sidebar, attached tab-card layout for example pages, themed code blocks, scrollbars, and mobile-friendly breakpoints.

### Changed
- Bumped `@ceriousdevtech/ngx-cerious-scroll` to `^1.0.4`.
- Moved `@angular/cdk` and `@ceriousdevtech/ngx-cerious-scroll` from `peerDependencies` to `dependencies` so consumers no longer have to install them manually. Added `allowedNonPeerDependencies` to `ng-package.json` to satisfy ng-packagr.
- Removed direct `@ceriousdevtech/cerious-scroll` dependency; it is now pulled in transitively through `@ceriousdevtech/ngx-cerious-scroll`.

## [1.2.0] - 2026-07-14
### Added
- **Zero-config styling, no stylesheet import required.** The library now injects its structural stylesheet (design tokens, CDK-overlay theming, virtual-scrollbar and directive-applied form-control styles, and the grid chrome) at bootstrap, so consumers no longer have to add `grid-styles-generated.scss` to their `angular.json` `styles` array. Module apps get it from `CeriousWidgetsModule.forRoot(...)`; standalone apps call `provideCeriousTheme()` once. A new `CwThemeService.ensureGlobalStyles()` performs the one-time injection via an internal `ViewEncapsulation.None` host, and the runtime theming engine layers `--cw-*` overrides on top. The manual stylesheet import still works and is deduped.

### Fixed
- **Grid renders no rows under a production build.** Under zoneless change detection the grid populated its row model in `ngOnInit` before the body view existed, and prod (unlike dev) has no second verification pass to flush the deferred render, so the grid appeared empty. The grid now explicitly renders and runs change detection after the view initializes.
- **Area chart axis text scaled up on wide cards.** The SVG used `preserveAspectRatio="none"` with a fixed viewBox, stretching the coordinate system (and its axis labels/strokes) with the container. The chart now tracks its real pixel width so it renders at 1:1, keeping text and strokes at their true size and the plot height constant.
- **Input group rounded its outer corners on the wrong side.** Projected `cwButton` / `cwInput` controls set their own `:host` border-radius at equal specificity, so seam rounding depended on stylesheet load order; the seam rules now take precedence deterministically.
- **Context menu closed on right-button release on macOS.** Replaced the CDK outside-pointer handling with a capture-phase `pointerdown` listener so the menu stays open until the next click outside it.
- **Knob value now tracks the pointer accurately** (removed a stray angle offset).

### Changed
- Showcase: replaced emoji glyphs with the shared line-icon set, sorted the theme switcher alphabetically (Frost default), and cleaned up copy.

## [1.1.0] - 2026-07-13
This release grows Cerious Widgets from "a grid + a few components" into a **complete, enterprise-grade component suite** (~85 standalone, signal-based, zoneless-safe components) with a universal plugin architecture and a verified WCAG 2.1 AA accessibility baseline.

### Added
- **Runtime theming engine + brand colors.** A new `provideCeriousTheme()` / `CwThemeService` API lets consumers set their own `primary`/`secondary` (plus `radius`/`font`) and choose from curated presets that vary **colour _and_ shape/elevation**, `light`, `frost`, `dark`, **`cerious`** (the Cerious DevTech brand), **`midnight`**, **`sandstone`**, **`emerald`**, **`grape`**, **`contrast`**, **`flat`** (no elevation, square corners) and **`soft`** (large radius, diffuse shadows). The engine derives the full brand palette (hover/active, AA-safe filled surfaces, focus ring, chips, `text-on-accent`) from a base mode's tuned neutrals, so re-branding never breaks contrast. Themes apply to `<html>` or a scoped element (regional theming), custom presets can be registered, and dependency-free color utilities (`toneScale`, `aaFill`, `contrast`, `readableOn`, …) are exported. The static Light/Frost/Dark stylesheet remains the zero-JS baseline.
- **Universal plugin system, every component is now extensible.** A one-call helper, `providePluginHost(namespace, api)`, makes any component a plugin host; a plugin implements `WidgetPlugin<TApi>` and is registered declaratively per component via `CeriousWidgetsModule.forRoot({ select: { plugins: [...] }, ... })`. New public API surfaces: `CwWidgetApi` (`getHost`), `CwFormControlApi<T>` (`getValue`/`setValue`/`isDisabled`), and bespoke contracts (`SelectApi`, `TabsApi`, `StepperApi`, `TreeApi`, …). The `PluginManagerService` is now component-agnostic and `WidgetsConfig` accepts a block for any component namespace.
- **Chart components**, `cw-area-chart`, `cw-donut-chart` and `cw-sparkline`: dependency-free, pure-SVG, interactive (`pointClick` / `segmentClick`) and accessible (`role="img"` with sensible default labels).
- **Calendar component**, `cw-calendar`, a month-view event calendar with full keyboard grid navigation, configurable week start, and `dateSelect` / `eventClick` / `monthChange` outputs.
- **Keyboard resizing for the Splitter** (arrow keys + Home/End) and the required `separator` ARIA value attributes.
- **AA-safe fill design tokens**, `--cw-success-fill`, `--cw-warn-fill`, `--cw-danger-fill`, `--cw-primary-fill`, `--cw-accent-fill` (for white-on-fill surfaces) and `--cw-accent-strong` (accent text on soft tints).
- **ScrollPanel** viewport is now keyboard-focusable with an `ariaLabel` input.

### Changed
- **Accessibility: the entire library is now axe-clean at WCAG 2.1 AA** across every component in Light, Frost and Dark. Filled brand/severity surfaces were darkened to meet 4.5:1 with white text (via the new `-fill` tokens) without changing their accent/text colours; muted and selected-item text contrast were nudged to pass on tinted surfaces.
- **Grid column resizer overhaul**, drag now uses pointer capture, so a column resizes no matter where the cursor moves (not just while it's over the handle); the body updates live during the drag; resizing no longer triggers a column sort; and the divider sits exactly on the column boundary instead of overlapping header text.
- **Grid sorting is now type-aware**, numeric/date/boolean comparison with locale collation for strings, and nulls always sorted last (both directions), in both the Table and the grid MultiSort plugin.
- **Depth/edge-case hardening** across Select, MultiSelect, DatePicker, Dialog, Table and Grid: fuller keyboard support (type-ahead, Home/End, roving focus), ARIA (`aria-activedescendant`, labelled dialogs), and empty/null-input safety.

### Fixed
- ContextMenu (`[cwContextMenu]`): the menu no longer closes the instant you release the right mouse button, the outside-click listener is armed after the opening click, so it opens on a normal right-click.
- Grid: the horizontal scrollbar now appears and tracks correctly under zoneless change detection (previously it needed a click), and dragging it scrolls the body; a crash when global-text-filtering rows with null cells is resolved.
- Frost theme: toasts now read as frosted glass matching the other overlays; pinned grid columns no longer show the scrolling columns bleeding through; and a whole-window resize flicker (caused by many simultaneous `backdrop-filter` layers) is gone.
- `FloatLabel` / `IftaLabel`: the label no longer overlaps a pre-filled value on load, and clears nested controls (e.g. inside `cw-input-mask`).
- `InputNumber` field width with steppers; additional popover placements (`*-start` / `*-end`) with edge-safe fallbacks.

### Notes
- Fully backward compatible, plugins are opt-in and existing usage is unchanged.
- The full component catalog is documented (live examples, API tables, theming) with a dedicated **Plugins** guide.
