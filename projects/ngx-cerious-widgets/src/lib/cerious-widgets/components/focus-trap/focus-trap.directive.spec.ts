import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FocusTrapDirective } from './focus-trap.directive';

@Component({
  standalone: true,
  imports: [FocusTrapDirective],
  template: `
    <div cwFocusTrap [cwFocusTrapDisabled]="disabled">
      <button class="first">first</button>
      <button class="middle">middle</button>
      <button class="last">last</button>
    </div>
  `
})
class HostComponent {
  disabled = false;
}

describe('FocusTrapDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let trap: HTMLElement;
  let first: HTMLButtonElement;
  let last: HTMLButtonElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    // Attach to the DOM so focus / offsetParent behave.
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    trap = fixture.nativeElement.querySelector('[cwFocusTrap]');
    first = fixture.nativeElement.querySelector('.first');
    last = fixture.nativeElement.querySelector('.last');
  });

  afterEach(() => {
    fixture.nativeElement.remove();
  });

  it('auto-focuses the first focusable on init', () => {
    expect(document.activeElement).toBe(first);
  });

  it('lists focusable descendants in order', () => {
    const dir = fixture.debugElement.children[0].injector.get(FocusTrapDirective);
    expect(dir.focusable().length).toBe(3);
  });

  it('wraps Tab from last to first', () => {
    last.focus();
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    trap.dispatchEvent(event);
    expect(event.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(first);
  });

  it('wraps Shift+Tab from first to last', () => {
    first.focus();
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
    trap.dispatchEvent(event);
    expect(event.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(last);
  });

  it('does nothing when disabled', () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    last.focus();
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    trap.dispatchEvent(event);
    expect(event.defaultPrevented).toBeFalse();
  });
});
