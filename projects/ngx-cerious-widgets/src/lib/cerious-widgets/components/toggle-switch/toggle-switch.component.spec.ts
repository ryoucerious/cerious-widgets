import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleSwitchComponent } from './toggle-switch.component';

describe('ToggleSwitchComponent', () => {
  let fixture: ComponentFixture<ToggleSwitchComponent>;
  let component: ToggleSwitchComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ToggleSwitchComponent] }).compileComponents();
    fixture = TestBed.createComponent(ToggleSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function nativeInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('.cw-toggle-switch__input');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggles on native input change and emits through onChange', () => {
    const emitted: boolean[] = [];
    component.registerOnChange(v => emitted.push(v));

    nativeInput().click();
    fixture.detectChanges();

    expect(component.checked()).toBeTrue();
    expect(emitted).toEqual([true]);
    expect((fixture.nativeElement as HTMLElement).classList).toContain('cw-toggle-switch--checked');
  });

  it('writeValue updates state without emitting', () => {
    const emitted: boolean[] = [];
    component.registerOnChange(v => emitted.push(v));

    component.writeValue(true);
    fixture.detectChanges();

    expect(component.checked()).toBeTrue();
    expect(emitted).toEqual([]);
  });

  it('renders label and disables via setDisabledState', () => {
    fixture.componentRef.setInput('label', 'Notifications');
    component.setDisabledState(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.cw-toggle-switch__label').textContent.trim()).toBe('Notifications');
    expect(nativeInput().disabled).toBeTrue();
  });
});
