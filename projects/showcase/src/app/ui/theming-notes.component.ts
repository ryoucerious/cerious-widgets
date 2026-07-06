import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface TokenRow {
  token: string;
  description: string;
}

/**
 * Theming tab content: explains that the component is styled entirely with
 * `--cw-*` design tokens across the three themes, and lists the tokens it reads.
 */
@Component({
  selector: 'doc-theming',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="doc-theming__intro">
      Every cerious-widgets component is styled with <code>--cw-*</code> CSS custom properties — a
      three-layer token system (primitive → semantic → per-theme). Switch the theme in the top bar to
      preview <strong>Cerious Light</strong>, <strong>Frost</strong> (glassmorphism) and
      <strong>Dark</strong>. Override any token in your own stylesheet to re-skin without touching markup.
    </p>

    @if (tokens().length) {
      <h3 class="doc-theming__heading">Design tokens used</h3>
      <div class="doc-theming__scroll">
        <table class="doc-theming__table">
          <thead><tr><th>Token</th><th>Purpose</th></tr></thead>
          <tbody>
            @for (row of tokens(); track row.token) {
              <tr><td><code>{{ row.token }}</code></td><td>{{ row.description }}</td></tr>
            }
          </tbody>
        </table>
      </div>
    }

    <pre class="doc-theming__code"><code>{{ example }}</code></pre>
  `,
  styles: [`
    .doc-theming__intro { font-size: 1rem; line-height: 1.7; color: var(--cw-text); max-width: 62ch; margin: 0 0 1.5rem; }
    .doc-theming__intro code { color: var(--cw-primary); font-family: 'SF Mono', ui-monospace, Menlo, monospace; }
    .doc-theming__heading { margin: 1.5rem 0 0.75rem; font-size: 1.1rem; font-weight: 650; color: var(--cw-text); }
    .doc-theming__scroll { overflow-x: auto; border: 1px solid var(--cw-border); border-radius: var(--cw-radius-lg); }
    .doc-theming__table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .doc-theming__table th, .doc-theming__table td { text-align: left; padding: 0.7rem 0.9rem; border-bottom: 1px solid var(--cw-border); color: var(--cw-text); }
    .doc-theming__table th { background: var(--cw-surface-sunken, var(--cw-surface-2)); color: var(--cw-text-muted, var(--cw-text-secondary)); font-weight: 600; }
    .doc-theming__table tr:last-child td { border-bottom: none; }
    .doc-theming__table code { color: var(--cw-primary); font-family: 'SF Mono', ui-monospace, Menlo, monospace; font-size: 0.82rem; }
    .doc-theming__code {
      margin-top: 1.5rem; padding: 1rem 1.1rem; border-radius: var(--cw-radius-lg);
      background: var(--cw-surface-sunken, var(--cw-surface-2)); border: 1px solid var(--cw-border);
      overflow-x: auto; font-size: 12.5px; line-height: 1.6; color: var(--cw-text);
      font-family: 'SF Mono', ui-monospace, Menlo, Consolas, monospace;
    }
  `]
})
export class ThemingNotesComponent {
  readonly tokens = input<TokenRow[]>([]);

  readonly example = `/* Re-skin a component by overriding tokens in your app: */
:root {
  --cw-primary: #7c3aed;
  --cw-radius-md: 12px;
}`;
}
