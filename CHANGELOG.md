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