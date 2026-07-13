import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectButtonComponent } from './select-button.component';
import { ToggleButtonComponent } from '../toggle-button/toggle-button.component';

describe('SelectButtonComponent', () => {
  let fixture: ComponentFixture<SelectButtonComponent>;
  let component: SelectButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SelectButtonComponent] }).compileComponents();
    fixture = TestBed.createComponent(SelectButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', ['Low', 'Medium', 'High']);
    fixture.detectChanges();
  });

  function buttons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-select-button__option'));
  }

  it('renders an option per entry and selects on click', () => {
    const emitted: unknown[] = [];
    component.registerOnChange(v => emitted.push(v));

    expect(buttons().length).toBe(3);
    buttons()[1].click();
    fixture.detectChanges();

    expect(emitted).toEqual(['Medium']);
    expect(buttons()[1].classList).toContain('cw-select-button__option--selected');
    expect(buttons()[1].getAttribute('aria-pressed')).toBe('true');
  });

  it('reflects a written value and does not re-emit the same value', () => {
    const emitted: unknown[] = [];
    component.registerOnChange(v => emitted.push(v));

    component.writeValue('High');
    fixture.detectChanges();
    expect(buttons()[2].classList).toContain('cw-select-button__option--selected');

    buttons()[2].click();
    expect(emitted).toEqual([]);
  });
});

describe('ToggleButtonComponent', () => {
  let fixture: ComponentFixture<ToggleButtonComponent>;
  let component: ToggleButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ToggleButtonComponent] }).compileComponents();
    fixture = TestBed.createComponent(ToggleButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('onLabel', 'Following');
    fixture.componentRef.setInput('offLabel', 'Follow');
    fixture.detectChanges();
  });

  function button(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.cw-toggle-button__btn');
  }

  it('toggles label and state on click', () => {
    const emitted: boolean[] = [];
    component.registerOnChange(v => emitted.push(v));

    expect(button().textContent!.trim()).toBe('Follow');
    button().click();
    fixture.detectChanges();

    expect(button().textContent!.trim()).toBe('Following');
    expect(button().getAttribute('aria-pressed')).toBe('true');
    expect(emitted).toEqual([true]);
  });

  it('writeValue sets state without emitting', () => {
    const emitted: boolean[] = [];
    component.registerOnChange(v => emitted.push(v));
    component.writeValue(true);
    fixture.detectChanges();

    expect(button().textContent!.trim()).toBe('Following');
    expect(emitted).toEqual([]);
  });
});
