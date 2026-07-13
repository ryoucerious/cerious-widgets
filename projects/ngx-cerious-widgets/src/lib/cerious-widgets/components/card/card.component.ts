import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/**
 * A content card: token surface, hairline border, soft shadow. Title and
 * subtitle come from inputs; header media, body and footer are projected
 * (`[cwCardHeader]`, default slot, `[cwCardFooter]`).
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-card title="Monthly Report" subtitle="June 2026">
 *   Revenue is up 14% month over month.
 *   <div cwCardFooter><button cwButton>View details</button></div>
 * </cw-card>
 */
@Component({
  selector: 'cw-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content select="[cwCardHeader]" />
    @if (title() || subtitle()) {
      <div class="cw-card__heading">
        @if (title()) { <div class="cw-card__title">{{ title() }}</div> }
        @if (subtitle()) { <div class="cw-card__subtitle">{{ subtitle() }}</div> }
      </div>
    }
    <div class="cw-card__body"><ng-content /></div>
    <div class="cw-card__footer"><ng-content select="[cwCardFooter]" /></div>
  `,
  styleUrl: './card.component.scss',
  host: { 'class': 'cw-card' }
})
export class CardComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ card: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('card', this.api);
  }

  /** The card heading. */
  readonly title = input<string>('');
  /** Muted line under the title. */
  readonly subtitle = input<string>('');
}
