import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CW_LOCALE } from '../../shared/tokens/locale.token';
import { InputNumberComponent } from './input-number.component';

describe('InputNumberComponent', () => {
  let fixture: ComponentFixture<InputNumberComponent>;
  let component: InputNumberComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InputNumberComponent] }).compileComponents();
    fixture = TestBed.createComponent(InputNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function input(): HTMLInputElement {
    return fixture.nativeElement.querySelector('.cw-input-number__input');
  }
  function plus(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.cw-input-number__btn--plus');
  }
  function minus(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.cw-input-number__btn--minus');
  }

  it('increments and decrements by step and emits', () => {
    const emitted: (number | null)[] = [];
    component.registerOnChange(v => emitted.push(v));
    fixture.componentRef.setInput('step', 5);
    component.writeValue(10);
    fixture.detectChanges();

    plus().click();
    fixture.detectChanges();
    expect(component.value()).toBe(15);

    minus().click();
    fixture.detectChanges();
    expect(component.value()).toBe(10);
    expect(emitted).toEqual([15, 10]);
  });

  it('clamps to min/max on blur and disables buttons at bounds', () => {
    fixture.componentRef.setInput('min', 0);
    fixture.componentRef.setInput('max', 10);
    component.writeValue(10);
    fixture.detectChanges();
    expect(plus().disabled).toBeTrue();

    component.writeValue(50);
    input().dispatchEvent(new Event('focus'));
    input().dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(component.value()).toBe(10);
  });

  it('formats currency when not focused, raw when focused', () => {
    fixture.componentRef.setInput('mode', 'currency');
    fixture.componentRef.setInput('currency', 'USD');
    component.writeValue(1234.5);
    fixture.detectChanges();

    expect(input().value).toContain('$');
    expect(input().value).toContain('1,234.5');

    input().dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(input().value).toBe('1234.5');
  });

  it('parses typed input to a number', () => {
    const emitted: (number | null)[] = [];
    component.registerOnChange(v => emitted.push(v));

    input().value = '42';
    input().dispatchEvent(new Event('input'));
    expect(component.value()).toBe(42);
    expect(emitted).toEqual([42]);
  });

  it('formats currency using the per-instance locale input', () => {
    fixture.componentRef.setInput('mode', 'currency');
    fixture.componentRef.setInput('currency', 'EUR');
    fixture.componentRef.setInput('locale', 'de-DE');
    component.writeValue(1234.5);
    fixture.detectChanges();
    // de-DE groups with '.' and uses ',' as the decimal separator.
    expect(component.displayValue()).toBe((1234.5).toLocaleString('de-DE', {
      style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2
    }));
    expect(component.displayValue()).toContain('1.234,5');
  });
});

describe('InputNumberComponent with CW_LOCALE', () => {
  it('falls back to the app-wide CW_LOCALE when no locale input is set', () => {
    TestBed.configureTestingModule({
      imports: [InputNumberComponent],
      providers: [{ provide: CW_LOCALE, useValue: 'de-DE' }]
    });
    const fixture = TestBed.createComponent(InputNumberComponent);
    fixture.detectChanges();
    fixture.componentInstance.writeValue(1234.5);
    fixture.detectChanges();
    expect(fixture.componentInstance.displayValue()).toContain('1.234,5');
  });

  it('per-instance locale input overrides CW_LOCALE', () => {
    TestBed.configureTestingModule({
      imports: [InputNumberComponent],
      providers: [{ provide: CW_LOCALE, useValue: 'de-DE' }]
    });
    const fixture = TestBed.createComponent(InputNumberComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.detectChanges();
    fixture.componentInstance.writeValue(1234.5);
    fixture.detectChanges();
    expect(fixture.componentInstance.displayValue()).toContain('1,234.5');
  });
});
