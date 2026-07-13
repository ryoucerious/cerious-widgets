import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockUiComponent } from './block-ui.component';

@Component({
  standalone: true,
  imports: [BlockUiComponent],
  template: `
    <cw-block-ui [blocked]="blocked" [showSpinner]="showSpinner">
      <p class="content">Form content</p>
    </cw-block-ui>
  `
})
class HostComponent {
  blocked = false;
  showSpinner = true;
}

describe('BlockUiComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function mask(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.cw-block-ui__mask');
  }

  it('renders content and no mask when unblocked', () => {
    expect(fixture.nativeElement.querySelector('.content')!.textContent!.trim()).toBe('Form content');
    expect(mask()).toBeNull();
  });

  it('shows a mask with a spinner when blocked', () => {
    fixture.componentInstance.blocked = true;
    fixture.detectChanges();

    expect(mask()).toBeTruthy();
    expect(mask()!.getAttribute('aria-busy')).toBe('true');
    expect(mask()!.querySelector('cw-spinner')).toBeTruthy();
  });

  it('can hide the spinner', () => {
    fixture.componentInstance.blocked = true;
    fixture.componentInstance.showSpinner = false;
    fixture.detectChanges();

    expect(mask()).toBeTruthy();
    expect(mask()!.querySelector('cw-spinner')).toBeNull();
  });
});
