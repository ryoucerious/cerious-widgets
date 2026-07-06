import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-editor-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EditorComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Editor" description="A lightweight rich-text editor: a formatting toolbar over a contenteditable region. The model is the HTML string.">
      <app-demo-section title="Basic" description="Select text and use the toolbar to format it." [code]="code">
        <div style="width: 100%; max-width: 34rem;">
          <cw-editor [(ngModel)]="html" placeholder="Write something..." />
          <p style="color: var(--cw-text-muted); font-size: 0.8125rem; margin-top: 0.5rem;">HTML length: {{ html.length }}</p>
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class EditorDemoComponent {
  html = '<p>Edit <b>this</b> text.</p>';

  code = `<cw-editor [(ngModel)]="html" placeholder="Write something..." />`;
}
