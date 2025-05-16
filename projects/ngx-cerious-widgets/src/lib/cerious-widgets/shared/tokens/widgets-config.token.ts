import { InjectionToken } from "@angular/core";
import { WidgetsConfig } from "../interfaces/widgets-config.interface";

export const WIDGETS_CONFIG = new InjectionToken<WidgetsConfig>('WIDGETS_CONFIG');