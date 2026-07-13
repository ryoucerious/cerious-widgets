import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';

@Component({
  standalone: true,
  imports: [DialogComponent],
  template: `
    <button type="button" class="trigger">Open</button>
    <cw-dialog [header]="header" [ariaLabel]="ariaLabel" [closable]="closable"
               [closeOnEscape]="closeOnEscape" [closeOnBackdrop]="closeOnBackdrop"
               [visible]="visible" (visibleChange)="visible = $event">
      Are you sure?
      <div cwDialogFooter><button type="button" class="ok">OK</button></div>
    </cw-dialog>
  `
})
class HostComponent {
  visible = false;
  header = 'Confirm Action';
  ariaLabel = '';
  closable = true;
  closeOnEscape = true;
  closeOnBackdrop = true;
}

describe('DialogComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    overlayContainer = TestBed.inject(OverlayContainer);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function panel(): HTMLElement | null {
    return overlayContainer.getContainerElement().querySelector('.cw-dialog__panel');
  }

  it('is hidden until visible is set', () => {
    expect(panel()).toBeNull();

    fixture.componentInstance.visible = true;
    fixture.detectChanges();

    const dialog = panel()!;
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.textContent).toContain('Confirm Action');
    expect(dialog.textContent).toContain('Are you sure?');
    expect(dialog.querySelector('.ok')).toBeTruthy();
  });

  it('closes via the ✕ and emits visibleChange(false)', () => {
    fixture.componentInstance.visible = true;
    fixture.detectChanges();

    (panel()!.querySelector('.cw-dialog__close') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.visible).toBeFalse();
    expect(panel()).toBeNull();
  });

  it('closes on Escape', () => {
    fixture.componentInstance.visible = true;
    fixture.detectChanges();

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(panel()).toBeNull();
    expect(fixture.componentInstance.visible).toBeFalse();
  });

  it('closes on backdrop click', () => {
    fixture.componentInstance.visible = true;
    fixture.detectChanges();

    const backdrop = overlayContainer.getContainerElement().querySelector('.cw-dialog-backdrop') as HTMLElement;
    backdrop.click();
    fixture.detectChanges();

    expect(panel()).toBeNull();
  });

  it('does NOT close on Escape when closeOnEscape is false', () => {
    fixture.componentInstance.closeOnEscape = false;
    fixture.componentInstance.visible = true;
    fixture.detectChanges();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(panel()).toBeTruthy();
    expect(fixture.componentInstance.visible).toBeTrue();
  });

  it('does NOT close on backdrop click when closeOnBackdrop is false', () => {
    fixture.componentInstance.closeOnBackdrop = false;
    fixture.componentInstance.visible = true;
    fixture.detectChanges();
    (overlayContainer.getContainerElement().querySelector('.cw-dialog-backdrop') as HTMLElement).click();
    fixture.detectChanges();
    expect(panel()).toBeTruthy();
  });

  it('names a header-less dialog via ariaLabel', () => {
    fixture.componentInstance.header = '';
    fixture.componentInstance.ariaLabel = 'Settings';
    fixture.componentInstance.visible = true;
    fixture.detectChanges();
    expect(panel()!.getAttribute('aria-label')).toBe('Settings');
    // no empty header bar rendered when there's no title (close button still allowed)
    expect(panel()!.querySelector('.cw-dialog__header')).toBeTruthy(); // closable=true keeps it
  });

  it('restores focus to the opener when closed', async () => {
    const trigger = fixture.nativeElement.querySelector('.trigger') as HTMLButtonElement;
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    fixture.componentInstance.visible = true;
    fixture.detectChanges();
    await fixture.whenStable(); // cdkTrapFocusAutoCapture moves focus after the zone stabilizes
    fixture.detectChanges();
    expect(panel()!.contains(document.activeElement)).toBeTrue(); // focus captured inside the dialog

    fixture.componentInstance.visible = false;
    fixture.detectChanges();
    expect(document.activeElement).toBe(trigger); // restored by cdkTrapFocusAutoCapture
  });
});
