import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { GridNestedRowColumnComponent } from './grid-nested-row-column.component';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';
import { GridRow } from '../../models/grid-row';

describe('GridNestedRowColumnComponent', () => {
  let component: GridNestedRowColumnComponent;
  let fixture: ComponentFixture<GridNestedRowColumnComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;

  beforeEach(async () => {
    mockGridService = jasmine.createSpyObj('IGridService', ['gridOptions', 'templates']);
    mockGridService.gridOptions = { option1: true } as any;
    mockGridService.templates = { template1: '<div></div>' } as any;

    await TestBed.configureTestingModule({
      declarations: [GridNestedRowColumnComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GridNestedRowColumnComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have gridRow as an input', () => {
    const gridRow = new GridRow({});
    component.gridRow = gridRow;
    expect(component.gridRow).toBe(gridRow);
  });

  it('should return gridOptions from gridService', () => {
    expect(component.gridOptions).toEqual(mockGridService.gridOptions);
  });

  it('should return templates from gridService', () => {
    expect(component.templates).toEqual(mockGridService.templates);
  });
});