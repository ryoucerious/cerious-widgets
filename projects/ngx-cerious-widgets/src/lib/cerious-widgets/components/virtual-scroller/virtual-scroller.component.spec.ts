import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VirtualScrollerComponent, VirtualScrollerItemDirective } from './virtual-scroller.component';

@Component({
  standalone: true,
  imports: [VirtualScrollerComponent, VirtualScrollerItemDirective],
  template: `
    <cw-virtual-scroller [items]="items" scrollHeight="200px">
      <ng-template cwVirtualScrollerItem let-item let-i="index">
        <span class="row">{{ i }}:{{ item }}</span>
      </ng-template>
    </cw-virtual-scroller>
  `
})
class HostComponent {
  items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);
}

describe('VirtualScrollerComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function rows(): string[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.row'), (el: any) => el.textContent.trim());
  }

  it('mounts the cerious-scroll engine', () => {
    expect(fixture.nativeElement.querySelector('cerious-scroll')).toBeTruthy();
  });

  it('renders only a window of rows, not all 1000', async () => {
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    fixture.detectChanges();

    const rendered = rows().length;
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(200);
    // The first row should carry the projected index + item content.
    expect(rows()[0]).toContain('0:Item 0');
  });

  it('exposes the underlying scroll directive for imperative control', () => {
    const component = fixture.debugElement.children[0].componentInstance as VirtualScrollerComponent;
    expect(component.scroller()).toBeTruthy();
    expect(() => component.scrollToIndex(500)).not.toThrow();
  });
});
