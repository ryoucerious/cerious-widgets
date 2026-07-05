import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';

@Component({
  standalone: true,
  imports: [DialogComponent],
  template: `
    <cw-dialog header="Confirm Action" [visible]="visible" (visibleChange)="visible = $event">
      Are you sure?
      <div cwDialogFooter><button type="button" class="ok">OK</button></div>
    </cw-dialog>
  `
})
class HostComponent {
  visible = false;
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
});
