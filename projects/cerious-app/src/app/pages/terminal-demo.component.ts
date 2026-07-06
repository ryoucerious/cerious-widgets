import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TerminalComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-terminal-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TerminalComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Terminal" description="A command-line interface: a prompt input over a scrolling output log. Pass a handler that returns each command's response.">
      <app-demo-section title="Try it" description="Type a command (try: help, date, echo hi, clear) and press Enter." [code]="code">
        <div style="width: 100%; max-width: 34rem;">
          <cw-terminal prompt="cerious $" welcome="Welcome — type 'help' to get started." [handler]="run" />
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class TerminalDemoComponent {
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
