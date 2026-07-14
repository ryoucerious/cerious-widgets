import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-select-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, SelectComponent, DocPageComponent, DocTabComponent, DocSectionComponent, ApiTableComponent, ThemingNotesComponent],
  template: `
    <doc-page slug="select">
      <doc-tab label="Features">
        <doc-section title="Basic" description="Bind with ngModel. Keyboard: ↑ ↓ to move, Enter to select, Esc to close." [code]="basicCode">
          <cw-select [options]="cities" [(ngModel)]="city" optionLabel="name" optionValue="code" placeholder="Select a city" aria-label="City" />
          <p class="hint">Value: {{ city ?? ', ' }}</p>
        </doc-section>

        <doc-section title="Primitive options" description="Options may be plain strings or numbers." [code]="primitiveCode">
          <cw-select [options]="sizes" [(ngModel)]="size" placeholder="Size" style="min-width: 9rem;" aria-label="Size" />
        </doc-section>

        <doc-section title="Disabled" [code]="disabledCode">
          <cw-select [options]="sizes" disabled placeholder="Disabled" style="min-width: 9rem;" aria-label="Size (disabled)" />
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
  styles: [`.hint { margin-top: 0.6rem; color: var(--cw-text-muted, var(--cw-text-secondary)); font-size: 0.9rem; }`]
})
export class SelectDocComponent {
  city: string | null = null;
  size = 'M';
  readonly cities = [
    { name: 'Berlin', code: 'BER' }, { name: 'London', code: 'LON' },
    { name: 'New York', code: 'NYC' }, { name: 'Tokyo', code: 'TYO' }
  ];
  readonly sizes = ['S', 'M', 'L', 'XL'];

  basicCode = `<cw-select [options]="cities" optionLabel="name" optionValue="code"
  [(ngModel)]="city" placeholder="Select a city" />`;
  primitiveCode = `<cw-select [options]="['S','M','L','XL']" [(ngModel)]="size" />`;
  disabledCode = `<cw-select [options]="sizes" disabled />`;

  props = [
    { name: 'options', type: 'unknown[]', default: '[]', description: 'Option objects or primitives.' },
    { name: 'optionLabel', type: 'string', default: `'label'`, description: 'Object key used as the display label.' },
    { name: 'optionValue', type: 'string', default: `'value'`, description: 'Object key used as the bound value.' },
    { name: 'placeholder', type: 'string', default: `'Select'`, description: 'Empty-state text.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the control.' }
  ];
  events = [{ name: 'ngModelChange', type: 'unknown', description: 'Emitted when the selection changes.' }];
  tokens = [
    { token: '--cw-surface', description: 'Trigger & panel background.' },
    { token: '--cw-primary', description: 'Selected/active option + focus accent.' },
    { token: '--cw-surface-hover', description: 'Option hover state.' }
  ];
}
