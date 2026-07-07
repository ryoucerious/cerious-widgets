import { AfterContentInit, ChangeDetectionStrategy, Component, ElementRef, inject, input, signal } from '@angular/core';

/** Process-wide counter for generating unique control ids. */
let iftaLabelSeq = 0;

/**
 * "In-Filled Top-Aligned" label: a small label pinned to the top of the field,
 * with the control sitting below it inside the same bordered box. Unlike
 * {@link FloatLabelComponent} the label does not move — it is always shown.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-ifta-label label="Email">
 *   <input cwInput [(ngModel)]="email" />
 * </cw-ifta-label>
 */
@Component({
  selector: 'cw-ifta-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="cw-ifta-label__label" [attr.for]="controlId()">{{ label() }}</label>
    <ng-content />
  `,
  styleUrl: './ifta-label.component.scss',
  host: { 'class': 'cw-ifta-label' }
})
export class IftaLabelComponent implements AfterContentInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** The label text. */
  readonly label = input<string>('');

  /** Id of the projected control, so the `<label for>` names it for assistive tech. */
  protected readonly controlId = signal<string | null>(null);

  ngAfterContentInit(): void {
    const control = this.host.nativeElement.querySelector<HTMLElement>('input, textarea, select');
    if (!control) { return; }
    if (!control.id) { control.id = `cw-ifta-label-${++iftaLabelSeq}`; }
    this.controlId.set(control.id);
  }
}
