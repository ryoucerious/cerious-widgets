import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/** Process-wide counter for generating unique control ids. */
let floatLabelSeq = 0;

/**
 * Wraps a form control with a label that sits inside the field, then floats up
 * when the control is focused or has a value.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-float-label label="Email">
 *   <input cwInput [(ngModel)]="email" />
 * </cw-float-label>
 */
@Component({
  selector: 'cw-float-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
    <label class="cw-float-label__label" [class.cw-float-label__label--floated]="floated()"
           [attr.for]="controlId()">{{ label() }}</label>
  `,
  styleUrl: './float-label.component.scss',
  host: {
    'class': 'cw-float-label',
    '[class.cw-float-label--floated]': 'floated()',
    '(focusin)': 'onFocus(true)',
    '(focusout)': 'onFocus(false)',
    '(input)': 'refreshFilled()',
    '(change)': 'refreshFilled()'
  }
})
export class FloatLabelComponent implements AfterContentInit {
  /** Public API handed to plugins (`{ floatLabel: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('floatLabel', this.api);
  }

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** The label text. */
  readonly label = input<string>('');

  private readonly focused = signal(false);
  private readonly filled = signal(false);
  /** Id of the projected control, so the `<label for>` names it for assistive tech. */
  protected readonly controlId = signal<string | null>(null);

  /** The label floats when the control is focused or holds a value. */
  readonly floated = computed(() => this.focused() || this.filled());

  ngAfterContentInit(): void {
    this.linkLabel();
    this.refreshFilled();
    // A projected `[(ngModel)]` often writes the control's initial value *after*
    // this hook (during the parent's first change-detection pass), so the value
    // read above can still be empty — leaving the label unfloated on top of the
    // pre-filled control. Re-check once the microtask queue drains; the `filled`
    // signal write schedules change detection under zoneless.
    queueMicrotask(() => this.refreshFilled());
  }

  /** Associate the label with the projected control, assigning an id if it lacks one. */
  private linkLabel(): void {
    const control = this.host.nativeElement.querySelector<HTMLElement>('input, textarea, select');
    if (!control) { return; }
    if (!control.id) { control.id = `cw-float-label-${++floatLabelSeq}`; }
    this.controlId.set(control.id);
  }

  onFocus(focused: boolean): void {
    this.focused.set(focused);
    if (!focused) {
      this.refreshFilled();
    }
  }

  refreshFilled(): void {
    const control = this.host.nativeElement.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      'input, textarea, select'
    );
    this.filled.set(!!control && control.value != null && control.value !== '');
  }
}
