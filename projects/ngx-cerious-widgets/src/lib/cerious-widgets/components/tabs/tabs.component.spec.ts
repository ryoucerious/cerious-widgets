import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabComponent, TabsComponent } from './tabs.component';

@Component({
  standalone: true,
  imports: [TabsComponent, TabComponent],
  template: `
    <cw-tabs (activeIndexChange)="active = $event">
      <cw-tab label="One">First content</cw-tab>
      <cw-tab label="Two">Second content</cw-tab>
      <cw-tab label="Three" disabled>Third content</cw-tab>
    </cw-tabs>
  `
})
class HostComponent {
  active = 0;
}

describe('TabsComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function tabButtons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-tabs__tab'));
  }
  function body(): string {
    return (fixture.nativeElement.querySelector('.cw-tabs__body') as HTMLElement).textContent!.trim();
  }

  it('renders tab headers and shows only the active content', () => {
    expect(tabButtons().map(b => b.textContent!.trim())).toEqual(['One', 'Two', 'Three']);
    expect(tabButtons()[0].classList).toContain('cw-tabs__tab--active');
    expect(body()).toBe('First content');
  });

  it('switches content on tab click and emits activeIndexChange', () => {
    tabButtons()[1].click();
    fixture.detectChanges();

    expect(body()).toBe('Second content');
    expect(fixture.componentInstance.active).toBe(1);
    expect(tabButtons()[1].getAttribute('aria-selected')).toBe('true');
  });

  it('ignores clicks on disabled tabs', () => {
    tabButtons()[2].click();
    fixture.detectChanges();
    expect(body()).toBe('First content');
  });

  it('moves with arrow keys, skipping disabled tabs', () => {
    const header = fixture.nativeElement.querySelector('.cw-tabs__header') as HTMLElement;
    header.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(body()).toBe('Second content');

    // Right again skips the disabled third tab and wraps to the first.
    header.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(body()).toBe('First content');
  });
});
