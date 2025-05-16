/**
 * Represents a collection of plugin options where each plugin is identified
 * by its name as a string key, and the associated value can be of any type.
 *
 * @remarks
 * This interface is designed to provide flexibility for defining options
 * for various plugins in a grid system. The exact structure of the value
 * depends on the specific plugin's requirements.
 *
 * @example
 * const options: PluginOptions = {
 *   pluginA: { enabled: true, config: { key: 'value' } },
 *   pluginB: [1, 2, 3],
 *   pluginC: 'customValue'
 * };
 */
export interface PluginOptions {
  [pluginName: string]: any;
}