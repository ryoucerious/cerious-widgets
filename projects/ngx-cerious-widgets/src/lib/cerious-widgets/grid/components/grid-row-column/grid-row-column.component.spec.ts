import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { GridRowColumnComponent } from './grid-row-column.component';
import { ColumnDef } from '../../interfaces/column-def';
import { GridRow } from '../../models/grid-row';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';
import { ColumnFormat, ColumnType } from '../../enums';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';

describe('GridRowColumnComponent', () => {
  let component: GridRowColumnComponent;
  let fixture: ComponentFixture<GridRowColumnComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;
  let mockGridColumnService: jasmine.SpyObj<IGridColumnService>;

  beforeEach(() => {
    mockGridService = jasmine.createSpyObj('IGridService', ['templates', 'gridOptions']);
    mockGridColumnService = jasmine.createSpyObj('IGridColumnService', ['getColumnWidth']);

    TestBed.configureTestingModule({
      imports: [GridRowColumnComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_COLUMN_SERVICE, useValue: mockGridColumnService },
        { provide: ElementRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GridRowColumnComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose ColumnType and ColumnFormat enums', () => {
    expect(component.ColumnType).toEqual(ColumnType);
    expect(component.ColumnFormat).toEqual(ColumnFormat);
  });

  it('should return templates from gridService', () => {
    mockGridService.templates = ['template1', 'template2'] as any;
    expect(component.templates).toEqual(['template1', 'template2'] as any);
  });

  it('should track dropdown items by id or index', () => {
    const itemWithId = { id: 1 };
    const itemWithoutId = {};
    expect(component.dropdownTrackBy(0, itemWithId)).toBe(1);
    expect(component.dropdownTrackBy(1, itemWithoutId)).toBe(1);
  });

  it('should determine alignment based on column type and format', () => {
    component.column = { type: ColumnType.Number, format: 'currency', alignment: undefined } as ColumnDef;
    expect(component.getAlignment()).toBe('right');

    component.column = { type: ColumnType.String, format: undefined, alignment: 'center' } as ColumnDef;
    expect(component.getAlignment()).toBe('center');

    component.column = { type: ColumnType.String, format: undefined, alignment: undefined } as ColumnDef;
    expect(component.getAlignment()).toBe('left');
  });

  it('should retrieve column width from gridColumnService', () => {
    component.column = {} as ColumnDef;
    mockGridService.gridOptions = {} as any;
    mockGridColumnService.getColumnWidth.and.returnValue('100px');
    expect(component.getWidth()).toBe('100px');
    expect(mockGridColumnService.getColumnWidth).toHaveBeenCalledWith(component.column, mockGridService.gridOptions);
  });

  it('should format values based on column format', () => {
    spyOn(component, 'getValue').and.returnValue(1234.56);

    component.column = { format: ColumnFormat.Currency } as ColumnDef;
    expect(component.getFormattedValue()).toBe('$1,234.56');

    component.column = { format: ColumnFormat.Percentage } as ColumnDef;
    expect(component.getFormattedValue()).toBe('1234.56%');

    component.column = { format: ColumnFormat.Stars } as ColumnDef;
    expect(component.getFormattedValue()).toBe(1235);

    component.column = { format: ColumnFormat.Date } as ColumnDef;
    expect(component.getFormattedValue()).toBe(new Date(1234.56).toLocaleDateString());

    component.column = { format: ColumnFormat.DateTime } as ColumnDef;
    expect(component.getFormattedValue()).toBe(new Date(1234.56).toLocaleString());

    component.column = { format: ColumnFormat.Time } as ColumnDef;
    expect(component.getFormattedValue()).toBe(new Date(1234.56).toLocaleTimeString());

    component.column = { format: undefined } as ColumnDef;
    expect(component.getFormattedValue()).toBe(1234.56);
  });

  it('should generate stars array based on value', () => {
    expect(component.getStars(3.7)).toEqual([0, 0, 0, 0]);
    expect(component.getStars(2.3)).toEqual([0, 0]);
  });

  it('should retrieve value from gridRow based on column field', () => {
    component.column = { field: 'name' } as ColumnDef;
    component.gridRow = { row: { name: 'Test' } } as GridRow;
    expect(component.getValue()).toBe('Test');

    component.column = { field: undefined } as ColumnDef;
    expect(component.getValue()).toBeNull();
  });

  it('should update gridRow value on value change', () => {
    component.column = { field: 'name' } as ColumnDef;
    component.gridRow = { row: { name: 'Old Value' } } as GridRow;

    const event = { target: { value: 'New Value' } };
    component.onValueChange(event);

    expect(component.gridRow.row.name).toBe('New Value');
  });
});