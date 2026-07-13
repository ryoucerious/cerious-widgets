import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-select-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectComponent, FormsModule, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="Select" description="A single-select dropdown built on the overlay foundation, with full ngModel / reactive-forms support and keyboard navigation.">
      <app-demo-section title="Basic" description="Bind with ngModel. Try the keyboard: ↑ ↓ to move, Enter to select, Esc to close." [code]="basicCode">
        <cw-select [options]="cities" [(ngModel)]="city" placeholder="Select a city" />
        <span style="color: var(--cw-text-muted); font-size: 0.875rem;">Selected: {{ city ?? '—' }}</span>
      </app-demo-section>

      <app-demo-section title="Primitive options" description="Options can be plain strings or numbers." [code]="primitiveCode">
        <cw-select [options]="sizes" [(ngModel)]="size" placeholder="Size" style="min-width: 8rem;" />
      </app-demo-section>

      <app-demo-section title="Disabled" [code]="disabledCode">
        <cw-select [options]="cities" [disabled]="true" placeholder="Disabled" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class SelectDemoComponent {
  cities = [
    { label: 'New York', value: 'ny' },
    { label: 'London', value: 'ld' },
    { label: 'Tokyo', value: 'tk' },
    { label: 'Sydney', value: 'sy' },
    { label: 'Berlin', value: 'br' }
  ];
  city: string | null = null;

  sizes = ['Small', 'Medium', 'Large'];
  size: string | null = null;

  basicCode = `<cw-select [options]="cities" [(ngModel)]="city" placeholder="Select a city" />`;
  primitiveCode = `sizes = ['Small', 'Medium', 'Large'];

<cw-select [options]="sizes" [(ngModel)]="size" />`;
  disabledCode = `<cw-select [options]="cities" [disabled]="true" />`;
}
