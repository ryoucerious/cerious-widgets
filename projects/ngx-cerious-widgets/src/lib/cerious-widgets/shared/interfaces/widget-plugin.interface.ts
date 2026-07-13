import { PluginConfig } from "./plugin-config.interface";

/**
 * Generic, component-agnostic contract for a widget plugin.
 *
 * This is the shared core of the plugin system used across every cerious-widgets
 * component. Each component exposes its own API surface (`TApi`) that plugins
 * interact with, while the lifecycle hooks defined here remain identical for all
 * components. Component-specific plugin interfaces (e.g. `GridPlugin`) extend this
 * with their own event handlers.
 *
 * @typeParam TApi - The component API surface passed to the plugin on init.
 */
export interface WidgetPlugin<TApi = unknown> {
    /**
     * Called when the host component is initialized.
     * @param api - The component API instance for interacting with the host.
     * @param config - Optional config data for the plugin.
     */
    onInit(api: TApi, config?: PluginConfig): void;

    /**
     * Optional hook called after the host component has been initialized.
     */
    afterInit?(): void;

    /**
     * Optional hook called when the plugin is destroyed.
     */
    onDestroy?(): void;
}
