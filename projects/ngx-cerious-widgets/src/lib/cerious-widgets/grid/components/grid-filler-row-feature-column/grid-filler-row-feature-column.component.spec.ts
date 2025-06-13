import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { GridFillerRowFeatureColumnComponent } from './grid-filler-row-feature-column.component';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';

describe('GridFillerRowFeatureColumnComponent', () => {
  let component: GridFillerRowFeatureColumnComponent;
  let fixture: ComponentFixture<GridFillerRowFeatureColumnComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;
  let mockGridColumnService: jasmine.SpyObj<IGridColumnService>;

  beforeEach(async () => {
    mockGridService = jasmine.createSpyObj('IGridService', ['getFeatureCount'], {
      gridOptions: {},
      fillerRowHeight: 50,
    });
    mockGridColumnService = jasmine.createSpyObj('IGridColumnService', ['getFeatureColumnWidth']);

    await TestBed.configureTestingModule({
      imports: [GridFillerRowFeatureColumnComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_COLUMN_SERVICE, useValue: mockGridColumnService },
        { provide: ElementRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GridFillerRowFeatureColumnComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return featureColumnWidth from gridColumnService', () => {
    mockGridService.getFeatureCount.and.returnValue(3);
    mockGridColumnService.getFeatureColumnWidth.and.returnValue('100');

    const width = component.featureColumnWidth;

    expect(mockGridService.getFeatureCount).toHaveBeenCalled();
    expect(mockGridColumnService.getFeatureColumnWidth).toHaveBeenCalledWith(3, mockGridService.gridOptions);
    expect(width).toEqual('100');
  });

  it('should return fillerRowHeight from gridService', () => {
    const height = component.fillerRowHeight;

    expect(height).toBe(50);
  });
});