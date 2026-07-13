import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let fixture: ComponentFixture<CheckboxComponent>;
  let component: CheckboxComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CheckboxComponent, FormsModule] }).compileComponents();
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function nativeInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('.cw-checkbox__input');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the label', () => {
    fixture.componentRef.setInput('label', 'Remember me');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cw-checkbox__label').textContent.trim()).toBe('Remember me');
  });

  it('toggles on native input change and emits through onChange', () => {
    const emitted: boolean[] = [];
    component.registerOnChange(v => emitted.push(v));

    nativeInput().click();
    fixture.detectChanges();

    expect(component.checked()).toBeTrue();
    expect(emitted).toEqual([true]);
    expect((fixture.nativeElement as HTMLElement).classList).toContain('cw-checkbox--checked');
  });

  it('writeValue updates checked state without emitting', () => {
    const emitted: boolean[] = [];
    component.registerOnChange(v => emitted.push(v));

    component.writeValue(true);
    fixture.detectChanges();

    expect(component.checked()).toBeTrue();
    expect(emitted).toEqual([]);
  });

  it('disables via input and via setDisabledState', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(nativeInput().disabled).toBeTrue();

    fixture.componentRef.setInput('disabled', false);
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(nativeInput().disabled).toBeTrue();
  });

  it('shows the indeterminate dash until the user interacts', () => {
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.cw-checkbox__dash'))).toBeTruthy();

    nativeInput().click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.cw-checkbox__dash'))).toBeNull();
    expect(component.checked()).toBeTrue();
  });
});
