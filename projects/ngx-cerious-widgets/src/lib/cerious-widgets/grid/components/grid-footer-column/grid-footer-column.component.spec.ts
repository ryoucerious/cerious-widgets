import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { GridFooterColumnComponent } from './grid-footer-column.component';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';
import { ColumnDef } from '../../interfaces/column-def';

describe('GridFooterColumnComponent', () => {
  let component: GridFooterColumnComponent;
  let fixture: ComponentFixture<GridFooterColumnComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;
  let mockGridColumnService: jasmine.SpyObj<IGridColumnService>;

  beforeEach(async () => {
    mockGridService = jasmine.createSpyObj('IGridService', ['templates'], { gridOptions: {} });
    mockGridColumnService = jasmine.createSpyObj('IGridColumnService', ['getColumnWidth']);

    await TestBed.configureTestingModule({
      declarations: [GridFooterColumnComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_COLUMN_SERVICE, useValue: mockGridColumnService },
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GridFooterColumnComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve templates from gridService', () => {
    const templates = ['template1', 'template2'];
    mockGridService.templates = templates as any;

    expect(component.templates).toEqual(templates as any);
  });

  it('should call getColumnWidth on gridColumnService with correct arguments in getWidth', () => {
    const columnDef: ColumnDef = { field: 'testField' } as ColumnDef;
    const mockWidth = '100px';
    component.column = columnDef;
    mockGridColumnService.getColumnWidth.and.returnValue(mockWidth);

    const width = component.getWidth();

    expect(mockGridColumnService.getColumnWidth).toHaveBeenCalledWith(columnDef, mockGridService.gridOptions);
    expect(width).toBe(mockWidth);
  });
});