import { Observable } from "rxjs";
import { GridDataResponse } from "./grid-data-response";
import { GridDataRequest } from "./grid-data-request";

/**
 * Interface representing a data source for a grid component.
 * Provides a method to fetch data based on a grid data request.
 */
export interface GridDataSource {
  getData(request: GridDataRequest): Observable<GridDataResponse>;
}