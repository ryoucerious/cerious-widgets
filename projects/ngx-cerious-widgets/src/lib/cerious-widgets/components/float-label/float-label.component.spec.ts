import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FloatLabelComponent } from './float-label.component';

@Component({
  standalone: true,
  imports: [FloatLabelComponent],
  template: `
    <cw-float-label label="Email">
      <input class="field" />
    </cw-float-label>
  `
})
class HostComponent {}

describe('FloatLabelComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function wrapper(): HTMLElement {
    return fixture.nativeElement.querySelector('cw-float-label');
  }
  function label(): HTMLElement {
    return fixture.nativeElement.querySelector('.cw-float-label__label');
  }
  function field(): HTMLInputElement {
    return fixture.nativeElement.querySelector('.field');
  }

  it('renders the label unfloated initially', () => {
    expect(label().textContent!.trim()).toBe('Email');
    expect(label().classList).not.toContain('cw-float-label__label--floated');
  });

  it('floats the label on focus and unfloats on blur when empty', () => {
    wrapper().dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();
    expect(label().classList).toContain('cw-float-label__label--floated');

    wrapper().dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    fixture.detectChanges();
    expect(label().classList).not.toContain('cw-float-label__label--floated');
  });

  it('keeps the label floated while the control has a value', () => {
    field().value = 'hi@there.com';
    wrapper().dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(label().classList).toContain('cw-float-label__label--floated');

    wrapper().dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    fixture.detectChanges();
    expect(label().classList).toContain('cw-float-label__label--floated');
  });
});
