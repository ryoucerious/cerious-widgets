import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawerComponent } from './drawer.component';

@Component({
  standalone: true,
  imports: [DrawerComponent],
  template: `
    <cw-drawer header="Filters" position="right" [visible]="visible" (visibleChange)="visible = $event">
      Drawer content
    </cw-drawer>
  `
})
class HostComponent {
  visible = false;
}

describe('DrawerComponent', () => {
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
    return overlayContainer.getContainerElement().querySelector('.cw-drawer__panel');
  }

  it('slides in when visible and renders header + content', () => {
    expect(panel()).toBeNull();

    fixture.componentInstance.visible = true;
    fixture.detectChanges();

    expect(panel()).toBeTruthy();
    expect(panel()!.getAttribute('data-position')).toBe('right');
    expect(panel()!.textContent).toContain('Filters');
    expect(panel()!.textContent).toContain('Drawer content');
  });

  it('closes via ✕ and emits visibleChange(false)', () => {
    fixture.componentInstance.visible = true;
    fixture.detectChanges();

    (panel()!.querySelector('.cw-drawer__close') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.visible).toBeFalse();
    expect(panel()).toBeNull();
  });

  it('closes on backdrop click', () => {
    fixture.componentInstance.visible = true;
    fixture.detectChanges();

    (overlayContainer.getContainerElement().querySelector('.cw-dialog-backdrop') as HTMLElement).click();
    fixture.detectChanges();

    expect(panel()).toBeNull();
  });
});
