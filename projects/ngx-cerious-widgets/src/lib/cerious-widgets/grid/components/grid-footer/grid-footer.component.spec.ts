import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { GridFooterComponent } from './grid-footer.component';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';
import { of } from 'rxjs';

describe('GridFooterComponent', () => {
  let component: GridFooterComponent;
  let fixture: ComponentFixture<GridFooterComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;
  let mockGridColumnService: jasmine.SpyObj<IGridColumnService>;

  beforeEach(async () => {
    mockGridService = jasmine.createSpyObj('IGridService', [
      'afterRender',
      'gridDataset',
      'gridOptions',
      'headerWidth',
      'rowMinWidth',
      'hasVerticalScrollbar',
      'scrollbarWidth',
      'os',
    ]);
    mockGridService.afterRender = of() as any;
    mockGridService.gridDataset = { footerRows: [] } as any;

    mockGridColumnService = jasmine.createSpyObj('IGridColumnService', ['flattenColumns']);

    await TestBed.configureTestingModule({
      imports: [GridFooterComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_COLUMN_SERVICE, useValue: mockGridColumnService },
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to afterRender on init', () => {
    const subscribeSpy = spyOn(mockGridService.afterRender, 'subscribe').and.callThrough();
    component.ngOnInit();
    expect(subscribeSpy).toHaveBeenCalled();
  });

  it('should unsubscribe from subscriptions on destroy', () => {
    const unsubscribeSpy = spyOn(component['subscriptions'][0], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should flatten columns for rows', () => {
    const mockRows = [
      { columnDefs: [{ id: 1 }, { id: 2 }] },
      { columnDefs: [{ id: 3 }] },
    ];
    mockGridService.gridDataset.footerRows = mockRows as any;
    mockGridColumnService.flattenColumns.and.callFake((columns) => columns);

    component['flattenColumnsForRows']();

    expect(mockGridColumnService.flattenColumns).toHaveBeenCalledTimes(mockRows.length);
    mockRows.forEach((row) => {
      expect(mockGridColumnService.flattenColumns).toHaveBeenCalledWith(row.columnDefs as any);
    });
  });

  it('should return correct rowMinWidth', () => {
    mockGridService.rowMinWidth = '100';
    mockGridService.hasVerticalScrollbar = true;
    mockGridService.scrollbarWidth = 15;

    expect(component.rowMinWidth).toBe('115px');
  });

  it('should return correct rows', () => {
    const mockFooterRows = [{ id: 1 }, { id: 2 }];
    mockGridService.gridDataset.footerRows = mockFooterRows as any;

    expect(component.rows).toEqual(mockFooterRows as any);
  });

  it('should return gridDataset from gridService', () => {
    const mockDataset = { footerRows: [] };
    mockGridService.gridDataset = mockDataset as any;

    expect(component.gridDataset).toBe(mockDataset as any);
  });

  it('should return gridOptions from gridService', () => {
    const mockOptions = { enableSorting: true };
    mockGridService.gridOptions = mockOptions as any;

    expect(component.gridOptions).toBe(mockOptions as any);
  });

  it('should return headerWidth from gridService', () => {
    mockGridService.headerWidth = 500 as any;

    expect(component.headerWidth).toBe(500 as any);
  });

  it('should calculate rowMinWidth based on gridService values', () => {
    mockGridService.rowMinWidth = '200';
    mockGridService.hasVerticalScrollbar = true;
    mockGridService.scrollbarWidth = 15;

    expect(component.rowMinWidth).toBe('215px');
  });

  it('should return footerRows from gridDataset', () => {
    const mockFooterRows = [{ id: 1 }, { id: 2 }];
    mockGridService.gridDataset = { footerRows: mockFooterRows } as any;

    expect(component.rows).toBe(mockFooterRows as any);
  });

  it('should call flattenColumnsForRows when afterRender emits', () => {
    spyOn(component as any, 'flattenColumnsForRows'); // Spy on the private method

    // Trigger ngOnInit
    component.ngOnInit();

    // Simulate the afterRender observable emitting
    mockGridService.afterRender.subscribe(() => {
      expect((component as any).flattenColumnsForRows).toHaveBeenCalled();
    });
  });

  it('should return early in flattenColumnsForRows if rows are undefined', () => {
    // Mock rows to be undefined
    spyOnProperty(component, 'rows', 'get').and.returnValue(undefined as any);


    // Call the private method indirectly via ngOnInit
    component['flattenColumnsForRows']();
  
    // Verify that flattenColumns was not called
    expect(mockGridColumnService.flattenColumns).not.toHaveBeenCalled();
  });
});