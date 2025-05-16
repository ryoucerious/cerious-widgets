import { InjectionToken } from "@angular/core";
import { GridPlugin } from "../interfaces/grid-plugin";

export const GRID_PLUGINS = new InjectionToken<GridPlugin>('GRID_PLUGINS');