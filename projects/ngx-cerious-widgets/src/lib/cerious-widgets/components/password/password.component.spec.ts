import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordComponent } from './password.component';

describe('PasswordComponent', () => {
  let fixture: ComponentFixture<PasswordComponent>;
  let component: PasswordComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PasswordComponent] }).compileComponents();
    fixture = TestBed.createComponent(PasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function input(): HTMLInputElement {
    return fixture.nativeElement.querySelector('.cw-password__input');
  }
  function toggle(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.cw-password__toggle');
  }
  function meter(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.cw-password__meter');
  }

  it('masks by default and reveals on toggle', () => {
    expect(input().type).toBe('password');
    toggle().click();
    fixture.detectChanges();
    expect(input().type).toBe('text');
  });

  it('emits typed value through onChange', () => {
    const emitted: string[] = [];
    component.registerOnChange(v => emitted.push(v));

    input().value = 'secret';
    input().dispatchEvent(new Event('input'));
    expect(component.value()).toBe('secret');
    expect(emitted).toEqual(['secret']);
  });

  it('scores strength from the password composition', () => {
    component.writeValue('abc');
    fixture.detectChanges();
    expect(component.strength()).toBe('weak');

    component.writeValue('Abcd1234!');
    fixture.detectChanges();
    expect(component.strength()).toBe('strong');
    expect(meter()!.getAttribute('data-strength')).toBe('strong');
  });

  it('hides the meter when feedback is off', () => {
    fixture.componentRef.setInput('feedback', false);
    component.writeValue('Abcd1234!');
    fixture.detectChanges();
    expect(meter()).toBeNull();
  });
});
