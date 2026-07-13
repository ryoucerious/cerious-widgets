import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputGroupComponent } from './input-group.component';

@Component({
  standalone: true,
  imports: [InputGroupComponent],
  template: `
    <cw-input-group>
      <span cwInputAddon>$</span>
      <input class="field" placeholder="0.00" />
      <button class="go">Go</button>
    </cw-input-group>
  `
})
class HostComponent {}

describe('InputGroupComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function group(): HTMLElement {
    return fixture.nativeElement.querySelector('cw-input-group');
  }

  it('is a group that projects its addons and control in order', () => {
    expect(group().getAttribute('role')).toBe('group');
    const children = Array.from(group().children) as HTMLElement[];
    expect(children[0].getAttribute('cwInputAddon')).not.toBeNull();
    expect(children[0].textContent!.trim()).toBe('$');
    expect(children[1].classList).toContain('field');
    expect(children[2].classList).toContain('go');
  });
});
