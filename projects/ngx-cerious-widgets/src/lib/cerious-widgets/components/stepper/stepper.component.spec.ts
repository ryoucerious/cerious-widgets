import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepDirective, StepperComponent } from './stepper.component';

@Component({
  standalone: true,
  imports: [StepperComponent, StepDirective],
  template: `
    <cw-stepper [linear]="linear" (activeIndexChange)="active = $event">
      <ng-template cwStep label="Cart">Cart content</ng-template>
      <ng-template cwStep label="Payment">Payment content</ng-template>
      <ng-template cwStep label="Confirm">Confirm content</ng-template>
    </cw-stepper>
  `
})
class HostComponent {
  linear = false;
  active = 0;
}

describe('StepperComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function content(): string {
    return (fixture.nativeElement.querySelector('.cw-stepper__content') as HTMLElement).textContent!.trim();
  }
  function headerSteps(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-stepper__step'));
  }
  function nextBtn(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.cw-stepper__btn--primary');
  }
  function backBtn(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.cw-stepper__btn--secondary');
  }

  it('renders header labels and the first step content', () => {
    expect(headerSteps().map(s => s.querySelector('.cw-stepper__label')!.textContent!.trim())).toEqual(['Cart', 'Payment', 'Confirm']);
    expect(content()).toBe('Cart content');
    expect(backBtn().disabled).toBeTrue();
  });

  it('advances and retreats with Next / Back', () => {
    nextBtn().click();
    fixture.detectChanges();
    expect(content()).toBe('Payment content');
    expect(fixture.componentInstance.active).toBe(1);
    expect(headerSteps()[0].classList).toContain('cw-stepper__step--done');

    backBtn().click();
    fixture.detectChanges();
    expect(content()).toBe('Cart content');
  });

  it('disables Next on the last step', () => {
    nextBtn().click();
    nextBtn().click();
    fixture.detectChanges();
    expect(content()).toBe('Confirm content');
    expect(nextBtn().disabled).toBeTrue();
  });

  it('lets a non-linear stepper jump to any step via the header', () => {
    headerSteps()[2].click();
    fixture.detectChanges();
    expect(content()).toBe('Confirm content');
  });

  it('blocks header jumps ahead when linear but Next still advances one', () => {
    fixture.componentInstance.linear = true;
    fixture.detectChanges();

    // Clicking a far-ahead header step is blocked.
    headerSteps()[2].click();
    fixture.detectChanges();
    expect(content()).toBe('Cart content');

    // The Next button advances one step even in linear mode.
    nextBtn().click();
    fixture.detectChanges();
    expect(content()).toBe('Payment content');

    // Now the header can go back to a reached step.
    headerSteps()[0].click();
    fixture.detectChanges();
    expect(content()).toBe('Cart content');
  });
});
