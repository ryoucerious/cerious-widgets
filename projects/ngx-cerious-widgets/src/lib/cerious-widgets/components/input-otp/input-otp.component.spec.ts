import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputOtpComponent } from './input-otp.component';

describe('InputOtpComponent', () => {
  let fixture: ComponentFixture<InputOtpComponent>;
  let component: InputOtpComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InputOtpComponent] }).compileComponents();
    fixture = TestBed.createComponent(InputOtpComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('length', 4);
    fixture.detectChanges();
  });

  function boxes(): HTMLInputElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-input-otp__box'));
  }
  function typeInto(index: number, ch: string): void {
    const box = boxes()[index];
    box.value = ch;
    box.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('renders one box per length', () => {
    expect(boxes().length).toBe(4);
  });

  it('builds the value as characters are entered and auto-advances', () => {
    const emitted: string[] = [];
    component.registerOnChange(v => emitted.push(v));

    typeInto(0, '1');
    typeInto(1, '2');
    typeInto(2, '3');
    typeInto(3, '4');

    expect(component.chars().join('')).toBe('1234');
    expect(emitted[emitted.length - 1]).toBe('1234');
    expect(document.activeElement).toBe(boxes()[3]);
  });

  it('restricts to digits when integerOnly', () => {
    fixture.componentRef.setInput('integerOnly', true);
    fixture.detectChanges();

    typeInto(0, 'a');
    expect(component.charAt(0)).toBe('');
    typeInto(0, '7');
    expect(component.charAt(0)).toBe('7');
  });

  it('backspace clears then moves to the previous box', () => {
    component.writeValue('12');
    fixture.detectChanges();

    boxes()[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    fixture.detectChanges();
    // box 2 was empty → clears box 1 and moves focus there
    expect(component.charAt(1)).toBe('');
    expect(document.activeElement).toBe(boxes()[1]);
  });

  it('fills from a pasted string', () => {
    const box = boxes()[0];
    const event = new ClipboardEvent('paste', { clipboardData: new DataTransfer() });
    event.clipboardData!.setData('text', '9876');
    box.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.chars().join('')).toBe('9876');
  });
});
