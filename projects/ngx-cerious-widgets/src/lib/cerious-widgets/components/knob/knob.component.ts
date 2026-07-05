import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  numberAttribute,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * A circular dial input: drag around the arc or use the arrow keys to set a
 * value between `min` and `max`. The centre shows the value (or a template).
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-knob [(ngModel)]="volume" [min]="0" [max]="100" />
 */
@Component({
  selector: 'cw-knob',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './knob.component.html',
  styleUrl: './knob.component.scss',
  host: {
    'class': 'cw-knob',
    'role': 'slider',
    'tabindex': '0',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-valuemin]': 'min()',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[class.cw-knob--disabled]': 'isDisabled()',
    '(keydown)': 'onKeydown($event)',
    '(pointerdown)': 'onPointerDown($event)'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => KnobComponent), multi: true }
  ]
})
export class KnobComponent implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Minimum value. */
  readonly min = input(0, { transform: numberAttribute });
  /** Maximum value. */
  readonly max = input(100, { transform: numberAttribute });
  /** Step for keyboard changes. */
  readonly step = input(1, { transform: numberAttribute });
  /** Diameter in px. */
  readonly size = input(96, { transform: numberAttribute });
  /** Arc stroke width in px. */
  readonly strokeWidth = input(8, { transform: numberAttribute });
  /** Show the numeric value in the centre. */
  readonly showValue = input(true, { transform: booleanAttribute });
  /** `printf`-style template for the centre label; `{value}` is replaced. */
  readonly valueTemplate = input<string>('{value}');
  /** Disable the control (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly value = signal(0);
  private readonly cvaDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());

  // The arc spans 270° (from 135° to 405°), leaving a gap at the bottom.
  private readonly startAngle = 135;
  private readonly sweep = 270;

  readonly radius = computed(() => (this.size() - this.strokeWidth()) / 2);
  readonly center = computed(() => this.size() / 2);
  readonly circumference = computed(() => 2 * Math.PI * this.radius());

  readonly percent = computed(() => {
    const range = this.max() - this.min();
    return range <= 0 ? 0 : (this.clamp(this.value()) - this.min()) / range;
  });

  /** dash offset that reveals only the `sweep`-fraction of the ring, filled to `percent`. */
  readonly trackDash = computed(() => `${(this.sweep / 360) * this.circumference()} ${this.circumference()}`);
  readonly rangeDash = computed(() => `${(this.sweep / 360) * this.percent() * this.circumference()} ${this.circumference()}`);
  /** Rotate the ring so its gap sits at the bottom. */
  readonly ringTransform = computed(() => `rotate(${this.startAngle} ${this.center()} ${this.center()})`);

  readonly label = computed(() => this.valueTemplate().replace('{value}', String(this.clamp(this.value()))));

  onChange: (value: number) => void = () => {};
  onTouched: () => void = () => {};

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    this.value.set(typeof value === 'number' && Number.isFinite(value) ? value : this.min());
  }
  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) {
      return;
    }
    const delta =
      event.key === 'ArrowRight' || event.key === 'ArrowUp' ? this.step() :
      event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -this.step() :
      event.key === 'Home' ? this.min() - this.value() :
      event.key === 'End' ? this.max() - this.value() : 0;
    if (delta !== 0 || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      this.commit(this.clamp(this.value() + delta));
    }
  }

  onPointerDown(event: PointerEvent): void {
    if (this.isDisabled()) {
      return;
    }
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
    this.updateFromPointer(event);
    const move = (e: PointerEvent) => this.updateFromPointer(e);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      this.onTouched();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  private updateFromPointer(event: PointerEvent): void {
    const rect = this.host.nativeElement.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // Angle from the positive x-axis, clockwise, with 0 at the top.
    let angle = (Math.atan2(event.clientY - cy, event.clientX - cx) * 180) / Math.PI;
    angle = (angle - this.startAngle + 360 + 90) % 360; // normalise into the arc's frame
    // Map only the sweep region; clamp the dead zone at the bottom.
    const fraction = Math.min(Math.max(angle / this.sweep, 0), 1);
    const next = this.min() + fraction * (this.max() - this.min());
    this.commit(this.clamp(Math.round(next / this.step()) * this.step()));
  }

  private commit(next: number): void {
    if (next !== this.value()) {
      this.value.set(next);
      this.onChange(next);
    }
  }

  private clamp(value: number): number {
    return Math.min(Math.max(value, this.min()), this.max());
  }
}
