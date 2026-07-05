import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A horizontal action bar with start / center / end slots
 * (`[cwToolbarStart]`, `[cwToolbarCenter]`, `[cwToolbarEnd]`).
 *
 * Styled with `--cw-*` tokens.
 *
 * @example
 * <cw-toolbar>
 *   <div cwToolbarStart><button cwButton>New</button></div>
 *   <div cwToolbarEnd><button cwButton severity="secondary" variant="outlined">Export</button></div>
 * </cw-toolbar>
 */
@Component({
  selector: 'cw-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cw-toolbar__section cw-toolbar__start"><ng-content select="[cwToolbarStart]" /></div>
    <div class="cw-toolbar__section cw-toolbar__center"><ng-content select="[cwToolbarCenter]" /></div>
    <div class="cw-toolbar__section cw-toolbar__end"><ng-content select="[cwToolbarEnd]" /></div>
  `,
  styleUrl: './toolbar.component.scss',
  host: { 'class': 'cw-toolbar', 'role': 'toolbar' }
})
export class ToolbarComponent {}
