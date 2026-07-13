import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputMaskComponent } from './input-mask.component';

describe('InputMaskComponent', () => {
  let fixture: ComponentFixture<InputMaskComponent>;
  let component: InputMaskComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InputMaskComponent] }).compileComponents();
    fixture = TestBed.createComponent(InputMaskComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mask', '(999) 999-9999');
    fixture.detectChanges();
  });

  function input(): HTMLInputElement {
    return fixture.nativeElement.querySelector('.cw-input-mask__input');
  }
  function type(value: string): void {
    input().value = value;
    input().dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('renders the mask as a slot placeholder', () => {
    expect(input().placeholder).toBe('(___) ___-____');
  });

  it('formats digits against the mask', () => {
    type('5551234567');
    expect(component.display()).toBe('(555) 123-4567');
    expect(input().value).toBe('(555) 123-4567');
  });

  it('ignores characters that do not fit the token', () => {
    type('abc555xyz');
    expect(component.display()).toBe('(555) ');
  });

  it('emits the formatted value by default and raw when unmask is set', () => {
    const emitted: string[] = [];
    component.registerOnChange(v => emitted.push(v));

    type('5551234567');
    expect(emitted[emitted.length - 1]).toBe('(555) 123-4567');

    fixture.componentRef.setInput('unmask', true);
    type('5551234567');
    expect(emitted[emitted.length - 1]).toBe('5551234567');
  });

  it('formats a written value', () => {
    component.writeValue('5551234567');
    fixture.detectChanges();
    expect(component.display()).toBe('(555) 123-4567');
  });
});
