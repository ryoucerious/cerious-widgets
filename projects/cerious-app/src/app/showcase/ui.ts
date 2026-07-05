import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Copy-able code snippet block.
 */
@Component({
  selector: 'app-code-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="code-block">
      <button type="button" class="code-block__copy" (click)="copy()">{{ copied ? 'Copied ✓' : 'Copy' }}</button>
      <pre><code>{{ code }}</code></pre>
    </div>
  `,
  styles: [`
    .code-block {
      position: relative;
      margin-top: 0.5rem;
      border-radius: var(--cw-radius);
      background: var(--cw-surface-sunken);
      overflow: hidden;
    }
    .code-block__copy {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 3px 10px;
      font-size: 12px;
      font-family: var(--cw-font);
      color: var(--cw-text-muted);
      background: var(--cw-surface);
      border: 1px solid var(--cw-border);
      border-radius: var(--cw-radius);
      cursor: pointer;
    }
    .code-block__copy:hover { color: var(--cw-text); }
    pre {
      margin: 0;
      padding: 0.9rem 1rem;
      overflow-x: auto;
      font-size: 12.5px;
      line-height: 1.6;
      color: var(--cw-text);
      font-family: 'SF Mono', ui-monospace, 'Cascadia Code', Menlo, Consolas, monospace;
    }
  `]
})
export class CodeBlockComponent {
  @Input() code = '';
  copied = false;

  copy(): void {
    navigator.clipboard?.writeText(this.code);
    this.copied = true;
    setTimeout(() => (this.copied = false), 1500);
  }
}

/**
 * A single titled demo: description, a live preview, and its source snippet.
 */
@Component({
  selector: 'app-demo-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlockComponent],
  template: `
    <section class="demo-section">
      <h3 class="demo-section__title">{{ title }}</h3>
      @if (description) { <p class="demo-section__desc">{{ description }}</p> }
      <div class="demo-section__preview"><ng-content /></div>
      @if (code) { <app-code-block [code]="code" /> }
    </section>
  `,
  styles: [`
    .demo-section { margin-bottom: 2.25rem; }
    .demo-section__title { margin: 0 0 0.25rem; font-size: 1.05rem; font-weight: 600; color: var(--cw-text); }
    .demo-section__desc { margin: 0 0 0.9rem; color: var(--cw-text-muted); font-size: 0.9rem; line-height: 1.5; }
    .demo-section__preview {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
      padding: 1.75rem 1.5rem;
      border-radius: var(--cw-radius-lg);
      background: var(--cw-surface);
    }
  `]
})
export class DemoSectionComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() code = '';
}

/**
 * Page shell: a component's title, tagline, and its stacked demo sections.
 */
@Component({
  selector: 'app-demo-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="demo-page">
      <header class="demo-page__header">
        <h1 class="demo-page__title">{{ name }}</h1>
        @if (description) { <p class="demo-page__desc">{{ description }}</p> }
      </header>
      <ng-content />
    </article>
  `,
  styles: [`
    :host { display: block; padding: 1.75rem 2rem; }
    .demo-page { max-width: 920px; }
    .demo-page__header { margin-bottom: 2rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--cw-border); }
    .demo-page__title { margin: 0 0 0.4rem; font-size: 1.9rem; font-weight: 700; color: var(--cw-text); }
    .demo-page__desc { margin: 0; color: var(--cw-text-muted); font-size: 1rem; line-height: 1.6; max-width: 60ch; }
  `]
})
export class DemoPageComponent {
  @Input() name = '';
  @Input() description = '';
}
