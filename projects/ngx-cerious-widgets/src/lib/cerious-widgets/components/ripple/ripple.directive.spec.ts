import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RippleDirective } from './ripple.directive';

@Component({
  standalone: true,
  imports: [RippleDirective],
  template: `<button cwRipple [rippleDisabled]="disabled" style="width: 80px; height: 40px;">Go</button>`
})
class HostComponent {
  disabled = false;
}

describe('RippleDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.nativeElement.remove();
  });

  function host(): HTMLElement {
    return fixture.nativeElement.querySelector('button');
  }

  it('makes the host a positioned, clipped ripple container', () => {
    expect(getComputedStyle(host()).position).toBe('relative');
    expect(host().style.overflow).toBe('hidden');
    expect(host().classList).toContain('cw-ripple-host');
  });

  it('spawns a ripple element on pointerdown', () => {
    host().dispatchEvent(new PointerEvent('pointerdown', { clientX: 40, clientY: 20, bubbles: true }));
    expect(host().querySelector('.cw-ripple')).toBeTruthy();
  });

  it('does not spawn when disabled', () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    host().dispatchEvent(new PointerEvent('pointerdown', { clientX: 40, clientY: 20, bubbles: true }));
    expect(host().querySelector('.cw-ripple')).toBeNull();
  });
});
