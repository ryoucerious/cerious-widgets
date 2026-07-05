import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InputTextDirective } from './input-text.directive';

@Component({
  standalone: true,
  imports: [InputTextDirective],
  template: `<input cwInput placeholder="Name" /><textarea cwInput></textarea>`
})
class HostComponent {}

describe('InputTextDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  it('applies the cw-input class to inputs and textareas', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect((fixture.nativeElement.querySelector('input') as HTMLElement).classList).toContain('cw-input');
    expect((fixture.nativeElement.querySelector('textarea') as HTMLElement).classList).toContain('cw-input');
  });
});
