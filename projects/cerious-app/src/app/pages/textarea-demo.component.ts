import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextareaDirective } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-textarea-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextareaDirective, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Textarea" description="Token-styles a native textarea; with autoResize it grows to fit its content.">
      <app-demo-section title="Basic" [code]="basicCode">
        <textarea cwTextarea rows="3" placeholder="Write a note..." [(ngModel)]="note" style="width: 100%; max-width: 28rem;"></textarea>
      </app-demo-section>

      <app-demo-section title="Auto-resize" description="Grows as you type, up to 8 rows." [code]="autoCode">
        <textarea cwTextarea autoResize [maxRows]="8" rows="2" placeholder="Type several lines..." style="width: 100%; max-width: 28rem;"></textarea>
      </app-demo-section>
    </app-demo-page>
  `
})
export class TextareaDemoComponent {
  note = '';

  basicCode = `<textarea cwTextarea rows="3" [(ngModel)]="note"></textarea>`;
  autoCode = `<textarea cwTextarea autoResize [maxRows]="8" rows="2"></textarea>`;
}
