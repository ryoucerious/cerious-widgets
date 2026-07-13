import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  numberAttribute,
  output,
  signal
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/** A SpeedDial action. */
export interface CwSpeedDialItem {
  label: string;
  icon?: string;
  disabled?: boolean;
  command?: () => void;
}

/** Direction the actions fan out from the trigger. */
export type CwSpeedDialDirection = 'up' | 'down' | 'left' | 'right';

/**
 * A floating action button that fans out a set of actions when opened.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-speed-dial [items]="[{ label: 'New' }, { label: 'Share' }]" />
 */
@Component({
  selector: 'cw-speed-dial',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './speed-dial.component.html',
  styleUrl: './speed-dial.component.scss',
  host: {
    'class': 'cw-speed-dial',
    '[attr.data-direction]': 'direction()',
    '[class.cw-speed-dial--open]': 'isOpen()'
  }
})
export class SpeedDialComponent {
  /** Public API handed to plugins (`{ speedDial: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('speedDial', this.api);
  }

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** The actions. */
  readonly items = input<readonly CwSpeedDialItem[]>([]);
  /** Fan-out direction. */
  readonly direction = input<CwSpeedDialDirection>('up');
  /** Gap between fanned actions in px. */
  readonly gap = input(56, { transform: numberAttribute });
  /** Disable the whole dial. */
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Emitted when an action is activated. */
  readonly itemClick = output<CwSpeedDialItem>();

  readonly isOpen = signal(false);

  /** Per-item translate offset when open. */
  readonly offset = computed(() => (index: number) => {
    const distance = (index + 1) * this.gap();
    switch (this.direction()) {
      case 'up': return `translateY(-${distance}px)`;
      case 'down': return `translateY(${distance}px)`;
      case 'left': return `translateX(-${distance}px)`;
      case 'right': return `translateX(${distance}px)`;
    }
  });

  toggle(): void {
    if (!this.disabled()) {
      this.isOpen.update(v => !v);
    }
  }

  activate(item: CwSpeedDialItem): void {
    if (item.disabled) {
      return;
    }
    item.command?.();
    this.itemClick.emit(item);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.host.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    this.isOpen.set(false);
  }
}
