import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SplitterComponent, SplitterPanelDirective } from './splitter.component';

@Component({
  standalone: true,
  imports: [SplitterComponent, SplitterPanelDirective],
  template: `
    <cw-splitter [layout]="layout" [initialSizes]="sizes" [minSize]="10" (resizeEnd)="last = $event" style="width: 400px; height: 200px;">
      <ng-template cwSplitterPanel><div class="p1">One</div></ng-template>
      <ng-template cwSplitterPanel><div class="p2">Two</div></ng-template>
    </cw-splitter>
  `
})
class HostComponent {
  layout: 'horizontal' | 'vertical' = 'horizontal';
  sizes = [30, 70];
  last: number[] = [];
}

describe('SplitterComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function panels(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-splitter__panel'));
  }
  function gutter(): HTMLElement {
    return fixture.nativeElement.querySelector('.cw-splitter__gutter');
  }

  it('renders each panel with its initial flex-basis and a gutter between', () => {
    expect(panels().length).toBe(2);
    expect(panels()[0].style.flexBasis).toBe('30%');
    expect(panels()[1].style.flexBasis).toBe('70%');
    expect(fixture.nativeElement.querySelectorAll('.cw-splitter__gutter').length).toBe(1);
    expect(panels()[0].textContent!.trim()).toBe('One');
  });

  it('resizes panels on gutter drag and clamps to minSize', () => {
    // Drag left by 200px (the host is 400px wide) → panel A would go to
    // 30 - 50 = -20%, clamped to the 10% minimum.
    gutter().dispatchEvent(new PointerEvent('pointerdown', { clientX: 120, clientY: 0, bubbles: true }));
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: -80, clientY: 0 }));
    window.dispatchEvent(new PointerEvent('pointerup'));
    fixture.detectChanges();

    expect(parseFloat(panels()[0].style.flexBasis)).toBeCloseTo(10, 1);
    expect(parseFloat(panels()[1].style.flexBasis)).toBeCloseTo(90, 1);
    expect(fixture.componentInstance.last.length).toBe(2);
  });

  it('reflects vertical orientation', () => {
    fixture.componentInstance.layout = 'vertical';
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('cw-splitter') as HTMLElement).getAttribute('data-layout')).toBe('vertical');
  });

  it('exposes the required separator ARIA value attributes', () => {
    const g = gutter();
    expect(g.getAttribute('role')).toBe('separator');
    expect(g.getAttribute('aria-valuenow')).toBe('30');
    expect(g.getAttribute('aria-valuemin')).toBe('10');
    expect(g.getAttribute('aria-valuemax')).toBe('90');
    expect(g.getAttribute('aria-label')).toBe('Resize panel 1');
  });

  it('resizes with the arrow keys and clamps to minSize', () => {
    gutter().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    // 30 - 5 = 25%
    expect(parseFloat(panels()[0].style.flexBasis)).toBeCloseTo(25, 1);
    expect(gutter().getAttribute('aria-valuenow')).toBe('25');
    expect(fixture.componentInstance.last.length).toBe(2);
  });

  it('Home/End jump the split to the min/max', () => {
    gutter().dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(parseFloat(panels()[0].style.flexBasis)).toBeCloseTo(10, 1);
    gutter().dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(parseFloat(panels()[0].style.flexBasis)).toBeCloseTo(90, 1);
  });
});
