import { GridDataRequest, GridDataResponse, GridDataSource } from 'ngx-cerious-widgets';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_DATA } from './mock-data';

export class MockServerDataSource implements GridDataSource {
  getData(request: GridDataRequest): Observable<GridDataResponse> {
    let data = [...MOCK_DATA];

    // Apply filters
    if (request.filterState && Object.keys(request.filterState).length > 0) {
      data = data.filter(row => {
        // Check if the row matches at least one filter
        return Object.keys(request.filterState).some(field => {
          const filter = request.filterState[field];
          if (filter?.value) {
            const cellValue = (row as Record<string, any>)[field]?.toString().toLowerCase();
            const filterValue = filter.value.toString().toLowerCase();

            // Apply filter logic based on the filter type
            switch (filter.type) {
              case 'contains':
                return cellValue.includes(filterValue);
              case 'equals':
                return cellValue === filterValue;
              case 'startsWith':
                return cellValue.startsWith(filterValue);
              case 'endsWith':
                return cellValue.endsWith(filterValue);
              default:
                return false; // Skip filtering if the filter type is unknown
            }
          }
          return false; // Skip if no filter value is provided
        });
      });
    }

    // Apply sort
    request.sortState?.forEach(sort => {
      data = data.sort((a, b) => {
        const valA = sort.column.field ? a[sort.column.field as keyof typeof a] : undefined;
        const valB = sort.column.field ? b[sort.column.field as keyof typeof b] : undefined;
        return sort.direction === 'asc'
          ? (valA ?? '') > (valB ?? '') ? 1 : -1
          : (valA ?? '') < (valB ?? '') ? 1 : -1;
      });
    });

    // Paging
    const paged = data.slice(request.startRow, request.endRow);

    return of({
      data: paged,
      totalCount: data.length
    }).pipe(delay(200)); // Simulate network delay
  }
}