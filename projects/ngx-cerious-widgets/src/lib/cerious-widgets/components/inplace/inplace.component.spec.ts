import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InplaceComponent } from './inplace.component';

@Component({
  standalone: true,
  imports: [InplaceComponent],
  template: `
    <cw-inplace [disabled]="disabled" (opened)="openCount = openCount + 1" (closed)="closeCount = closeCount + 1">
      <span cwInplaceDisplay>Click to edit</span>
      <input cwInplaceEditor value="hello" />
    </cw-inplace>
  `
})
class HostComponent {
  disabled = false;
  openCount = 0;
  closeCount = 0;
}

describe('InplaceComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function display(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.cw-inplace__display');
  }
  function editor(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.cw-inplace__editor');
  }

  it('shows the display until activated', () => {
    expect(display()).toBeTruthy();
    expect(display()!.textContent!.trim()).toBe('Click to edit');
    expect(editor()).toBeNull();
  });

  it('opens the editor on click and emits opened', () => {
    display()!.click();
    fixture.detectChanges();

    expect(editor()).toBeTruthy();
    expect(editor()!.querySelector('input')).toBeTruthy();
    expect(fixture.componentInstance.openCount).toBe(1);
  });

  it('closes via the ✕ and emits closed', () => {
    display()!.click();
    fixture.detectChanges();

    (editor()!.querySelector('.cw-inplace__close') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(display()).toBeTruthy();
    expect(fixture.componentInstance.closeCount).toBe(1);
  });

  it('does not activate when disabled', () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    display()!.click();
    fixture.detectChanges();
    expect(editor()).toBeNull();
  });
});
