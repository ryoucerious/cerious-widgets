import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface ApiRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

/**
 * Renders API reference tables (Properties / Events / Methods) for a component
 * doc page from plain data.
 */
@Component({
  selector: 'doc-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (props().length) {
      <h3 class="doc-api__heading">Properties</h3>
      <div class="doc-api__scroll">
        <table class="doc-api__table">
          <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            @for (row of props(); track row.name) {
              <tr>
                <td><code>{{ row.name }}</code></td>
                <td><code class="doc-api__type">{{ row.type }}</code></td>
                <td>{{ row.default || '-' }}</td>
                <td>{{ row.description }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    @if (events().length) {
      <h3 class="doc-api__heading">Events</h3>
      <div class="doc-api__scroll">
        <table class="doc-api__table">
          <thead><tr><th>Name</th><th>Payload</th><th>Description</th></tr></thead>
          <tbody>
            @for (row of events(); track row.name) {
              <tr>
                <td><code>{{ row.name }}</code></td>
                <td><code class="doc-api__type">{{ row.type }}</code></td>
                <td>{{ row.description }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    @if (methods().length) {
      <h3 class="doc-api__heading">Methods</h3>
      <div class="doc-api__scroll">
        <table class="doc-api__table">
          <thead><tr><th>Signature</th><th>Returns</th><th>Description</th></tr></thead>
          <tbody>
            @for (row of methods(); track row.name) {
              <tr>
                <td><code>{{ row.name }}</code></td>
                <td><code class="doc-api__type">{{ row.type }}</code></td>
                <td>{{ row.description }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: [`
    .doc-api__heading { margin: 2rem 0 0.75rem; font-size: 1.1rem; font-weight: 650; color: var(--cw-text); }
    .doc-api__heading:first-child { margin-top: 0; }
    .doc-api__scroll { overflow-x: auto; border: 1px solid var(--cw-border); border-radius: var(--cw-radius-lg); }
    .doc-api__table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .doc-api__table th, .doc-api__table td {
      text-align: left; padding: 0.7rem 0.9rem; border-bottom: 1px solid var(--cw-border);
      vertical-align: top; color: var(--cw-text);
    }
    .doc-api__table th { background: var(--cw-surface-sunken, var(--cw-surface-2)); font-weight: 600; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .doc-api__table tr:last-child td { border-bottom: none; }
    .doc-api__table code { font-family: 'SF Mono', ui-monospace, Menlo, Consolas, monospace; font-size: 0.82rem; }
    .doc-api__type { color: var(--cw-primary); }
  `]
})
export class ApiTableComponent {
  readonly props = input<ApiRow[]>([]);
  readonly events = input<ApiRow[]>([]);
  readonly methods = input<ApiRow[]>([]);
}
