import { A11yModule } from '@angular/cdk/a11y';
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DynamicDialogConfig } from './dynamic-dialog.config';

/**
 * Internal chrome for {@link DynamicDialogService}: a focus-trapped card with an
 * optional header/close button that hosts the opened component via a portal.
 * Not exported for direct use — the service instantiates it.
 *
 * It carries its own copy of the dialog-chrome styles (rather than reusing the
 * `cw-dialog` component's view-encapsulated styles) because it renders in the
 * CDK overlay, outside that component's scope. Class names match so the global
 * frost overrides in `_overlay.scss` still apply.
 */
@Component({
  selector: 'cw-dynamic-dialog-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A11yModule, CdkPortalOutlet],
  template: `
    <div
      class="cw-dialog__panel cw-dynamic-dialog__panel"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="config().header || null"
      [style.width]="config().width || '28rem'"
      cdkTrapFocus
      [cdkTrapFocusAutoCapture]="true"
    >
      @if (config().header) {
        <div class="cw-dialog__header">
          <span class="cw-dialog__title">{{ config().header }}</span>
          @if (config().closable !== false) {
            <button type="button" class="cw-dialog__close" aria-label="Close" (click)="closeClick.emit()">
              <span class="cw-dialog__close-x" aria-hidden="true"></span>
            </button>
          }
        </div>
      }
      <div class="cw-dialog__body">
        <ng-template [cdkPortalOutlet]="portal()" />
      </div>
    </div>
  `,
  styles: [`
    .cw-dialog__panel {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      max-width: calc(100vw - 2rem);
      max-height: calc(100vh - 4rem);
      background: var(--cw-surface);
      border: 1px solid var(--cw-border);
      border-radius: var(--cw-radius-lg);
      box-shadow: var(--cw-shadow-lg);
      font-family: var(--cw-font);
      color: var(--cw-text);
      overflow: hidden;
    }
    .cw-dialog__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 1rem 1.25rem 0.5rem;
    }
    .cw-dialog__title {
      font-size: 1rem;
      font-weight: 600;
    }
    .cw-dialog__close {
      all: unset;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: var(--cw-radius-sm);
      color: var(--cw-text-muted);
      cursor: pointer;
    }
    .cw-dialog__close:hover { background: var(--cw-surface-hover); color: var(--cw-text); }
    .cw-dialog__close:focus-visible { box-shadow: var(--cw-focus-ring); }
    .cw-dialog__close-x {
      position: relative;
      width: 10px;
      height: 10px;
    }
    .cw-dialog__close-x::before,
    .cw-dialog__close-x::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 1.5px;
      border-radius: 1px;
      background: currentColor;
    }
    .cw-dialog__close-x::before { transform: translateY(-50%) rotate(45deg); }
    .cw-dialog__close-x::after  { transform: translateY(-50%) rotate(-45deg); }
    .cw-dialog__body {
      padding: 0.25rem 1.25rem 1.25rem;
      font-size: 0.875rem;
      color: var(--cw-text-secondary);
      overflow-y: auto;
    }
  `],
  host: { 'class': 'cw-dialog' }
})
export class DynamicDialogContainer {
  readonly config = input.required<DynamicDialogConfig>();
  readonly portal = input.required<ComponentPortal<unknown>>();
  readonly closeClick = output<void>();
}
