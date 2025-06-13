import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef, EventEmitter } from '@angular/core';
import { GridMenuBarComponent } from './grid-menu-bar.component';
import { GRID_SERVICE } from '../../tokens/grid-service.token';
import { IGridService } from '../../interfaces/service-interfaces/grid.interface';

describe('GridMenuBarComponent', () => {
  let component: GridMenuBarComponent;
  let fixture: ComponentFixture<GridMenuBarComponent>;
  let mockGridService: jasmine.SpyObj<IGridService>;

  beforeEach(async () => {
    mockGridService = jasmine.createSpyObj('IGridService', ['gridOptions', 'templates']);
    mockGridService.gridOptions = { option1: true } as any;
    mockGridService.templates = { template1: '<div></div>' } as any;

    await TestBed.configureTestingModule({
      imports: [GridMenuBarComponent],
      providers: [
        { provide: GRID_SERVICE, useValue: mockGridService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridMenuBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return gridOptions from gridService', () => {
    expect(component.gridOptions).toEqual(mockGridService.gridOptions);
  });

  it('should return templates from gridService', () => {
    expect(component.templates).toEqual(mockGridService.templates);
  });
});
