import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-button-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, DocPageComponent, DocTabComponent, DocSectionComponent, ApiTableComponent, ThemingNotesComponent],
  template: `
    <doc-page slug="button">
      <doc-tab label="Features">
        <doc-section title="Severities" description="Semantic colour intents for every action." [code]="severityCode">
          <div class="row">
            <button cwButton>Primary</button>
            <button cwButton severity="secondary">Secondary</button>
            <button cwButton severity="success">Success</button>
            <button cwButton severity="warn">Warn</button>
            <button cwButton severity="danger">Danger</button>
          </div>
        </doc-section>

        <doc-section title="Variants" description="Filled, outlined and text emphasis levels." [code]="variantCode">
          <div class="row">
            <button cwButton>Filled</button>
            <button cwButton variant="outlined">Outlined</button>
            <button cwButton variant="text">Text</button>
          </div>
        </doc-section>

        <doc-section title="Sizes" [code]="sizeCode">
          <div class="row row--center">
            <button cwButton size="small">Small</button>
            <button cwButton>Normal</button>
            <button cwButton size="large">Large</button>
          </div>
        </doc-section>

        <doc-section title="Loading & disabled" description="Bind loading to reflect an in-flight action." [code]="loadingCode">
          <div class="row">
            <button cwButton [loading]="busy()" (click)="run()">{{ busy() ? 'Saving…' : 'Save' }}</button>
            <button cwButton disabled>Disabled</button>
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
  styles: [`.row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; } .row--center { align-items: center; }`]
})
export class ButtonDocComponent {
  readonly busy = signal(false);
  run(): void {
    this.busy.set(true);
    setTimeout(() => this.busy.set(false), 1400);
  }

  severityCode = `<button cwButton>Primary</button>
<button cwButton severity="secondary">Secondary</button>
<button cwButton severity="success">Success</button>
<button cwButton severity="warn">Warn</button>
<button cwButton severity="danger">Danger</button>`;

  variantCode = `<button cwButton>Filled</button>
<button cwButton variant="outlined">Outlined</button>
<button cwButton variant="text">Text</button>`;

  sizeCode = `<button cwButton size="small">Small</button>
<button cwButton>Normal</button>
<button cwButton size="large">Large</button>`;

  loadingCode = `<button cwButton [loading]="busy()" (click)="run()">
  {{ busy() ? 'Saving…' : 'Save' }}
</button>`;

  props = [
    { name: 'severity', type: `'primary' | 'secondary' | 'success' | 'warn' | 'danger'`, default: `'primary'`, description: 'Semantic colour intent.' },
    { name: 'variant', type: `'filled' | 'outlined' | 'text'`, default: `'filled'`, description: 'Visual emphasis.' },
    { name: 'size', type: `'small' | 'normal' | 'large'`, default: `'normal'`, description: 'Control size.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows an inline spinner and blocks clicks.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Native disabled state.' },
    { name: 'icon', type: 'string', default: `''`, description: 'Optional leading icon class.' }
  ];
  events = [
    { name: 'click', type: 'MouseEvent', description: 'Native click (suppressed while loading/disabled).' }
  ];
  tokens = [
    { token: '--cw-primary', description: 'Filled background & outlined/text accent.' },
    { token: '--cw-primary-contrast', description: 'Filled label colour.' },
    { token: '--cw-radius', description: 'Corner radius.' },
    { token: '--cw-focus-ring', description: 'Keyboard focus outline.' }
  ];
}
