import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SelectComponent } from './select.component';

@Component({
  standalone: true,
  imports: [SelectComponent, FormsModule],
  template: `<cw-select [options]="options" [(ngModel)]="value" placeholder="Pick" />`
})
class HostComponent {
  options = [
    { label: 'One', value: 1 },
    { label: 'Two', value: 2 },
    { label: 'Three', value: 3 }
  ];
  value: number | null = null;
  @ViewChild(SelectComponent) select!: SelectComponent;
}

describe('SelectComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let overlayContainer: OverlayContainer;
  let containerEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
    containerEl = overlayContainer.getContainerElement();
  });

  afterEach(() => overlayContainer.ngOnDestroy());

  function selectEl(): HTMLElement {
    return fixture.nativeElement.querySelector('cw-select');
  }

  it('shows the placeholder when nothing is selected', () => {
    expect(selectEl().textContent).toContain('Pick');
  });

  it('opens on click and lists the options', () => {
    selectEl().click();
    fixture.detectChanges();
    expect(host.select.isOpen()).toBeTrue();
    expect(containerEl.querySelectorAll('.cw-select__option').length).toBe(3);
  });

  it('selects an option and writes the value back through ngModel', async () => {
    selectEl().click();
    fixture.detectChanges();
    const second = containerEl.querySelectorAll('.cw-select__option')[1] as HTMLElement;
    second.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(host.value).toBe(2);
    expect(host.select.isOpen()).toBeFalse();
    expect(selectEl().textContent).toContain('Two');
  });

  it('reflects an externally written value as the selected label', async () => {
    host.value = 3;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges(); // reflect the ngModel-written signal
    expect(selectEl().textContent).toContain('Three');
  });

  it('navigates with arrow keys and selects with Enter', async () => {
    const el = selectEl();
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })); // open
    fixture.detectChanges();
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })); // -> index 1
    fixture.detectChanges();
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(host.value).toBe(2);
  });

  it('closes on Escape without selecting', () => {
    selectEl().click();
    fixture.detectChanges();
    selectEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(host.select.isOpen()).toBeFalse();
    expect(host.value).toBeNull();
  });

  it('handles empty options without crashing on arrow keys', () => {
    host.options = [];
    fixture.detectChanges();
    const el = selectEl();
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })); // open
    fixture.detectChanges();
    expect(host.select.isOpen()).toBeTrue();
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    expect(host.select.highlightedIndex()).toBe(-1); // not NaN
    expect(containerEl.querySelector('.cw-select__empty')).toBeTruthy();
  });

  it('jumps to a matching option on type-ahead', () => {
    const el = selectEl();
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })); // open
    fixture.detectChanges();
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'T' })); // -> "Two"
    fixture.detectChanges();
    expect(host.select.highlightedIndex()).toBe(1);
  });

  it('supports Home and End keys', () => {
    const el = selectEl();
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })); // open, highlight 0
    fixture.detectChanges();
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();
    expect(host.select.highlightedIndex()).toBe(2);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();
    expect(host.select.highlightedIndex()).toBe(0);
  });

  it('points aria-activedescendant at the active option', () => {
    const el = selectEl();
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })); // open, highlight 0
    fixture.detectChanges();
    const activeDescendant = el.getAttribute('aria-activedescendant');
    const activeOption = containerEl.querySelector('.cw-select__option--active');
    expect(activeDescendant).toBeTruthy();
    expect(activeOption?.id).toBe(activeDescendant!);
  });
});
