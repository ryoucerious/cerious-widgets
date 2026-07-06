/*
 * Public API Surface of ngx-cerious-widgets
 */

// === Module ===
export * from './lib/cerious-widgets/cerious-widgets.module';

// === Core / shared (the contract every cerious-widgets component is built on) ===
// Config: forRoot input shape + per-component config resolver.
export * from './lib/cerious-widgets/shared/tokens/widgets-config.token';
export * from './lib/cerious-widgets/shared/tokens/locale.token';
export * from './lib/cerious-widgets/shared/interfaces/index';
// Plugin system: generic plugin contract + the manager that wires plugins to a host API.
// Templating: register named templates with `[cwTemplate]` and read them via the registry.
export * from './lib/cerious-widgets/shared/directives/template-registrar.directive';
export * from './lib/cerious-widgets/shared/services/index';
// Zoneless: base class new components extend for zoneless-safe change detection.
export * from './lib/cerious-widgets/components/base/zoneless-compatible.component';

// === Components (Tier-0 presentational primitives) ===
export * from './lib/cerious-widgets/components/index';

// === Grid component ===
export * from './lib/cerious-widgets/grid/components/grid.component';
export * from './lib/cerious-widgets/grid/enums/index';
export * from './lib/cerious-widgets/grid/interfaces/index';
export * from './lib/cerious-widgets/grid/plugins/index';
export * from './lib/cerious-widgets/grid/models/index';
