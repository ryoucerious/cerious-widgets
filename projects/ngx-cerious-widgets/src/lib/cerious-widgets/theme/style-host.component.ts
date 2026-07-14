import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/**
 * Invisible host that carries the library's structural stylesheet (design
 * tokens, CDK-overlay theming, virtual-scrollbar styling, form-control classes
 * applied by directives like `cwInput`, and the grid chrome). Because it uses
 * {@link ViewEncapsulation.None}, instantiating it once injects those styles
 * globally, so consumers no longer have to add
 * `grid-styles-generated.scss` to their app's `styles` array.
 *
 * It is created programmatically by {@link CwThemeService.ensureGlobalStyles}
 * (driven by `provideCeriousTheme()` / `CeriousWidgetsModule.forRoot()`), never
 * placed in a template. The runtime theming engine layers `--cw-*` overrides on
 * top of the token defaults this sheet provides.
 */
@Component({
  selector: 'cw-style-host',
  standalone: true,
  template: '',
  styleUrls: ['../grid/styles/grid-styles-generated.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', 'style': 'display:none' }
})
export class CwStyleHostComponent {}
