import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  viewChild
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';
import { WidgetPlugin } from '../../shared/interfaces/widget-plugin.interface';

/** Public API the Tabs exposes to its plugins. */
export interface TabsApi extends CwWidgetApi {
  /** The index of the active tab. */
  getActiveIndex(): number;
  /** Activate a tab by index. */
  setActiveIndex(index: number): void;
}
/** Plugin contract for the Tabs (`{ tabs: { plugins: [...] } }`). */
export type TabsPlugin = WidgetPlugin<TabsApi>;

/**
 * One tab inside `cw-tabs`: a label plus lazily-rendered projected content
 * (only the active tab's content is in the DOM).
 */
@Component({
  selector: 'cw-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #content><ng-content /></ng-template>`
})
export class TabComponent {
  /** The tab header label. */
  readonly label = input<string>('');
  /** Disable selecting this tab. */
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly content = viewChild.required<TemplateRef<unknown>>('content');
}

/**
 * A tabbed container: a header row of tab buttons (active tab gets the
 * primary underline, like the mock) over the active tab's content.
 * Keyboard: Left/Right move between enabled tabs.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-tabs>
 *   <cw-tab label="Active">…</cw-tab>
 *   <cw-tab label="Inactive">…</cw-tab>
 * </cw-tabs>
 */
@Component({
  selector: 'cw-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  host: { 'class': 'cw-tabs' }
})
export class TabsComponent {
  /** Index of the initially active tab. */
  readonly activeIndex = input(0);
  /** Emitted when the user activates a tab. */
  readonly activeIndexChange = output<number>();

  readonly tabs = contentChildren(TabComponent);

  private readonly userIndex = signal<number | undefined>(undefined);
  readonly currentIndex = computed(() => this.userIndex() ?? this.activeIndex());
  readonly activeTab = computed(() => this.tabs()[this.currentIndex()]);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins. */
  readonly api: TabsApi = {
    getHost: () => this.host.nativeElement,
    getActiveIndex: () => this.currentIndex(),
    setActiveIndex: (index: number) => this.select(index)
  };

  constructor() {
    providePluginHost('tabs', this.api);
  }

  select(index: number): void {
    if (index === this.currentIndex() || this.tabs()[index]?.disabled()) {
      return;
    }
    this.userIndex.set(index);
    this.activeIndexChange.emit(index);
  }

  onKeydown(event: KeyboardEvent): void {
    const dir = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) {
      return;
    }
    event.preventDefault();
    const tabs = this.tabs();
    let i = this.currentIndex();
    for (let step = 0; step < tabs.length; step++) {
      i = (i + dir + tabs.length) % tabs.length;
      if (!tabs[i].disabled()) {
        this.select(i);
        break;
      }
    }
  }
}
