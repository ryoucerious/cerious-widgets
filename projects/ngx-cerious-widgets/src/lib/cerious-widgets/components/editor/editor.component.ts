import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  input,
  signal,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** A toolbar command. */
interface CwEditorTool {
  command: string;
  value?: string;
  label: string;
  title: string;
}

/**
 * A lightweight rich-text editor: a formatting toolbar over a
 * `contenteditable` region. The model is the HTML string.
 *
 * Implements {@link ControlValueAccessor} (works with `ngModel` / reactive
 * forms), is signal-based and OnPush, and is styled with `--cw-*` tokens.
 *
 * @example
 * <cw-editor [(ngModel)]="html" placeholder="Write something..." />
 */
@Component({
  selector: 'cw-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
  host: {
    'class': 'cw-editor',
    '[class.cw-editor--disabled]': 'disabledInput()'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => EditorComponent), multi: true }
  ]
})
export class EditorComponent implements ControlValueAccessor {
  @ViewChild('area', { static: true }) private area!: ElementRef<HTMLElement>;

  /** Placeholder shown while empty. */
  readonly placeholder = input<string>('');
  /** Disable editing (also settable via forms `setDisabledState`). */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly isEmpty = signal(true);
  private cvaDisabled = false;

  readonly tools: CwEditorTool[] = [
    { command: 'bold', label: 'B', title: 'Bold' },
    { command: 'italic', label: 'I', title: 'Italic' },
    { command: 'underline', label: 'U', title: 'Underline' },
    { command: 'insertUnorderedList', label: '•', title: 'Bulleted list' },
    { command: 'insertOrderedList', label: '1.', title: 'Numbered list' }
  ];

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  // --- ControlValueAccessor ---
  writeValue(value: unknown): void {
    const html = value == null ? '' : String(value);
    this.area.nativeElement.innerHTML = html;
    this.refreshEmpty();
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled = isDisabled;
    this.area.nativeElement.contentEditable = String(!isDisabled && !this.disabledInput());
  }

  get editable(): boolean {
    return !this.cvaDisabled && !this.disabledInput();
  }

  exec(tool: CwEditorTool): void {
    if (!this.editable) {
      return;
    }
    this.area.nativeElement.focus();
    // execCommand is deprecated but remains the pragmatic path for a small
    // contenteditable editor with no external dependency.
    document.execCommand(tool.command, false, tool.value);
    this.emit();
  }

  isActive(tool: CwEditorTool): boolean {
    try {
      return document.queryCommandState(tool.command);
    } catch {
      return false;
    }
  }

  onInput(): void {
    this.emit();
  }

  private emit(): void {
    this.refreshEmpty();
    this.onChange(this.area.nativeElement.innerHTML);
  }

  private refreshEmpty(): void {
    const text = this.area.nativeElement.textContent ?? '';
    this.isEmpty.set(text.trim().length === 0);
  }
}
