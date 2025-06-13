import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { GridHeaderFeatureColumnComponent } from './grid-header-feature-column.component';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { GRID_COLUMN_SERVICE } from '../../tokens/grid-column-service.token';
import { IGridColumnService, IGridService } from '../../interfaces';

describe('GridHeaderFeatureColumnComponent', () => {
  let component: GridHeaderFeatureColumnComponent;
  let fixture: ComponentFixture<GridHeaderFeatureColumnComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;
  let mockGridColumnService: jasmine.SpyObj<IGridColumnService>;
  let rowSelectSubject: Subject<boolean>;
  let selectedRowsChangeSubject: Subject<boolean>;

  beforeEach(async () => {
    // Create a Subject for rowSelect
    rowSelectSubject = new Subject<boolean>();
    selectedRowsChangeSubject = new Subject<boolean>();

    mockGridService = jasmine.createSpyObj('IGridService', [], {
      gridOptions: { someOption: true },
      templates: { someTemplate: true },
      render: jasmine.createSpy('render'),
      gridDataset: {
        dataset: [
          { selected: false },
          { selected: false }
        ]
      },
      rowSelect: rowSelectSubject,
      selectedRowsChange: selectedRowsChangeSubject
    });

    mockGridColumnService = jasmine.createSpyObj('IGridColumnService', ['getFeatureWidth']);
    mockGridColumnService.getFeatureWidth.and.returnValue(100);

    await TestBed.configureTestingModule({
      imports: [GridHeaderFeatureColumnComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService },
        { provide: GRID_COLUMN_SERVICE, useValue: mockGridColumnService },
        { provide: ElementRef, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GridHeaderFeatureColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return featureWidth with px suffix', () => {
    expect(component.featureWidth).toBe('100px');
    expect(mockGridColumnService.getFeatureWidth).toHaveBeenCalledWith(mockGridService.gridOptions);
  });

  it('should return gridOptions from gridService', () => {
    expect(component.gridOptions).toEqual(mockGridService.gridOptions);
  });

  it('should return templates from gridService', () => {
    expect(component.templates).toEqual(mockGridService.templates);
  });

  it('should toggle selected state on ngOnInit when rowSelect emits', () => {
    mockGridService.gridDataset.dataset[0].selected = true;
    mockGridService.gridDataset.dataset[1].selected = true;

    // Emit a value using the Subject
    rowSelectSubject.next(true);

    // Verify the selected state
    expect(component.selected).toBeTrue();
  });

  it('should toggle all rows selection state when selectAll is called', () => {
    component.selectAll();
    expect(component.selected).toBeTrue();
    expect(mockGridService.gridDataset.dataset.every(row => row.selected)).toBeTrue();

    component.selectAll();
    expect(component.selected).toBeFalse();
    expect(mockGridService.gridDataset.dataset.every(row => !row.selected)).toBeTrue();
  });
});