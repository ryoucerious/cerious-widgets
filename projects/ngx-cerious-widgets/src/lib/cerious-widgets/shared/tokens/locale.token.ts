import { InjectionToken, Provider } from '@angular/core';

/**
 * App-wide default BCP-47 locale for cerious-widgets components that format
 * locale-sensitive values (numbers, currency, dates). Components read this as
 * their fallback and always let a per-instance `locale` input override it.
 *
 * An empty string (the default) means "use the runtime/browser default locale"
 * — i.e. `undefined` is passed to the `Intl` / `toLocaleString` APIs.
 *
 * Provide it once at the app root via {@link provideCeriousLocale}:
 *
 * @example
 * bootstrapApplication(AppComponent, {
 *   providers: [provideCeriousLocale('de-DE')]
 * });
 */
export const CW_LOCALE = new InjectionToken<string>('CW_LOCALE', {
  providedIn: 'root',
  factory: () => ''
});

/**
 * Convenience provider for the app-wide cerious-widgets {@link CW_LOCALE}.
 *
 * @param locale a BCP-47 locale tag (e.g. `'de-DE'`, `'ja-JP'`), or `''` to use
 *   the runtime default.
 */
export function provideCeriousLocale(locale: string): Provider {
  return { provide: CW_LOCALE, useValue: locale };
}
