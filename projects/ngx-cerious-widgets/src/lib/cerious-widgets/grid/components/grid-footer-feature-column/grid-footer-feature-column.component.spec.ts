import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { GridFooterFeatureColumnComponent } from './grid-footer-feature-column.component';

describe('GridFooterFeatureColumnComponent', () => {
  let component: GridFooterFeatureColumnComponent;
  let fixture: ComponentFixture<GridFooterFeatureColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridFooterFeatureColumnComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridFooterFeatureColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an ElementRef instance', () => {
    expect(component.el).toBeInstanceOf(ElementRef);
  });
});