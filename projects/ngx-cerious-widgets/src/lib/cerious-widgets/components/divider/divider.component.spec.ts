import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DividerComponent } from './divider.component';

@Component({
  standalone: true,
  imports: [DividerComponent],
  template: `<cw-divider align="left">OR</cw-divider>`
})
class HostComponent {}

describe('DividerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DividerComponent, HostComponent] }).compileComponents();
  });

  it('defaults to a horizontal solid separator', () => {
    const fixture = TestBed.createComponent(DividerComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.getAttribute('role')).toBe('separator');
    expect(host.getAttribute('data-layout')).toBe('horizontal');
    expect(host.getAttribute('data-type')).toBe('solid');
    expect(host.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('reflects layout and type', () => {
    const fixture = TestBed.createComponent(DividerComponent);
    fixture.componentRef.setInput('layout', 'vertical');
    fixture.componentRef.setInput('type', 'dashed');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.getAttribute('data-layout')).toBe('vertical');
    expect(host.getAttribute('data-type')).toBe('dashed');
    expect(host.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('projects a label with alignment', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const divider = fixture.nativeElement.querySelector('cw-divider') as HTMLElement;

    expect(divider.querySelector('.cw-divider__content')!.textContent!.trim()).toBe('OR');
    expect(divider.getAttribute('data-align')).toBe('left');
  });
});
