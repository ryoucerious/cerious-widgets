import { TemplateRef, Type } from "@angular/core";
import { GridPlugin } from "../../grid/interfaces/grid-plugin";
import { PluginOptions } from "../../grid/interfaces";

export interface WidgetsConfig {
    plugins?: Type<GridPlugin>[];
    lazyPlugins?:  { [key: string]: () => Promise<any> };
    templates?: {
        exportButton?: TemplateRef<any>;
    },
    pluginOptions?: PluginOptions;
}