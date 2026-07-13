import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let fixture: ComponentFixture<SpinnerComponent>;
  let component: SpinnerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SpinnerComponent] }).compileComponents();
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes status role and default accessible label', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('role')).toBe('status');
    expect(host.getAttribute('aria-label')).toBe('Loading');
  });

  it('applies size and stroke width to the ring', () => {
    fixture.componentRef.setInput('size', '3rem');
    fixture.componentRef.setInput('strokeWidth', 6);
    fixture.detectChanges();
    const ring = fixture.nativeElement.querySelector('.cw-spinner__ring') as HTMLElement;
    expect(ring.style.width).toBe('3rem');
    expect(ring.style.borderWidth).toBe('6px');
  });
});
