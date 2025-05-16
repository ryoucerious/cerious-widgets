import { Inject, Injectable } from "@angular/core";
import { tap } from "rxjs";
import { GridApi } from "../interfaces/grid-api";
import { GridDataSource } from "../interfaces/grid-data-source";
import { GridPlugin } from "../interfaces/grid-plugin";

@Injectable()
export class ServerSidePlugin implements GridPlugin {
  constructor(
    @Inject('GridDataSource') private dataSource: GridDataSource
  ) { }

  onInit(api: GridApi): void {
    api.requestData = (request) => {
      return this.dataSource.getData(request).pipe(
        tap(response => {
          api.setData(response.data, response.totalCount);
        })
      );
    };
  }
}
