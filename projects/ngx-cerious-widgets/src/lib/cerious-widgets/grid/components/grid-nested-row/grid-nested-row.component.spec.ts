import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { GridNestedRowComponent } from './grid-nested-row.component';
import { GridRow } from '../../models/grid-row';
import { GridNestedRowColumnComponent } from '../grid-nested-row-column/grid-nested-row-column.component';
import { QueryList } from '@angular/core';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';

describe('GridNestedRowComponent', () => {
  let component: GridNestedRowComponent;
  let fixture: ComponentFixture<GridNestedRowComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;

  beforeEach(async () => {
    mockGridService = jasmine.createSpyObj('IGridService', ['gridOptions', 'templates']);
    mockGridService.gridOptions = { someOption: true } as any;
    mockGridService.templates = { someTemplate: '<div></div>' } as any;

    await TestBed.configureTestingModule({
      declarations: [GridNestedRowComponent, GridNestedRowColumnComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GridNestedRowComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have gridRow input defined', () => {
    const gridRow = new GridRow({});
    component.gridRow = gridRow;
    expect(component.gridRow).toBe(gridRow);
  });

  it('should retrieve gridOptions from gridService', () => {
    expect(component.gridOptions).toEqual(mockGridService.gridOptions);
  });

  it('should retrieve templates from gridService', () => {
    expect(component.templates).toEqual(mockGridService.templates);
  });

  it('should have columnComponents as a QueryList', () => {
    const queryList = new QueryList<GridNestedRowColumnComponent>();
    component.columnComponents = queryList;
    expect(component.columnComponents).toBe(queryList);
  });
});
