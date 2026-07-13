import { ChangeDetectionStrategy, Component, input, TemplateRef, viewChild } from '@angular/core';

/**
 * One tab of a {@link DocPageComponent} (Features / API / Theming …). Its
 * projected content is wrapped in a template so the page can lazily render only
 * the active tab.
 */
@Component({
  selector: 'doc-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #content><ng-content /></ng-template>`
})
export class DocTabComponent {
  /** Tab label shown in the tab bar. */
  readonly label = input.required<string>();
  readonly content = viewChild.required<TemplateRef<unknown>>('content');
}
