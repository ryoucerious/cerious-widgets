import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { StepDirective, StepperComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-stepper-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepperComponent, StepDirective, DocPageComponent, DocTabComponent, DocSectionComponent, ApiTableComponent, ThemingNotesComponent],
  template: `
    <doc-page slug="stepper">
      <doc-tab label="Features">
        <doc-section title="Linear wizard" description="A numbered header over each step's content, with Back / Next. Linear mode requires in-order progress." [code]="linearCode">
          <div style="max-width: 34rem;">
            <cw-stepper [linear]="true" (activeIndexChange)="active.set($event)">
              <ng-template cwStep label="Cart"><p>Review the items in your cart before continuing.</p></ng-template>
              <ng-template cwStep label="Shipping"><p>Enter your delivery address and preferred method.</p></ng-template>
              <ng-template cwStep label="Payment"><p>Provide your payment details securely.</p></ng-template>
              <ng-template cwStep label="Confirm"><p>All set, place your order!</p></ng-template>
            </cw-stepper>
            <p class="hint">Active step: {{ active() + 1 }} of 4</p>
          </div>
        </doc-section>

        <doc-section title="Free navigation" description="Without linear, any header can be clicked to jump straight to that step." [code]="freeCode">
          <div style="max-width: 30rem;">
            <cw-stepper>
              <ng-template cwStep label="Account"><p>Create your account.</p></ng-template>
              <ng-template cwStep label="Profile"><p>Tell us about yourself.</p></ng-template>
              <ng-template cwStep label="Done"><p>You're ready to go.</p></ng-template>
            </cw-stepper>
          </div>
        </doc-section>
      </doc-tab>

      <doc-tab label="API">
        <doc-api [props]="props" [events]="events" />
      </doc-tab>

      <doc-tab label="Theming">
        <doc-theming [tokens]="tokens" />
      </doc-tab>
    </doc-page>
  `,
  styles: [`.hint { margin-top: 0.75rem; color: var(--cw-text-muted, var(--cw-text-secondary)); font-size: 0.9rem; }`]
})
export class StepperDocComponent {
  readonly active = signal(0);

  linearCode = `<cw-stepper [linear]="true" (activeIndexChange)="active.set($event)">
  <ng-template cwStep label="Cart">…</ng-template>
  <ng-template cwStep label="Shipping">…</ng-template>
  <ng-template cwStep label="Payment">…</ng-template>
</cw-stepper>`;
  freeCode = `<cw-stepper>
  <ng-template cwStep label="Account">…</ng-template>
  <ng-template cwStep label="Profile">…</ng-template>
</cw-stepper>`;

  props = [
    { name: 'activeIndex', type: 'number', default: '0', description: 'Index of the current step.' },
    { name: 'linear', type: 'boolean', default: 'false', description: 'Require steps to be completed in order.' },
    { name: 'showControls', type: 'boolean', default: 'true', description: 'Show the Back / Next buttons.' },
    { name: 'cwStep (label)', type: 'string', default: `''`, description: 'Directive on each <ng-template>; label sets the header text.' },
    { name: 'cwStep (disabled)', type: 'boolean', default: 'false', description: 'Disable a step header.' }
  ];
  events = [{ name: 'activeIndexChange', type: 'number', description: 'Emitted when the active step changes.' }];
  tokens = [
    { token: '--cw-primary', description: 'Active/completed step marker & connector.' },
    { token: '--cw-surface', description: 'Step marker background.' },
    { token: '--cw-border', description: 'Inactive connectors.' }
  ];
}
