import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

/** A copy-able code snippet block. */
@Component({
  selector: 'doc-code',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doc-code">
      <button type="button" class="doc-code__copy" (click)="copy()">{{ copied() ? 'Copied ✓' : 'Copy' }}</button>
      <pre><code>{{ code() }}</code></pre>
    </div>
  `,
  styles: [`
    .doc-code {
      position: relative;
      margin-top: 0.75rem;
      border-radius: var(--cw-radius-lg);
      background: var(--cw-surface-sunken, var(--cw-surface-2));
      border: 1px solid var(--cw-border);
      overflow: hidden;
    }
    .doc-code__copy {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 3px 10px;
      font-size: 12px;
      font-family: var(--cw-font);
      color: var(--cw-text-muted, var(--cw-text-secondary));
      background: var(--cw-surface);
      border: 1px solid var(--cw-border);
      border-radius: var(--cw-radius);
      cursor: pointer;
    }
    .doc-code__copy:hover { color: var(--cw-text); }
    pre {
      margin: 0;
      padding: 1rem 1.1rem;
      overflow-x: auto;
      font-size: 12.5px;
      line-height: 1.65;
      color: var(--cw-text);
      font-family: 'SF Mono', ui-monospace, 'Cascadia Code', Menlo, Consolas, monospace;
    }
  `]
})
export class CodeBlockComponent {
  readonly code = input('');
  readonly copied = signal(false);

  copy(): void {
    navigator.clipboard?.writeText(this.code());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }
}
