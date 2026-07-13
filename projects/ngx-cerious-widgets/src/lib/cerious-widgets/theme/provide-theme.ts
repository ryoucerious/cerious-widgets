import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { CwThemeService } from './theme.service';
import { CwThemeConfig } from './theme.types';

/**
 * Applies an initial cerious-widgets theme at app bootstrap. Drop into the
 * `providers` array of `bootstrapApplication` (standalone) or a module.
 *
 * @example
 * bootstrapApplication(AppComponent, {
 *   providers: [provideCeriousTheme({ preset: 'emerald', primary: '#0ea5e9' })]
 * });
 */
export function provideCeriousTheme(config: CwThemeConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (theme: CwThemeService) => () => theme.apply(config),
      deps: [CwThemeService]
    }
  ]);
}
