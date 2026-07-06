import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CwMegaMenuItem, MegaMenuComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-mega-menu-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MegaMenuComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="MegaMenu" description="A horizontal menu bar whose top-level items open wide, multi-column dropdown panels.">
      <app-demo-section title="Storefront nav" [code]="code">
        <div style="min-height: 16rem;">
          <cw-mega-menu [items]="items" (itemClick)="last.set($event.label)" />
          <p style="color: var(--cw-text-muted); font-size: 0.875rem; margin-top: 0.75rem;">Last: {{ last() }}</p>
        </div>
      </app-demo-section>
    </app-demo-page>
  `
})
export class MegaMenuDemoComponent {
  readonly last = signal('—');
  private cmd = (label: string) => ({ label, command: () => this.last.set(label) });

  items: CwMegaMenuItem[] = [
    { label: 'Products', columns: [
      { header: 'Audio', items: [this.cmd('Headphones'), this.cmd('Speakers'), this.cmd('Microphones')] },
      { header: 'Video', items: [this.cmd('Monitors'), this.cmd('Cameras'), this.cmd('Projectors')] },
      { header: 'Accessories', items: [this.cmd('Cables'), this.cmd('Stands'), this.cmd('Cases')] }
    ] },
    { label: 'Solutions', columns: [
      { header: 'By industry', items: [this.cmd('Education'), this.cmd('Healthcare'), this.cmd('Retail')] },
      { header: 'By size', items: [this.cmd('Startup'), this.cmd('Enterprise')] }
    ] },
    { label: 'Support', command: () => this.last.set('Support') }
  ];

  code = `<cw-mega-menu [items]="[
  { label: 'Products', columns: [
    { header: 'Audio', items: [{ label: 'Headphones' }] }
  ] }
]" />`;
}
