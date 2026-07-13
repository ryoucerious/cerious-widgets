import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TerminalComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-terminal-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TerminalComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="terminal"><doc-tab label="Features">
      <doc-section title="Try it" description="Type a command (try: help, date, echo hi, clear) and press Enter." [code]="code">
        <div style="width: 100%; max-width: 34rem;">
          <cw-terminal prompt="cerious $" welcome="Welcome — type 'help' to get started." [handler]="run" />
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class TerminalDocComponent {
  readonly apiProps = [
    { name: "prompt", type: "string", default: "'$'", description: "The prompt symbol shown before the input." },
    { name: "welcome", type: "string", default: "''", description: "Greeting line shown at the top." }
  ];
  readonly apiEvents = [
    { name: "command", type: "string", description: "Emitted for every entered command." }
  ];
  readonly themeTokens = [
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-radius", description: "Corner radius." }
  ];

  run = (command: string): string => {
    const [cmd, ...args] = command.split(' ');
    switch (cmd) {
      case 'help': return 'Commands: help, date, echo <text>, whoami';
      case 'date': return new Date().toString();
      case 'echo': return args.join(' ');
      case 'whoami': return 'cerious-widgets user';
      default: return `command not found: ${cmd}`;
    }
  };

  code = `run = (command: string): string => {
  // return the response text for the command
};

<cw-terminal prompt="$" [handler]="run" />`;
}
