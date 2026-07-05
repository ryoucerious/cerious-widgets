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
    <label class="cw-float-label__label" [class.cw-float-label__label--floated]="floated()">{{ label() }}</label>
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
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** The label text. */
  readonly label = input<string>('');

  private readonly focused = signal(false);
  private readonly filled = signal(false);

  /** The label floats when the control is focused or holds a value. */
  readonly floated = computed(() => this.focused() || this.filled());

  ngAfterContentInit(): void {
    this.refreshFilled();
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
