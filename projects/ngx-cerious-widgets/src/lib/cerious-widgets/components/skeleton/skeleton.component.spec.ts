import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let fixture: ComponentFixture<SkeletonComponent>;
  let component: SkeletonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SkeletonComponent] }).compileComponents();
    fixture = TestBed.createComponent(SkeletonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('applies width and height styles', () => {
    fixture.componentRef.setInput('width', '12rem');
    fixture.componentRef.setInput('height', '1.5rem');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.style.width).toBe('12rem');
    expect(host.style.height).toBe('1.5rem');
  });

  it('resolves a circle to a 50% radius', () => {
    fixture.componentRef.setInput('shape', 'circle');
    expect(component.resolvedRadius()).toBe('50%');
  });

  it('honours an explicit border radius for rectangles', () => {
    fixture.componentRef.setInput('borderRadius', '4px');
    expect(component.resolvedRadius()).toBe('4px');
  });

  it('is hidden from assistive technology', () => {
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).getAttribute('aria-hidden')).toBe('true');
  });
});
