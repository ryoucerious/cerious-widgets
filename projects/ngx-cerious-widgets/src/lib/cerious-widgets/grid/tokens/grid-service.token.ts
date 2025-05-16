import { InjectionToken } from "@angular/core";
import { IGridService } from "../interfaces/service-interfaces/grid.interface";

export const GRID_SERVICE = new InjectionToken<IGridService>('GRID_SERVICE');