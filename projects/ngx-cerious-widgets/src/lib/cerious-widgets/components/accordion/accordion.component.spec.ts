import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccordionComponent, AccordionPanelComponent } from './accordion.component';

@Component({
  standalone: true,
  imports: [AccordionComponent, AccordionPanelComponent],
  template: `
    <cw-accordion [multiple]="multiple">
      <cw-accordion-panel header="One" expanded>Content one</cw-accordion-panel>
      <cw-accordion-panel header="Two">Content two</cw-accordion-panel>
    </cw-accordion>
  `
})
class HostComponent {
  multiple = false;
}

describe('AccordionComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function headers(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-accordion-panel__header'));
  }
  function contents(): string[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-accordion-panel__content'), (el: any) => el.textContent.trim());
  }

  it('renders headers and honours the initial expanded attribute', () => {
    expect(headers().map(h => h.textContent!.trim())).toEqual(['One', 'Two']);
    expect(contents()).toEqual(['Content one']);
    expect(headers()[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('toggles a panel on header click', () => {
    headers()[0].click();
    fixture.detectChanges();
    expect(contents()).toEqual([]);

    headers()[0].click();
    fixture.detectChanges();
    expect(contents()).toEqual(['Content one']);
  });

  it('collapses siblings when not multiple', () => {
    headers()[1].click();
    fixture.detectChanges();
    expect(contents()).toEqual(['Content two']);
    expect(headers()[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('keeps siblings open when multiple', () => {
    fixture.componentInstance.multiple = true;
    fixture.detectChanges();

    headers()[1].click();
    fixture.detectChanges();
    expect(contents()).toEqual(['Content one', 'Content two']);
  });
});
