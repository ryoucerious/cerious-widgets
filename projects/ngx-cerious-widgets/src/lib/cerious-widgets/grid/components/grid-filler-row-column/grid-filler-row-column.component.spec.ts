import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef, TemplateRef } from '@angular/core';
import { GridFillerRowColumnComponent } from './grid-filler-row-column.component';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';
import { ColumnDef } from '../../interfaces/column-def';

describe('GridFillerRowColumnComponent', () => {
  let component: GridFillerRowColumnComponent;
  let fixture: ComponentFixture<GridFillerRowColumnComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;
  let mockGridColumnService: jasmine.SpyObj<IGridColumnService>;

  beforeEach(async () => {
    mockGridService = jasmine.createSpyObj('IGridService', ['fillerRowHeight', 'templates', 'gridOptions']);
    mockGridColumnService = jasmine.createSpyObj('IGridColumnService', ['getColumnWidth']);

    await TestBed.configureTestingModule({
      declarations: [GridFillerRowColumnComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_COLUMN_SERVICE, useValue: mockGridColumnService },
        { provide: ElementRef, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GridFillerRowColumnComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return fillerRowHeight from gridService', () => {
    mockGridService.fillerRowHeight = 100;
    expect(component.fillerRowHeight).toBe(100);
  });

  it('should return templates from gridService', () => {
    const mockTemplateRef = {} as jasmine.SpyObj<TemplateRef<any>>;
    const templates = { template1: mockTemplateRef };
    mockGridService.templates = templates;
    expect(component.templates).toBe(templates);
  });

  it('should call getColumnWidth on gridColumnService with correct arguments', () => {
    const column: ColumnDef = { id: 'col1', label: 'Column 1' };
    const gridOptions = { option1: true, columnDefs: [] };
    mockGridService.gridOptions = gridOptions;
    component.column = column;

    mockGridColumnService.getColumnWidth.and.returnValue('100px');
    const width = component.getWidth();

    expect(mockGridColumnService.getColumnWidth).toHaveBeenCalledWith(column, gridOptions);
    expect(width).toBe('100px');
  });
});