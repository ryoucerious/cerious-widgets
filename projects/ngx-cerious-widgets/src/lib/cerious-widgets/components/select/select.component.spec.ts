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
});
