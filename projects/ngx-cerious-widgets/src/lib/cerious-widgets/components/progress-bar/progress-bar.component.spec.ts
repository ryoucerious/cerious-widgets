import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  let fixture: ComponentFixture<ProgressBarComponent>;
  let component: ProgressBarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProgressBarComponent] }).compileComponents();
    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clamps the value to 0–100', () => {
    fixture.componentRef.setInput('value', 140);
    expect(component.clampedValue()).toBe(100);
    fixture.componentRef.setInput('value', -20);
    expect(component.clampedValue()).toBe(0);
  });

  it('sets the fill width and aria-valuenow in determinate mode', () => {
    fixture.componentRef.setInput('value', 65);
    fixture.detectChanges();
    const fill = fixture.nativeElement.querySelector('.cw-progress-bar__fill') as HTMLElement;
    expect(fill.style.width).toBe('65%');
    expect((fixture.nativeElement as HTMLElement).getAttribute('aria-valuenow')).toBe('65');
  });

  it('shows the percentage label when showValue is set', () => {
    fixture.componentRef.setInput('value', 42);
    fixture.componentRef.setInput('showValue', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cw-progress-bar__label').textContent.trim()).toBe('42%');
  });

  it('omits determinate aria in indeterminate mode', () => {
    fixture.componentRef.setInput('mode', 'indeterminate');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).getAttribute('aria-valuenow')).toBeNull();
  });
});
