import { InjectionToken } from "@angular/core";
import { IGridColumnService } from "../interfaces/service-interfaces/grid-column.interface";

export const GRID_COLUMN_SERVICE = new InjectionToken<IGridColumnService>('GRID_COLUMN_SERVICE');