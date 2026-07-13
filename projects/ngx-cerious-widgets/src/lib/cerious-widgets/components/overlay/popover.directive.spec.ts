import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { PopoverDirective } from './popover.directive';

@Component({
  standalone: true,
  imports: [PopoverDirective],
  template: `
    <button id="trigger" [cwPopover]="tpl" [cwPopoverDisabled]="disabled"
            (cwPopoverOpened)="openCount = openCount + 1"
            (cwPopoverClosed)="closeCount = closeCount + 1">Open</button>
    <ng-template #tpl><div class="popover-body">Hello</div></ng-template>
  `
})
class HostComponent {
  disabled = false;
  openCount = 0;
  closeCount = 0;
  @ViewChild(PopoverDirective) popover!: PopoverDirective;
}

describe('PopoverDirective', () => {
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

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function trigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('#trigger');
  }

  it('should create the directive', () => {
    expect(host.popover).toBeTruthy();
    expect(host.popover.isOpen).toBeFalse();
  });

  it('opens the panel and renders content on trigger click', () => {
    trigger().click();
    fixture.detectChanges();
    expect(host.popover.isOpen).toBeTrue();
    expect(containerEl.querySelector('.popover-body')?.textContent).toContain('Hello');
    expect(host.openCount).toBe(1);
  });

  it('toggles closed on a second trigger click', () => {
    trigger().click();
    fixture.detectChanges();
    trigger().click();
    fixture.detectChanges();
    expect(host.popover.isOpen).toBeFalse();
    expect(containerEl.querySelector('.popover-body')).toBeNull();
    expect(host.closeCount).toBe(1);
  });

  it('does not open when disabled', () => {
    host.disabled = true;
    fixture.detectChanges();
    trigger().click();
    fixture.detectChanges();
    expect(host.popover.isOpen).toBeFalse();
  });

  it('closes on Escape', () => {
    host.popover.open();
    fixture.detectChanges();
    expect(host.popover.isOpen).toBeTrue();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(host.popover.isOpen).toBeFalse();
  });

  it('disposes the overlay on destroy', () => {
    host.popover.open();
    fixture.detectChanges();
    expect(host.popover.isOpen).toBeTrue();
    fixture.destroy();
    expect(containerEl.querySelector('.popover-body')).toBeNull();
  });
});
