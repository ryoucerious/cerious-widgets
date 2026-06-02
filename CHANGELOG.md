# Changelog

All notable changes to this project will be documented in this file.

## [1.0.10] - 2025-06-11
### Added
- Support for Angular **standalone components** — the grid can now be used without importing a shared module.
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
- New `enableVirtualScroll` grid option (defaults to `true`). Set to `false` to render all rows in a standard scrollable container — useful for small datasets, printing, or full-page exports.
- Mobile horizontal scrolling support: the touch controller now performs axis detection on touchstart and forwards horizontal-dominant gestures to the grid's native horizontal scroller while preserving vertical momentum.

### Changed
- `GridRowColumnComponent` refactored to use cached computed signals and a single consolidated `ngSwitch` block, reducing per-cell change-detection cost during fast vertical scrolling.
- Currency cell formatting now uses a memoized `Intl.NumberFormat` instance per locale/currency pair instead of constructing a new formatter per cell render.