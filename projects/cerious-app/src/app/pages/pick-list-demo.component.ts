import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PickListComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-pick-list-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PickListComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="PickList" description="A dual-list transfer control — move items between an available and a selected list. Large lists are virtualized with ngx-cerious-scroll.">
      <app-demo-section title="Basic" [code]="basicCode">
        <cw-pick-list [options]="roles" sourceHeader="Available roles" targetHeader="Assigned" [(ngModel)]="assigned" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Assigned: {{ assigned.join(', ') || '—' }}</span>
      </app-demo-section>

      <app-demo-section title="500 items — virtualized" [code]="virtualCode">
        <cw-pick-list [options]="many" [(ngModel)]="manyTarget" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class PickListDemoComponent {
  roles = ['Admin', 'Editor', 'Viewer', 'Auditor', 'Billing', 'Support'];
  assigned: string[] = ['Editor'];

  many = Array.from({ length: 500 }, (_, i) => `Item ${i + 1}`);
  manyTarget: string[] = [];

  basicCode = `<cw-pick-list [options]="roles" [(ngModel)]="assigned" />`;
  virtualCode = `// 500 items — each list is virtualized with ngx-cerious-scroll
<cw-pick-list [options]="many" [(ngModel)]="target" />`;
}
