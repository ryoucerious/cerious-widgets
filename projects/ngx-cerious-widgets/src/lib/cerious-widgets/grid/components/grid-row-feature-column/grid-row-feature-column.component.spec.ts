import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { GridRowFeatureColumnComponent } from './grid-row-feature-column.component';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';
import { GridRow } from '../../models/grid-row';
import { GridOptions } from '../../interfaces/grid-options';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';

describe('GridRowFeatureColumnComponent', () => {
  let component: GridRowFeatureColumnComponent;
  let fixture: ComponentFixture<GridRowFeatureColumnComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;
  let mockGridColumnService: jasmine.SpyObj<IGridColumnService>;

  beforeEach(() => {
    const rowSelectSubject = new Subject<GridRow>();
  
    mockGridService = jasmine.createSpyObj('IGridService', ['getFeatureCount'], {
      gridOptions: { enableMultiselect: true, enableSingleselect: false } as GridOptions,
      gridDataset: { dataset: [{ selected: false }, { selected: false }] },
      templates: {},
      rowSelect: rowSelectSubject, // Use a Subject here
    });
  
    // Spy on the `next` method of the `rowSelect` subject
    spyOn(mockGridService.rowSelect, 'next');
  
    mockGridColumnService = jasmine.createSpyObj('IGridColumnService', ['getFeatureColumnWidth', 'getFeatureWidth']);
  
    TestBed.configureTestingModule({
      imports: [GridRowFeatureColumnComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_COLUMN_SERVICE, useValue: mockGridColumnService },
        { provide: ElementRef, useValue: {} },
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(GridRowFeatureColumnComponent);
    component = fixture.componentInstance;
    component.gridRow = { selected: false, nestedExpanded: false } as GridRow;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return featureColumnWidth from gridColumnService', () => {
    mockGridColumnService.getFeatureColumnWidth.and.returnValue('100px');
    mockGridService.getFeatureCount.and.returnValue(2);

    expect(component.featureColumnWidth).toBe('100px');
    expect(mockGridColumnService.getFeatureColumnWidth).toHaveBeenCalledWith(2, mockGridService.gridOptions);
  });

  it('should return featureWidth from gridColumnService', () => {
    mockGridColumnService.getFeatureWidth.and.returnValue(200);

    expect(component.featureWidth).toBe('200px');
    expect(mockGridColumnService.getFeatureWidth).toHaveBeenCalledWith(mockGridService.gridOptions);
  });

  it('should return gridOptions from gridService', () => {
    expect(component.gridOptions).toBe(mockGridService.gridOptions);
  });

  it('should return templates from gridService', () => {
    expect(component.templates).toBe(mockGridService.templates);
  });

  it('should toggle row selection in multi-select mode', () => {
    component.selectRow();
    expect(component.gridRow.selected).toBeTrue();
    expect(mockGridService.rowSelect.next).toHaveBeenCalledWith(component.gridRow);
  });

  it('should toggle row selection in single-select mode', () => {
    mockGridService.gridOptions.enableMultiselect = false;
    mockGridService.gridOptions.enableSingleselect = true;

    component.selectRow();
    expect(mockGridService.gridDataset.dataset.every(row => !row.selected)).toBeTrue();
    expect(component.gridRow.selected).toBeTrue();
    expect(mockGridService.rowSelect.next).toHaveBeenCalledWith(component.gridRow);
  });

  it('should toggle nestedExpanded and emit toggleNestedRow event', fakeAsync(() => {
    spyOn(component.toggleNestedRow, 'emit');

    component.toggleNestedRowValue(component.gridRow);

    tick();
    tick();
    expect(component.gridRow.nestedExpanded).toBeTrue();
    expect(component.toggleNestedRow.emit).toHaveBeenCalledWith(component.gridRow);
  }));
});
