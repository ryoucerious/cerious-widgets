import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { GridFooterRowComponent } from './grid-footer-row.component';
import { GridFooterColumnComponent } from '../grid-footer-column/grid-footer-column.component';
import { GridFooterFeatureColumnComponent } from '../grid-footer-feature-column/grid-footer-feature-column.component';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';
import { ColumnDef } from '../../interfaces/column-def';

describe('GridFooterRowComponent', () => {
  let component: GridFooterRowComponent;
  let fixture: ComponentFixture<GridFooterRowComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;
  let mockGridColumnService: jasmine.SpyObj<IGridColumnService>;

  beforeEach(async () => {
    mockGridService = jasmine.createSpyObj('IGridService', [
      'getFeatureCount',
      'gridOptions',
      'hasHorizontalScrollbar',
      'hasVerticalScrollbar',
      'pinnedColumns',
    ]);
    mockGridColumnService = jasmine.createSpyObj('IGridColumnService', ['getFeatureColumnWidth', 'getColumnWidth']);

    await TestBed.configureTestingModule({
      declarations: [GridFooterRowComponent, GridFooterColumnComponent, GridFooterFeatureColumnComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_COLUMN_SERVICE, useValue: mockGridColumnService },
        { provide: ElementRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GridFooterRowComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return feature column width', () => {
    mockGridService.getFeatureCount.and.returnValue(2);
    mockGridService.gridOptions = {} as any;
    mockGridColumnService.getFeatureColumnWidth.and.returnValue('100px');

    expect(component.featureColumnWidth).toBe('100px');
    expect(mockGridColumnService.getFeatureColumnWidth).toHaveBeenCalledWith(2, {} as any);
  });

  it('should return hasHorizontalScrollbar', () => {
    mockGridService.hasHorizontalScrollbar = true;
    expect(component.hasHorizontalScrollbar).toBeTrue();
  });

  it('should return hasRowFeatures', () => {
    mockGridService.getFeatureCount.and.returnValue(1);
    expect(component.hasRowFeatures).toBeTrue();

    mockGridService.getFeatureCount.and.returnValue(0);
    expect(component.hasRowFeatures).toBeFalse();
  });

  it('should return hasVerticalScrollbar', () => {
    mockGridService.hasVerticalScrollbar = false;
    expect(component.hasVerticalScrollbar).toBeFalse();
  });

  it('should return pinnedColumns', () => {
    mockGridService.pinnedColumns = ['col1', 'col2'] as any;
    expect(component.pinnedColumns).toEqual(['col1', 'col2'] as any); ;
  });

  it('should return column width', () => {
    const columnDef: ColumnDef = { field: 'test', width: 100 } as any;
    mockGridService.gridOptions = {} as any;
    mockGridColumnService.getColumnWidth.and.returnValue('100px');

    expect(component.getColumnWidth(columnDef)).toBe('100px');
    expect(mockGridColumnService.getColumnWidth).toHaveBeenCalledWith(columnDef, {} as any);
  });
});