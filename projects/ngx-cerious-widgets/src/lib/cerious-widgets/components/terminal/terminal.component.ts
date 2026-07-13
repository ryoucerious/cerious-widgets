import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  ViewChild
} from '@angular/core';
import { providePluginHost } from '../../shared/plugin-host';
import { CwWidgetApi } from '../../shared/interfaces/widget-api.interface';

/** One line in the terminal log. */
export interface CwTerminalLine {
  kind: 'command' | 'response';
  text: string;
}

/**
 * A command-line interface: a prompt input over a scrolling output log. Emit
 * on `command`, then append the result with `write()` — or pass a `handler`
 * that returns the response for each command.
 *
 * Signal-based and OnPush (zoneless-safe), styled with `--cw-*` tokens.
 *
 * @example
 * <cw-terminal prompt="$" [handler]="run" />
 */
@Component({
  selector: 'cw-terminal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss',
  host: { 'class': 'cw-terminal', '(click)': 'focusInput()' }
})
export class TerminalComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Public API handed to plugins (`{ terminal: { plugins: [...] } }`). */
  readonly api: CwWidgetApi = { getHost: () => this.host.nativeElement };

  constructor() {
    providePluginHost('terminal', this.api);
  }

  @ViewChild('input', { static: true }) private inputEl!: ElementRef<HTMLInputElement>;
  @ViewChild('log', { static: true }) private logEl!: ElementRef<HTMLElement>;

  /** The prompt symbol shown before the input. */
  readonly prompt = input<string>('$');
  /** Optional synchronous handler: returns the response text for a command. */
  readonly handler = input<((command: string) => string | void) | null>(null);
  /** Greeting line shown at the top. */
  readonly welcome = input<string>('');

  /** Emitted for every entered command. */
  readonly command = output<string>();

  readonly lines = signal<CwTerminalLine[]>([]);

  onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }
    const command = this.inputEl.nativeElement.value.trim();
    this.inputEl.nativeElement.value = '';
    if (!command) {
      return;
    }
    this.append({ kind: 'command', text: command });
    this.command.emit(command);
    const handler = this.handler();
    if (handler) {
      const response = handler(command);
      if (response != null) {
        this.write(response);
      }
    }
  }

  /** Append a response line to the log. */
  write(text: string): void {
    this.append({ kind: 'response', text });
  }

  /** Clear the log. */
  clear(): void {
    this.lines.set([]);
  }

  focusInput(): void {
    this.inputEl.nativeElement.focus();
  }

  private append(line: CwTerminalLine): void {
    this.lines.update(list => [...list, line]);
    queueMicrotask(() => {
      const el = this.logEl.nativeElement;
      el.scrollTop = el.scrollHeight;
    });
  }
}
