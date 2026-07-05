import { TemplateRef, Type } from "@angular/core";
import { GridPlugin } from "../../grid/interfaces/grid-plugin";
import { PluginOptions } from "../../grid/interfaces";
import { WidgetPlugin } from "./widget-plugin.interface";
import { MultiSelectPlugin } from "../../components/multi-select/multi-select.api";
import { DatePickerPlugin } from "../../components/date-picker/date-picker.api";

/**
 * Per-component configuration block. Each cerious-widgets component reads its
 * own block from {@link WidgetsConfig} (e.g. `grid`), keeping plugin, option,
 * and template wiring isolated between components.
 *
 * @typeParam TPlugin - The plugin contract the component accepts.
 */
export interface ComponentConfig<TPlugin = WidgetPlugin> {
    /** Plugin classes to instantiate via DI and initialize for the component. */
    plugins?: Type<TPlugin>[];
    /** Lazy plugin loaders keyed by string, dynamically imported on demand. */
    lazyPlugins?: { [key: string]: () => Promise<any> };
    /** Options forwarded to plugins, keyed by plugin name. */
    pluginOptions?: PluginOptions;
    /** Named templates registered for the component. */
    templates?: { [name: string]: TemplateRef<any> };
}

/**
 * Root configuration passed to `CeriousWidgetsModule.forRoot`.
 *
 * Configuration is organised per component (e.g. `grid`). The top-level
 * `plugins` / `lazyPlugins` / `pluginOptions` / `templates` keys are retained as
 * deprecated aliases for the grid block so existing `forRoot` callers keep
 * working; new code should use the `grid` block instead.
 */
export interface WidgetsConfig {
    /** Grid component configuration. */
    grid?: ComponentConfig<GridPlugin>;

    /** MultiSelect component configuration. */
    multiSelect?: ComponentConfig<MultiSelectPlugin>;

    /** DatePicker component configuration. */
    datePicker?: ComponentConfig<DatePickerPlugin>;

    /** @deprecated Use `grid.plugins`. */
    plugins?: Type<GridPlugin>[];
    /** @deprecated Use `grid.lazyPlugins`. */
    lazyPlugins?: { [key: string]: () => Promise<any> };
    /** @deprecated Use `grid.templates`. */
    templates?: {
        exportButton?: TemplateRef<any>;
        [name: string]: TemplateRef<any> | undefined;
    };
    /** @deprecated Use `grid.pluginOptions`. */
    pluginOptions?: PluginOptions;
}

/**
 * Resolves the effective configuration for the grid by merging the deprecated
 * top-level keys with the `grid` block. The `grid` block takes precedence;
 * lazy plugin loaders from both are combined.
 *
 * @param config - The root widgets configuration, if provided.
 * @returns The merged grid component configuration.
 */
/**
 * Resolves the MultiSelect's configuration block. No deprecated aliases —
 * the per-component block is the only source.
 */
export function resolveMultiSelectConfig(config?: WidgetsConfig): ComponentConfig<MultiSelectPlugin> {
    return config?.multiSelect ?? {};
}

/**
 * Resolves the DatePicker's configuration block. No deprecated aliases —
 * the per-component block is the only source.
 */
export function resolveDatePickerConfig(config?: WidgetsConfig): ComponentConfig<DatePickerPlugin> {
    return config?.datePicker ?? {};
}

export function resolveGridConfig(config?: WidgetsConfig): ComponentConfig<GridPlugin> {
    const grid = config?.grid ?? {};
    return {
        plugins: grid.plugins ?? config?.plugins,
        lazyPlugins: { ...(config?.lazyPlugins ?? {}), ...(grid.lazyPlugins ?? {}) },
        pluginOptions: grid.pluginOptions ?? config?.pluginOptions,
        templates: grid.templates ?? (config?.templates as { [name: string]: TemplateRef<any> } | undefined)
    };
}
