import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioButtonComponent } from './radio-button.component';

describe('RadioButtonComponent', () => {
  let fixture: ComponentFixture<RadioButtonComponent>;
  let component: RadioButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RadioButtonComponent] }).compileComponents();
    fixture = TestBed.createComponent(RadioButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', 'a');
    fixture.componentRef.setInput('name', 'group');
    fixture.detectChanges();
  });

  function nativeInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('.cw-radio-button__input');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('is checked when the written model equals its value', () => {
    component.writeValue('a');
    fixture.detectChanges();
    expect(component.checked()).toBeTrue();
    expect((fixture.nativeElement as HTMLElement).classList).toContain('cw-radio-button--checked');

    component.writeValue('b');
    fixture.detectChanges();
    expect(component.checked()).toBeFalse();
  });

  it('emits its own value when the native input changes', () => {
    const emitted: unknown[] = [];
    component.registerOnChange(v => emitted.push(v));

    nativeInput().click();
    fixture.detectChanges();

    expect(emitted).toEqual(['a']);
    expect(component.checked()).toBeTrue();
  });

  it('renders label and disables via input', () => {
    fixture.componentRef.setInput('label', 'Small');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.cw-radio-button__label').textContent.trim()).toBe('Small');
    expect(nativeInput().disabled).toBeTrue();
  });
});
