import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleButtonComponent } from './toggle-button.component';

describe('ToggleButtonComponent', () => {
  let fixture: ComponentFixture<ToggleButtonComponent>;
  let el: HTMLElement;
  let btn: () => HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ToggleButtonComponent] }).compileComponents();
    fixture = TestBed.createComponent(ToggleButtonComponent);
    el = fixture.nativeElement;
    btn = () => el.querySelector('.cw-toggle-button__btn') as HTMLButtonElement;
  });

  it('shows the off label and aria-pressed=false initially', () => {
    fixture.componentRef.setInput('onLabel', 'Following');
    fixture.componentRef.setInput('offLabel', 'Follow');
    fixture.detectChanges();
    expect(btn().textContent!.trim()).toBe('Follow');
    expect(btn().getAttribute('aria-pressed')).toBe('false');
  });

  it('toggles state, label and aria-pressed, propagating via the CVA onChange', () => {
    fixture.componentRef.setInput('onLabel', 'On');
    fixture.componentRef.setInput('offLabel', 'Off');
    const changes: boolean[] = [];
    fixture.componentInstance.registerOnChange(v => changes.push(v));
    fixture.detectChanges();

    btn().click();
    fixture.detectChanges();
    expect(fixture.componentInstance.checked()).toBe(true);
    expect(btn().textContent!.trim()).toBe('On');
    expect(btn().getAttribute('aria-pressed')).toBe('true');
    expect(changes).toEqual([true]);
  });

  it('writeValue reflects an external model value', () => {
    fixture.componentInstance.writeValue(true);
    fixture.detectChanges();
    expect(fixture.componentInstance.checked()).toBe(true);
    expect(btn().getAttribute('aria-pressed')).toBe('true');
  });

  it('setDisabledState disables the button', () => {
    fixture.componentInstance.setDisabledState(true);
    fixture.detectChanges();
    expect(btn().disabled).toBe(true);
  });
});
