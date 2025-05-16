import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { GridFillerRowComponent } from './grid-filler-row.component';
import { GridFillerRowColumnComponent } from '../grid-filler-row-column/grid-filler-row-column.component';
import { GridFillerRowFeatureColumnComponent } from '../grid-filler-row-feature-column/grid-filler-row-feature-column.component';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { IGridColumnService, IGridService } from '../../interfaces';

describe('GridFillerRowComponent', () => {
  let component: GridFillerRowComponent;
  let fixture: ComponentFixture<GridFillerRowComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;
  let mockGridColumnService: jasmine.SpyObj<IGridColumnService>;

  beforeEach(async () => {
    mockGridService = jasmine.createSpyObj('IGridService', [
      'getFeatureCount',
      'hasHorizontalScrollbar',
      'hasVerticalScrollbar',
      'gridDataset',
      'pinnedColumns',
      'gridOptions'
    ]);
    mockGridColumnService = jasmine.createSpyObj('IGridColumnService', [
      'getFeatureColumnWidth',
      'getColumnWidth'
    ]);

    await TestBed.configureTestingModule({
      declarations: [
        GridFillerRowComponent,
        GridFillerRowColumnComponent,
        GridFillerRowFeatureColumnComponent
      ],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_COLUMN_SERVICE, useValue: mockGridColumnService },
        { provide: ElementRef, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GridFillerRowComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate featureColumnWidth correctly', () => {
    mockGridService.getFeatureCount.and.returnValue(2);
    mockGridService.gridOptions = { someOption: true } as any;
    mockGridColumnService.getFeatureColumnWidth.and.returnValue('100px');

    expect(component.featureColumnWidth).toBe('100px');
    expect(mockGridColumnService.getFeatureColumnWidth).toHaveBeenCalledWith(2, { someOption: true } as any);
  });

  it('should return hasHorizontalScrollbar correctly', () => {
    mockGridService.hasHorizontalScrollbar = true;
    expect(component.hasHorizontalScrollbar).toBeTrue();
  });

  it('should return hasRowFeatures correctly', () => {
    mockGridService.getFeatureCount.and.returnValue(1);
    expect(component.hasRowFeatures).toBeTrue();

    mockGridService.getFeatureCount.and.returnValue(0);
    expect(component.hasRowFeatures).toBeFalse();
  });

  it('should return hasVerticalScrollbar correctly', () => {
    mockGridService.hasVerticalScrollbar = false;
    expect(component.hasVerticalScrollbar).toBeFalse();
  });

  it('should return gridDataset correctly', () => {
    mockGridService.gridDataset = [{ id: 1 }] as any;
    expect(component.gridDataset).toEqual([{ id: 1 }] as any);
  });

  it('should return pinnedColumns correctly', () => {
    mockGridService.pinnedColumns = ['column1'] as any;
    expect(component.pinnedColumns).toEqual(['column1'] as any);
  });

  it('should return gridOptions correctly', () => {
    mockGridService.gridOptions = { option: true } as any;
    expect(component.gridOptions).toEqual({ option: true } as any);
  });

  it('should calculate column width correctly', () => {
    const column = { id: 'col1' } as any;
    mockGridService.gridOptions = { someOption: true } as any;
    mockGridColumnService.getColumnWidth.and.returnValue('50px');

    expect(component.getColumnWidth(column)).toBe('50px');
    expect(mockGridColumnService.getColumnWidth).toHaveBeenCalledWith(column, { someOption: true } as any);
  });
});
