/**
 * Represents a generic configuration object for plugins.
 * 
 * This interface allows for any number of configuration properties,
 * where each property key is a string and the value can be of any type.
 *
 * @example
 * const config: PluginConfig = {
 *   apiKey: '12345',
 *   enabled: true,
 *   options: { retries: 3 }
 * };
 */
export interface PluginConfig {
  [configName: string]: any;
}
