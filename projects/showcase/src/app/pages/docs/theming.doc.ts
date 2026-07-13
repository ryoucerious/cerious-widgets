import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CodeBlockComponent, DocPageComponent, DocSectionComponent, DocTabComponent } from '../../ui';

/**
 * Guide page (not a component) for the theming system: design tokens, the
 * built-in presets, the runtime `provideCeriousTheme` / `CwThemeService` API,
 * custom brand colours, custom presets and regional theming.
 */
@Component({
  selector: 'app-theming-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPageComponent, DocTabComponent, DocSectionComponent, CodeBlockComponent],
  template: `
    <doc-page slug="theming"><doc-tab label="Overview">
      <doc-section
        title="Everything is a design token"
        description="Every visual is driven by ~75 --cw-* CSS custom properties in three layers (primitive → structural → semantic). Components only read semantic tokens, so re-skinning is a matter of setting variables — no recompiling. Cerious Light, Frost and Dark ship in the stylesheet and work with zero JavaScript.">
        <doc-code [code]="cssCode" />
      </doc-section>

      <doc-section
        title="Switch themes at runtime"
        description="Add the stylesheet once, then flip the theme with a single attribute — or use the runtime API (below) for custom colours and the extra presets.">
        <doc-code [code]="attrCode" />
      </doc-section>
    </doc-tab><doc-tab label="Presets & brand colours">
      <doc-section
        title="Pick a preset"
        description="Built-in presets vary color and shape/elevation: light, frost (glass), dark, cerious (the Cerious DevTech brand), midnight (OLED), sandstone (warm), emerald, grape, contrast, flat (no elevation, square) and soft (large radius, diffuse shadows). Apply one at bootstrap with provideCeriousTheme, or at runtime via CwThemeService.">
        <doc-code [code]="presetCode" />
      </doc-section>

      <doc-section
        title="Set your own brand colours"
        description="Pass primary / secondary (and optionally radius, font) on top of any preset. The engine derives the whole brand palette — hover/active states, AA-safe filled surfaces, focus ring, chips — while keeping the preset's tuned neutrals and contrast.">
        <doc-code [code]="brandCode" />
      </doc-section>

      <doc-section
        title="Change the theme live"
        description="Inject CwThemeService anywhere and call apply(). It rewrites the tokens on <html>, so the entire library (including body-attached overlays) updates instantly.">
        <doc-code [code]="runtimeCode" />
      </doc-section>
    </doc-tab><doc-tab label="Custom presets & scope">
      <doc-section
        title="Register a custom preset"
        description="A preset is just a base mode (light/dark/frost) + seeds + optional token overrides. Register it once, then apply it by name like any built-in.">
        <doc-code [code]="customPresetCode" />
      </doc-section>

      <doc-section
        title="Regional theming"
        description="Pass a scope element to theme only part of the app — the tokens are written on that element instead of <html>.">
        <doc-code [code]="scopeCode" />
      </doc-section>

      <doc-section
        title="Fallback: override tokens directly"
        description="You can always hand-override any token in your own CSS — the runtime API is a convenience, not a requirement.">
        <doc-code [code]="overrideCode" />
      </doc-section>
    </doc-tab></doc-page>
  `
})
export class ThemingDocComponent {
  cssCode = `/* angular.json */
"styles": [
  "node_modules/ngx-cerious-widgets/styles/grid-styles-generated.scss"
]`;

  attrCode = `<html data-cw-theme="frost">  <!-- 'light' | 'frost' | 'dark' -->`;

  presetCode = `// app.config.ts
import { provideCeriousTheme } from 'ngx-cerious-widgets';

export const appConfig = {
  providers: [provideCeriousTheme({ preset: 'emerald' })]
};`;

  brandCode = `provideCeriousTheme({
  preset: 'light',
  primary: '#e11d48',     // rose brand
  secondary: '#7c3aed',
  radius: '10px',
})`;

  runtimeCode = `import { CwThemeService } from 'ngx-cerious-widgets';

export class SettingsComponent {
  private theme = inject(CwThemeService);
  useDark()   { this.theme.apply({ preset: 'dark' }); }
  setBrand(c: string) { this.theme.apply({ primary: c }); }
  // this.theme.presets -> list for a picker; this.theme.theme() -> current
}`;

  customPresetCode = `const theme = inject(CwThemeService);
theme.registerPreset({
  name: 'ocean',
  label: 'Ocean',
  base: 'dark',
  dark: true,
  seeds: { primary: '#06b6d4', secondary: '#3b82f6' },
  tokens: { 'surface': '#07131f', 'page-bg': '#040b12' },
});
theme.apply({ preset: 'ocean' });`;

  scopeCode = `theme.apply({ preset: 'grape', scope: document.querySelector('#sidebar')! });`;

  overrideCode = `:root {
  --cw-primary: #2563eb;
  --cw-radius: 12px;
  --cw-surface: #ffffff;
}`;
}
