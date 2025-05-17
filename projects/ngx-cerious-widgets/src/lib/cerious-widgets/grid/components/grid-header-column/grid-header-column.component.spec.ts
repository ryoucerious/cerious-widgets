import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridHeaderColumnComponent } from './grid-header-column.component';
import { ElementRef, TemplateRef } from '@angular/core';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { IGridColumnService } from '../../interfaces/service-interfaces/grid-column.interface';
import { ColumnDef } from '../../interfaces/column-def';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';

describe('GridHeaderColumnComponent', () => {
  let component: GridHeaderColumnComponent;
  let fixture: ComponentFixture<GridHeaderColumnComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;
  let mockGridColumnService: jasmine.SpyObj<IGridColumnService>;

  beforeEach(() => {
    mockGridService = jasmine.createSpyObj('IGridService', ['templates'], { gridOptions: {} });
    mockGridColumnService = jasmine.createSpyObj('IGridColumnService', ['getColumnWidth']);

    TestBed.configureTestingModule({
      declarations: [GridHeaderColumnComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_COLUMN_SERVICE, useValue: mockGridColumnService },
        { provide: ElementRef, useValue: new ElementRef(null) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GridHeaderColumnComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getWidth', () => {
    it('should return "100%" if cellTemplate is defined', () => {
      component.cellTemplate = {} as TemplateRef<any>;
      const width = component.getWidth();
      expect(width).toBe('100%');
    });

    it('should call getColumnWidth from gridColumnService if cellTemplate is not defined', () => {
      component.cellTemplate = undefined!;
      component.column = { id: 'test-column' } as ColumnDef;
      mockGridColumnService.getColumnWidth.and.returnValue('200px');

      const width = component.getWidth();

      expect(mockGridColumnService.getColumnWidth).toHaveBeenCalledWith(
        component.column,
        mockGridService.gridOptions
      );
      expect(width).toBe('200px');
    });
  });

  describe('templates getter', () => {
    it('should return templates from gridService', () => {
      mockGridService.templates = { testTemplate: {} } as any;
      expect(component.templates).toEqual(mockGridService.templates);
    });
  });
});