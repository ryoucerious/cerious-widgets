import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `<button cwButton [severity]="severity" [variant]="variant" [loading]="loading" [disabled]="disabled" [icon]="icon">Save</button>`
})
class HostComponent {
  severity = 'primary';
  variant = 'filled';
  loading = false;
  disabled = false;
  icon = '';
}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button');
  });

  it('renders projected label and base class', () => {
    expect(button.classList).toContain('cw-button');
    expect(button.textContent).toContain('Save');
  });

  it('reflects severity, variant and size as host attributes', () => {
    fixture.componentInstance.severity = 'danger';
    fixture.componentInstance.variant = 'outlined';
    fixture.detectChanges();
    expect(button.getAttribute('data-severity')).toBe('danger');
    expect(button.getAttribute('data-variant')).toBe('outlined');
  });

  it('disables and marks busy while loading, showing the spinner', () => {
    fixture.componentInstance.loading = true;
    fixture.detectChanges();
    expect(button.hasAttribute('disabled')).toBeTrue();
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('cw-spinner')).toBeTruthy();
  });

  it('disables via the disabled input', () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    expect(button.hasAttribute('disabled')).toBeTrue();
  });

  it('renders a leading icon when provided and not loading', () => {
    fixture.componentInstance.icon = 'cw-icon-save';
    fixture.detectChanges();
    expect(button.querySelector('.cw-button__icon')?.classList).toContain('cw-icon-save');
  });
});
