import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldsetComponent } from './fieldset.component';

@Component({
  standalone: true,
  imports: [FieldsetComponent],
  template: `
    <cw-fieldset legend="Billing" [toggleable]="toggleable" (collapsedChange)="collapsed = $event">
      Card details go here.
    </cw-fieldset>
  `
})
class HostComponent {
  toggleable = false;
  collapsed = false;
}

describe('FieldsetComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function fieldset(): HTMLElement {
    return fixture.nativeElement.querySelector('cw-fieldset');
  }

  it('renders the legend and content', () => {
    expect(fieldset().querySelector('.cw-fieldset__legend-text')!.textContent!.trim()).toBe('Billing');
    expect(fieldset().querySelector('.cw-fieldset__content')!.textContent!.trim()).toBe('Card details go here.');
  });

  it('is not toggleable by default', () => {
    expect(fieldset().querySelector('.cw-fieldset__toggle')).toBeNull();
  });

  it('collapses and expands when toggleable', () => {
    fixture.componentInstance.toggleable = true;
    fixture.detectChanges();

    expect(fieldset().querySelector('.cw-fieldset__content')).toBeTruthy();

    (fieldset().querySelector('.cw-fieldset__toggle') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fieldset().querySelector('.cw-fieldset__content')).toBeNull();
    expect(fixture.componentInstance.collapsed).toBeTrue();

    (fieldset().querySelector('.cw-fieldset__toggle') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fieldset().querySelector('.cw-fieldset__content')).toBeTruthy();
  });
});
