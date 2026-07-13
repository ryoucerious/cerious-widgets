import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipDirective } from './tooltip.directive';

@Component({
  standalone: true,
  imports: [TooltipDirective],
  template: `<button cwTooltip="Helpful hint" cwTooltipPosition="top">Hover me</button>`
})
class HostComponent {}

describe('TooltipDirective', () => {
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

  function button(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }
  function tooltip(): HTMLElement | null {
    return overlayContainer.getContainerElement().querySelector('.cw-tooltip');
  }

  it('shows the bubble on mouseenter and hides it on mouseleave', () => {
    button().dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const bubble = tooltip();
    expect(bubble).toBeTruthy();
    expect(bubble!.textContent!.trim()).toBe('Helpful hint');
    expect(bubble!.getAttribute('role')).toBe('tooltip');
    expect(bubble!.getAttribute('data-position')).toBe('top');

    button().dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(tooltip()).toBeNull();
  });

  it('shows on focus and hides on blur', () => {
    button().dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(tooltip()).toBeTruthy();

    button().dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
    expect(tooltip()).toBeNull();
  });
});
