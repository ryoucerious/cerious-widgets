import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListboxComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-listbox-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListboxComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Listbox" description="An inline selection list — single or multiple — virtualized with ngx-cerious-scroll for large sets.">
      <app-demo-section title="Single" [code]="singleCode">
        <cw-listbox [options]="cities" [(ngModel)]="city" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">City: {{ city ?? '—' }}</span>
      </app-demo-section>

      <app-demo-section title="Multiple with checkboxes" [code]="multipleCode">
        <cw-listbox [options]="cities" multiple [(ngModel)]="picked" />
      </app-demo-section>

      <app-demo-section title="5,000 options — virtualized + filter" description="Only the visible rows exist in the DOM." [code]="virtualCode">
        <cw-listbox [options]="many" filterable [(ngModel)]="item" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class ListboxDemoComponent {
  cities = ['New York', 'London', 'Tokyo', 'Sydney', 'Berlin'];
  city: string | null = null;
  picked: string[] = ['London'];

  many = Array.from({ length: 5000 }, (_, i) => `Item ${i + 1}`);
  item: string | null = null;

  singleCode = `<cw-listbox [options]="cities" [(ngModel)]="city" />`;
  multipleCode = `<cw-listbox [options]="cities" multiple [(ngModel)]="picked" />`;
  virtualCode = `// 5,000 options — virtualized with ngx-cerious-scroll
<cw-listbox [options]="many" filterable [(ngModel)]="item" />`;
}
