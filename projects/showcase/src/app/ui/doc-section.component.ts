import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CodeBlockComponent } from './code-block.component';

/**
 * A single documented example: a heading, optional description, a live preview
 * (projected content) and an optional code snippet.
 */
@Component({
  selector: 'doc-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlockComponent],
  template: `
    <section class="doc-section" [id]="anchor()">
      <div class="doc-section__head">
        <h3 class="doc-section__title">{{ title() }}</h3>
        @if (description()) { <p class="doc-section__desc">{{ description() }}</p> }
      </div>
      <div class="doc-section__preview">
        <ng-content />
      </div>
      @if (code()) { <doc-code [code]="code()" /> }
    </section>
  `,
  styles: [`
    .doc-section { margin: 0 0 2.5rem; scroll-margin-top: 5rem; }
    .doc-section__head { margin-bottom: 1rem; }
    .doc-section__title { margin: 0; font-size: 1.15rem; font-weight: 650; color: var(--cw-text); }
    .doc-section__desc { margin: 0.35rem 0 0; color: var(--cw-text-muted, var(--cw-text-secondary)); font-size: 0.925rem; line-height: 1.6; max-width: 60ch; }
    .doc-section__preview {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
      padding: 2rem;
      border: 1px solid var(--cw-border);
      border-radius: var(--cw-radius-lg);
      background: var(--cw-surface);
    }
  `]
})
export class DocSectionComponent {
  readonly title = input('');
  readonly description = input('');
  readonly code = input('');
  readonly anchor = input('');
}
